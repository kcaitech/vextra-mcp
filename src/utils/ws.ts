import { WSClient as Communication, HttpCode } from "../pal";
import { COMMUNICATION_URL } from "./setting";
import { IStorage, Document } from "@kcdesign/data";
import { openDocument } from "@kcdesign/editor"

export interface IContext {
    get data(): Document;
}
export type StorageOptions = {
    endPoint: string
    region: string
    accessKey: string
    secretKey: string
    sessionToken?: string | undefined
    bucketName: string
}

export class StorageBridge implements IStorage {
    private _impl: IStorage;
    constructor(impl: IStorage) {
        this._impl = impl;
    }
    update(impl: IStorage) {
        this._impl = impl;
    }
    get(uri: string, versionId?: string): Promise<Uint8Array> {
        return this._impl.get(uri, versionId);
    }
    put(uri: string, data: Uint8Array, contentType?: string): Promise<void> {
        return this._impl.put(uri, data, contentType);
    }
}

export type Provider = 'oss' | 'minio' | 's3'

export async function getStorageClass(provider: Provider): Promise<new (options: StorageOptions) => IStorage> {
    let storage

    if (provider === 'oss') storage = (await import('./oss')).default;
    else if (provider === 'minio') storage = (await import('./s3')).default;
    else if (provider === 's3') storage = (await import('./s3')).default;
    else storage = (await import('./oss')).default;

    return storage
}


let storageBridge: StorageBridge;

const communication = new Communication(COMMUNICATION_URL);

export async function getFileContext(fileKey: string) {
    const ret = await communication.bind(fileKey);
    if (ret.code === HttpCode.StatusContentReviewFail) {
        throw new Error('文件正在审核中，请稍后再试');
    }
    if (ret.code === HttpCode.StatusNotFound) {
        throw new Error('文件不存在或已被删除');
    }

    if (ret.code === HttpCode.StatusForbidden) {
        throw new Error('文件已被锁定或没有权限访问');
    }

    const docInfoData = ret.data.doc_info;
    const docKeyData = ret.data.access_key;

    const perm = docInfoData.document_permission.perm_type;
    if (perm === 0) {
        throw new Error('文件已被锁定或没有权限访问');
    }

    const storageOptions: StorageOptions = {
        endPoint: docKeyData.endpoint,
        region: docKeyData.region,
        accessKey: docKeyData.access_key,
        secretKey: docKeyData.secret_access_key,
        sessionToken: docKeyData.session_token,
        bucketName: docKeyData.bucket_name,
    }

    const storage = new (await getStorageClass(docKeyData.provider))(storageOptions);
    const path = docInfoData.document.path;
    const versionId = docInfoData.document.version_id ?? "";

    storageBridge = new StorageBridge(storage);

    const result = await openDocument({ source: 'storage', storage: storageBridge, path, fid: "", versionId });
    if (!result?.data) throw new Error('文件打开失败，请稍后再试');

    return result.data;
}

