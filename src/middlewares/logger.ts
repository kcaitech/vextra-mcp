/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */


import { Request, Response, NextFunction } from 'express';

// 基础请求日志记录
export const Logger = (req: Request, res: Response, next: NextFunction) => {
  console.info(`${req.method} ${req.url}`);
  next();
};
