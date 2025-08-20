import { IO } from "@kcdesign/data"
import OSS from "ali-oss"
import AWS from "aws-sdk"
AWS.config.correctClockSkew = true

export type StorageOptions = {
    endPoint: string
    region: string
    accessKey: string
    secretKey: string
    sessionToken?: string | undefined
    bucketName: string
    secure: boolean
    internal: boolean
    cname: boolean
}

// 扩展IStorage接口，添加list和delete方法
export interface IExtendedStorage extends IO.IStorage {
    list(prefix?: string): Promise<string[]>;
    delete(uri: string): Promise<void>;
    signUrl(uri: string, expiresInSeconds?: number): Promise<string>;
}

export class S3Storage implements IExtendedStorage {
    private client: AWS.S3
    private options: StorageOptions

    constructor(options: StorageOptions) {
        this.client = new AWS.S3({
            endpoint: options.endPoint,
            region: options.region,
            signatureVersion: "v4",
            credentials: {
                accessKeyId: options.accessKey,
                secretAccessKey: options.secretKey,
                sessionToken: options.sessionToken,
            },
            s3ForcePathStyle: true,
            sslEnabled: options.secure,
            correctClockSkew: true,
        })
        this.options = options
    }

    public get(uri: string, versionId?: string): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve, reject) => {
            this.client.getObject({
                Bucket: this.options.bucketName,
                Key: uri,
                VersionId: versionId,
            }, (err, data) => {
                if (err) {
                    console.log(err)
                    resolve(new Uint8Array())
                    return
                }
                resolve(data.Body as Uint8Array)
            })
        })
    }

    // 将二进制数据上传到指定的路径
    public put(uri: string, data: Uint8Array, contentType: string = "application/json"): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.client.putObject({
                Bucket: this.options.bucketName,
                Key: uri,
                Body: data,
                ContentType: contentType,
            }, (err, data) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }

    // 生成带签名的访问URL
    public async signUrl(path: string, expiresInSeconds: number = 3600): Promise<string> {
        try {
            const url = await this.client.getSignedUrl('getObject', {
                Bucket: this.options.bucketName,
                Key: path,
                Expires: expiresInSeconds
            });

            return url;

        } catch (error) {
            console.error(`Error generating signed URL for ${path}:`, error);
            throw error;
        }
    }

    // 列出指定前缀的文件
    public async list(prefix?: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            const params: AWS.S3.ListObjectsV2Request = {
                Bucket: this.options.bucketName,
            };

            if (prefix) {
                params.Prefix = prefix;
            }

            this.client.listObjectsV2(params, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                const files = data.Contents?.map(obj => obj.Key!).filter(key => key !== undefined) || [];
                resolve(files);
            });
        });
    }

    // 删除指定文件
    public async delete(uri: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.client.deleteObject({
                Bucket: this.options.bucketName,
                Key: uri,
            }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}

export class OssStorage implements IExtendedStorage {
    private client: OSS

    constructor(options: StorageOptions) {
        this.client = new OSS({
            endpoint: `${options.bucketName}.${options.endPoint}`,
            region: options.region,
            accessKeyId: options.accessKey,
            accessKeySecret: options.secretKey,
            bucket: options.bucketName,
            secure: options.secure,
            internal: options.internal,
            cname: options.cname,
        })
    }

    private async _get(uri: string, versionId?: string): Promise<Uint8Array> {
        const result = await this.client.get(uri, {
            versionId: versionId,
        })
        if (result.res.status !== 200) {
            throw new Error(`${uri} 请求失败 status:${result.res.status}`)
        } else if (!(result.content instanceof Uint8Array)) {
            throw new Error(`${uri} 数据类型错误 content:${typeof result.content}`)
        }
        return result.content
    }

    public async get(uri: string, versionId?: string): Promise<Uint8Array> {
        let result: Uint8Array
        try {
            result = await this._get(uri, versionId)
        } catch (err) {
            console.log(err)
            result = await this._get(uri).catch(() => {
                return new Uint8Array()
            })
        }
        return result
    }

    // 将二进制数据上传到指定的路径
    public async put(uri: string, data: Uint8Array, contentType: string = "application/json"): Promise<void> {
        await this.client.put(uri, Buffer.from(data), { headers: { "Content-Type": contentType } })
    }

    // 列出指定前缀的文件
    public async list(prefix?: string): Promise<string[]> {
        try {
            const result = await this.client.list({
                prefix: prefix || '',
                'max-keys': 1000, // 限制返回数量
            }, {});

            return result.objects?.map(obj => obj.name) || [];
        } catch (error) {
            console.error('Error listing OSS files:', error);
            return [];
        }
    }

    // 删除指定文件
    public async delete(uri: string): Promise<void> {
        try {
            await this.client.delete(uri);
        } catch (error) {
            console.error(`Error deleting OSS file ${uri}:`, error);
            throw error;
        }
    }

    // 生成带签名的访问URL
    public async signUrl(path: string, expiresInSeconds: number = 3600): Promise<string> {
        try {
            const url = await this.client.signatureUrl(path, {
                expires: expiresInSeconds,
                method: 'GET'
            });

            return url;

        } catch (error) {
            console.error(`Error generating signed URL for ${path}:`, error);
            throw error;
        }
    }
}


export type Provider = 'oss' | 'minio' | 's3'

export async function getStorageClass(provider: Provider): Promise<new (options: StorageOptions) => IO.IStorage> {
    let storage

    if (provider === 'oss') storage = OssStorage;
    else if (provider === 'minio') storage = S3Storage;
    else if (provider === 's3') storage = S3Storage;
    else storage = OssStorage;

    return storage
}