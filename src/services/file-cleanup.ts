import { getStorage } from "@/services/storage";

class FileCleanupService {
    private cleanupInterval: NodeJS.Timeout | null = null;
    private readonly EXPIRY_DAYS = 3; // 文件保留3天,防止在日期交替时删除了刚生成的图片

    constructor() {
        this.startCleanupScheduler();
    }

    /**
     * 生成文件路径
     * 格式: images/{date}/{sessionId}/{fileName}
     */
    generateFilePath(time: number, sessionId: string, fileName: string): string {
        const date = new Date(time).toISOString().split('T')[0]; // YYYY-MM-DD
        return `images/${date}/${sessionId}/${fileName}`;
    }

    /**
     * 清理过期的文件
     * 基于OSS文件路径中的日期进行清理
     */
    async cleanupExpiredFiles(): Promise<void> {

        try {
            // 获取所有图片文件路径
            const expiredFiles = await this.findExpiredFiles();

            if (expiredFiles.length === 0) {
                console.log("No expired files found");
                return;
            }

            // 删除过期文件
            let deletedCount = 0;
            for (const filePath of expiredFiles) {
                try {
                    await this.deleteFile(filePath);
                    deletedCount++;
                } catch (error) {
                    console.error(`Failed to delete file ${filePath}:`, error);
                }
            }

            console.log(`Cleaned up ${deletedCount} expired files out of ${expiredFiles.length} found`);
        } catch (error) {
            console.error("Error during file cleanup:", error);
        }
    }

    /**
     * 查找过期的文件
     * 通过按日期前缀查找，避免一次性加载所有文件
     */
    private async findExpiredFiles(): Promise<string[]> {
        const storage = getStorage();
        const expiredFiles: string[] = [];

        try {
            // 计算开始查找日期：当前日期 - EXPIRY_DAYS天 - 额外缓冲天数
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - this.EXPIRY_DAYS - this.EXPIRY_DAYS); // 额外往前EXPIRY_DAYS天，确保不遗漏

            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() - this.EXPIRY_DAYS);
            const expiryDateStr = expiryDate.toISOString().split('T')[0]; // YYYY-MM-DD

            console.log(`Searching files from ${startDate.toISOString().split('T')[0]} to ${expiryDateStr}`);

            // 按日期遍历，只查找可能包含过期文件的日期文件夹
            const currentDate = new Date(startDate);
            let totalFilesFound = 0;

            while (currentDate <= expiryDate) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const prefix = `images/${dateStr}/`;

                try {
                    const files = await storage.list(prefix);
                    if (files.length > 0) {
                        console.log(`Found ${files.length} files for date: ${dateStr}`);
                        expiredFiles.push(...files);
                        totalFilesFound += files.length;
                    }
                } catch (error) {
                    // 该日期文件夹不存在，跳过
                    console.log(`No files found for date: ${dateStr}`);
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            console.log(`Found ${expiredFiles.length} expired files from ${totalFilesFound} total files in date range`);

        } catch (error) {
            console.error("Error finding expired files:", error);
        }

        return expiredFiles;
    }

    /**
     * 删除单个文件
     */
    private async deleteFile(filePath: string): Promise<void> {
        const storage = getStorage();

        try {
            await storage.delete(filePath);
            console.log(`Successfully deleted file: ${filePath}`);
        } catch (error) {
            console.error(`Failed to delete file ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * 清理指定会话的所有文件
     * 通过OSS路径模式查找并删除
     */
    async cleanupSessionFiles(time: number, sessionId: string): Promise<void> {

        try {

            console.log(`Cleaning up files for session: ${sessionId}`);

            // 查找该会话的所有文件
            const sessionFiles = await this.findSessionFiles(time, sessionId);

            if (sessionFiles.length === 0) {
                console.log(`No files found for session ${sessionId}`);
                return;
            }

            // 删除会话文件
            let deletedCount = 0;
            for (const filePath of sessionFiles) {
                try {
                    await this.deleteFile(filePath);
                    deletedCount++;
                } catch (error) {
                    console.error(`Failed to delete session file ${filePath}:`, error);
                }
            }

            console.log(`Cleaned up ${deletedCount} files for session ${sessionId}`);
        } catch (error) {
            console.error(`Error cleaning up session ${sessionId}:`, error);
        }
    }

    /**
     * 查找指定会话的所有文件
     */
    private async findSessionFiles(time: number, sessionId: string): Promise<string[]> {
        const storage = getStorage();

        try {
            console.log(`Looking for files with session: ${sessionId}`);
            const date = new Date(time).toISOString().split('T')[0]; // YYYY-MM-DD
            // 获取所有images/前缀的文件
            const allFiles = await storage.list(`images/${date}/`);

            // 过滤出指定会话的文件
            const sessionFiles = allFiles.filter(file => {
                const parts = file.split('/');
                if (parts.length >= 3) {
                    const fileSessionId = parts[2]; // images/date/sessionId/filename
                    return fileSessionId === sessionId;
                }
                return false;
            });

            console.log(`Found ${sessionFiles.length} files for session ${sessionId}`);
            return sessionFiles;

        } catch (error) {
            console.error(`Error finding session files for ${sessionId}:`, error);
            return [];
        }
    }

    /**
     * 启动清理调度器
     */
    private startCleanupScheduler(): void {
        // 每小时运行一次清理
        this.cleanupInterval = setInterval(async () => {
            await this.cleanupExpiredFiles();
        }, 60 * 60 * 1000); // 1小时

        console.log("File cleanup scheduler started (every hour)");
    }

    /**
     * 停止清理调度器
     */
    stopCleanupScheduler(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
            console.log("File cleanup scheduler stopped");
        }
    }
}

// 创建全局实例
export const fileCleanupService = new FileCleanupService();

// 导出清理会话文件的函数，供其他地方使用
export async function cleanupSessionFiles(time: number, sessionId: string): Promise<void> {
    await fileCleanupService.cleanupSessionFiles(time, sessionId);
} 