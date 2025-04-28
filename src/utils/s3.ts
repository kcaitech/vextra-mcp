import { IStorage } from "@kcdesign/data"
import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import {StorageOptions} from "./ws"

export default class S3Storage implements IStorage {
    private client: S3Client
    private options: StorageOptions

    constructor(options: StorageOptions) {
        this.client = new S3Client({
            endpoint: options.endPoint,
            region: options.region,
            tls: false,
            credentials: {
                accessKeyId: options.accessKey,
                secretAccessKey: options.secretKey,
                sessionToken: options.sessionToken,
            },
            forcePathStyle: true,
            signingRegion: options.region,
        });
        this.options = options
    }

    public get(uri: string, versionId?: string): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve, reject) => {
            const command = new GetObjectCommand({
                Bucket: this.options.bucketName,
                Key: uri,
                VersionId: versionId,
            })
            this.client.send(command).then(response => {
                response.Body!.transformToByteArray().then(resolve)
            }).catch(reject)
        })
    }

    public put(uri: string, data: Uint8Array, contentType: string = "application/json"): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const command = new PutObjectCommand({
                Bucket: this.options.bucketName,
                Key: uri,
                Body: data,
                ContentType: contentType,
            })
            this.client.send(command).then(response => resolve()).catch(reject)
        })
    }
}
