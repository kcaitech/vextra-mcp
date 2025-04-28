import { IStorage } from "@kcdesign/data"
import OSS from "ali-oss"
import {StorageOptions} from "./ws"

export default class OssStorage implements IStorage {
    private client: OSS
    private options: StorageOptions

    constructor(options: StorageOptions) {
        this.client = new OSS({
            endpoint: options.endPoint,
            region: options.region,
            accessKeyId: options.accessKey,
            accessKeySecret: options.secretKey,
            stsToken: options.sessionToken,
            bucket: options.bucketName,
            secure: false,
            internal: true,
            cname: true,
        })
        this.options = options
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
        try {
            return await this._get(uri, versionId)
        } catch (err) {
            return await this._get(uri)
        }
    }

    public async put(uri: string, data: Uint8Array, contentType: string = "application/json"): Promise<void> {
        await this.client.put(uri, data.buffer, {headers: {"Content-Type": contentType}})
    }
}
