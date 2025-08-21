import { IExtendedStorage, StorageOptions, S3Storage, OssStorage } from "@/providers/storage"
import { getStoragePublicUrl, Storage as StorageConfig } from "@/config"

let _storage: IExtendedStorage

export async function initStorage(storageConfig: StorageConfig) { 
    if (_storage) {
        return _storage
    }

    const provider = storageConfig.provider

    if (provider !== "oss" && provider !== "minio" && provider !== "s3") {
        throw new Error("unknow storage provider:" + provider + ". only support: oss, minio, s3")
    }

    const storageOptions: StorageOptions = {
        endPoint: storageConfig.endpoint,
        region: storageConfig.region,
        accessKey: storageConfig.accessKeyID,
        secretKey: storageConfig.secretAccessKey,
        bucketName: storageConfig.mcpBucket,
        secure: false,
        internal: true,
        cname: true,
    }
    _storage = storageConfig.provider === "oss" ? new OssStorage(storageOptions) : new S3Storage(storageOptions)
    return _storage
}

export function getStorage(): IExtendedStorage {
    if (!_storage) {
        throw new Error("Storage not initialized")
    }
    return _storage
}
