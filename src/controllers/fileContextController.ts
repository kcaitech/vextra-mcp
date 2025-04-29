import { Request, Response } from 'express';
import { getFileContext } from '../utils/ws';

export const fileContextController = async (req: Request, res: Response) => {
  const fileKey = req.params.fileKey; // 必填参数
  const nodeId = req.params.nodeId; // 选填参数  

  if (!fileKey || typeof fileKey !== 'string') {
     res.status(400).json({ message: 'Missing required parameter: fileKey' });
     return
  }

  const file = await getFileContext(fileKey);

  res.json({
    message: 'File route accessed successfully',
  });
};
