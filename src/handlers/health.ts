import { Request, Response } from "express";
import { getRedisManager } from "@/providers/redis";

export async function healthHandler(req: Request, res: Response) {
    try {
        const redisManager = getRedisManager();
        try {
            await redisManager.ping();
        } catch (error) {
            console.error('Redis connection failed:', error);
            res.status(500).json({status: 'unhealthy'});
            return;
        }

        res.status(200).json({status: 'healthy'});
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}