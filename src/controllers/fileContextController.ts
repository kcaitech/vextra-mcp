import { Request, Response } from 'express';
import { getFileContext } from '../utils/ws';

export const fileContextController = async (req: Request, res: Response) => {
  const { fileKey, depth, nodeId } = req.query;

  console.log('- qurey', JSON.stringify(req.query, null, 2));
  

  if (!fileKey || typeof fileKey !== 'string') {
     res.status(400).json({ message: 'Missing required parameter: fileKey' });
     return
  }

  const file = await getFileContext(fileKey);

  console.log('- files', JSON.stringify(file, null, 2));


  // Example logic for handling fileKey, depth, and nodeId
  res.json({
    message: 'File route accessed successfully',
    fileKey,
    depth: depth || 'default',
    nodeId: nodeId || 'none',
  });
};
