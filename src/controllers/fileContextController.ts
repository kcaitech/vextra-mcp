import { Request, Response } from 'express';
import { getFileContext } from '../utils/ws';
import { convertGetFileResponse } from '@kcdesign/data';

export const fileContextController = async (req: Request, res: Response) => {
  const fileKey = req.params.fileKey; // 必填参数

  if (!fileKey || typeof fileKey !== 'string') {
    res.status(400).json({ message: 'Missing required parameter: fileKey' });
    return
  }

  const file = await getFileContext(fileKey);

  const pages = file.data.pagesMgr.keys.map((key) => file.data.pagesMgr.getSync(key))

  const data = {
    id: file.data.id,
    name: file.data.name,
    role: 'owner',
    lastModified: '',
    editorType: 'figma',
    version: '',
    locked: false,
    visible: true,
    type: 'Document',
    pages,
  }

  res.json(convertGetFileResponse(data as any));
};
