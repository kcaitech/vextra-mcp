/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import express, { Request, Response } from 'express';
import { requestLogger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';


import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { DocumentRemote, DocumentLocal, initDataModule, IDocument } from './index';
import { WS_TOKEN } from './config';

function getDocument(fileKey: string) {
  if (fileKey.startsWith('file://')) {
    return new DocumentLocal(fileKey);
  } else {
    return new DocumentRemote(WS_TOKEN, fileKey);
  }
}

// map fileKey to document
const documentMap = new Map<string, IDocument>();
async function getFileContext(req: Request, res: Response) {
  const fileKey = req.params.fileKey; // 必填参数

  if (!fileKey || typeof fileKey !== 'string') {
    res.status(400).json({ message: 'Missing required parameter: fileKey' });
    return
  }

  var document = documentMap.get(fileKey);
  if (!document) {
    // 判断fileKey是否是本地文件
    document = getDocument(fileKey);
    await document.load();
    documentMap.set(fileKey, document);
  }

  const data = await document.getFileContext();

  res.json(data);
}


const argv = yargs(hideBin(process.argv))
  .option('p', {
    alias: 'port',
    describe: '指定服务器端口',
    type: 'number',
    default: 3002
  })
  .help()
  .parseSync();

const app = express();
const port = argv.p || 80;

app.use(errorHandler);
app.use(requestLogger);

const v1 = express.Router();

v1.get('/:fileKey', getFileContext);

app.use('/api/v1', v1);

app.get('/', (req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

initDataModule().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
})

