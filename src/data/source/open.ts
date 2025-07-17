/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { IO, TransactDataGuard, Document } from "@kcaitech/vextra-core";
import { initDataModule } from "./init";
import { SupportedFormatsType } from "./consts";


export async function openDocument(file: string, fmt: SupportedFormatsType) {
    await initDataModule();

    const repo = new TransactDataGuard();
    let data: Document | undefined;

    if (fmt === 'sketch') {
        data = await IO.importSketch(file, repo);
    } else if (fmt === 'fig') {
        data = await IO.importFigma(file, repo)
    } else if (fmt === 'vext') {
        data = await IO.importVext(file, repo);
    } else if (fmt === 'svg') {
        data = await IO.importSvg(file, repo);
    }

    return data;
}
