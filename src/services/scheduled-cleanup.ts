import { fileCleanupService } from "./file-cleanup";
import { getRedisManager, REDIS_CLEANUP_LAST_TIME_KEY, REDIS_CLEANUP_LOCK_KEY } from "@/providers/redis";

class ScheduledCleanupService {
    private cleanupInterval: NodeJS.Timeout | null = null;
    private readonly CLEANUP_INTERVAL_HOURS = 24; // 每24小时清理一次
    private readonly CLEANUP_LOCK_KEY = REDIS_CLEANUP_LOCK_KEY;
    private readonly CLEANUP_LOCK_TTL = 3600; // 锁的TTL为1小时
    private readonly LAST_CLEANUP_KEY = REDIS_CLEANUP_LAST_TIME_KEY;

    constructor() {
        this.startScheduledCleanup();
    }

    /**
     * 启动定时清理服务
     */
    private startScheduledCleanup(): void {
        // // 立即执行一次清理
        // setTimeout(async () => {
        //     await this.performCleanup();
        // }, 1000 * 60 * 30);

        // 设置定时清理
        this.cleanupInterval = setInterval(async () => {
            await this.performCleanup();
        }, this.CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000);

        console.log(`Scheduled cleanup service started (every ${this.CLEANUP_INTERVAL_HOURS} hours)`);
    }

    /**
     * 执行清理操作
     */
    private async performCleanup(): Promise<void> {
        try {
            console.log("Checking if cleanup is needed...");
            
            // 检查是否需要清理
            const shouldCleanup = await this.shouldPerformCleanup();
            if (!shouldCleanup) {
                console.log("Cleanup not needed, skipping");
                return;
            }

            console.log("Cleanup needed, attempting to acquire cleanup lock...");
            
            // 尝试获取清理锁
            const lockAcquired = await this.acquireCleanupLock();
            if (!lockAcquired) {
                console.log("Cleanup lock not acquired, skipping cleanup");
                return;
            }

            // 再检查一次是否需要清理
            const shouldCleanupAgain = await this.shouldPerformCleanup();
            if (!shouldCleanupAgain) {
                console.log("Cleanup not needed, skipping");
                return;
            }

            console.log("Cleanup lock acquired, starting scheduled cleanup...");
            
            // 清理过期的文件
            await fileCleanupService.cleanupExpiredFiles();
            
            // 更新最后清理时间
            await this.updateLastCleanupTime();
            
            console.log("Scheduled cleanup completed");
            
        } catch (error) {
            console.error("Error during scheduled cleanup:", error);
        } finally {
            // 释放清理锁
            await this.releaseCleanupLock();
        }
    }

    /**
     * 获取清理锁
     * 使用Redis的SET NX EX命令实现分布式锁
     */
    private async acquireCleanupLock(): Promise<boolean> {
        try {
            const redisManager = getRedisManager();
            if (!redisManager) {
                console.warn("Redis not available, proceeding without lock");
                return true;
            }

            const lockValue = `${Date.now()}-${process.pid}`;
            const result = await redisManager.setWithExpiry(
                this.CLEANUP_LOCK_KEY, 
                lockValue, 
                this.CLEANUP_LOCK_TTL
            );

            if (result) {
                console.log(`Cleanup lock acquired by ${lockValue}`);
                return true;
            } else {
                console.log("Cleanup lock already held by another instance");
                return false;
            }
        } catch (error) {
            console.error("Error acquiring cleanup lock:", error);
            // 如果Redis不可用，允许继续执行清理
            return true;
        }
    }

    /**
     * 检查是否需要执行清理
     * 基于上次清理时间和清理间隔判断
     */
    private async shouldPerformCleanup(): Promise<boolean> {
        try {
            const redisManager = getRedisManager();

            // 获取上次清理时间
            const lastCleanupTimeStr = await redisManager.get(this.LAST_CLEANUP_KEY);
            if (!lastCleanupTimeStr) {
                console.log("No last cleanup time found, cleanup needed");
                return true;
            }

            const lastCleanupTime = parseInt(lastCleanupTimeStr);
            const currentTime = Date.now();
            const timeSinceLastCleanup = currentTime - lastCleanupTime;
            const requiredInterval = this.CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000; // 转换为毫秒

            if (timeSinceLastCleanup >= requiredInterval) {
                console.log(`Last cleanup was ${Math.floor(timeSinceLastCleanup / (60 * 60 * 1000))} hours ago, cleanup needed`);
                return true;
            } else {
                const remainingHours = Math.ceil((requiredInterval - timeSinceLastCleanup) / (60 * 60 * 1000));
                console.log(`Last cleanup was ${Math.floor(timeSinceLastCleanup / (60 * 60 * 1000))} hours ago, cleanup not needed (${remainingHours} hours remaining)`);
                return false;
            }
        } catch (error) {
            console.error("Error checking cleanup time:", error);
            // 如果Redis不可用，允许继续执行清理
            return true;
        }
    }

    /**
     * 更新最后清理时间
     */
    private async updateLastCleanupTime(): Promise<void> {
        try {
            const redisManager = getRedisManager();

            const currentTime = Date.now().toString();
            await redisManager.set(this.LAST_CLEANUP_KEY, currentTime);
            console.log(`Updated last cleanup time: ${new Date(parseInt(currentTime)).toISOString()}`);
        } catch (error) {
            console.error("Error updating last cleanup time:", error);
        }
    }

    /**
     * 释放清理锁
     */
    private async releaseCleanupLock(): Promise<void> {
        try {
            const redisManager = getRedisManager();
            if (!redisManager) {
                return;
            }

            await redisManager.delete(this.CLEANUP_LOCK_KEY);
            console.log("Cleanup lock released");
        } catch (error) {
            console.error("Error releasing cleanup lock:", error);
        }
    }

    /**
     * 停止定时清理服务
     */
    stopScheduledCleanup(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
            console.log("Scheduled cleanup service stopped");
        }
    }

    /**
     * 手动触发清理
     */
    async triggerCleanup(): Promise<void> {
        await this.performCleanup();
    }
}

export function startScheduledCleanup() {
    // 创建全局实例
    const scheduledCleanupService = new ScheduledCleanupService();
    
    // 在应用关闭时停止服务
    process.on('SIGINT', () => {
        scheduledCleanupService.stopScheduledCleanup();
    });
    
    process.on('SIGTERM', () => {
        scheduledCleanupService.stopScheduledCleanup();
    }); 
}
