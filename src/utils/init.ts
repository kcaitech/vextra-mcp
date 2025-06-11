/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { measure } from "./measure";
import { text2path } from "@kcaitech/text2path";
import { initModule as initData } from '@kcdesign/data';

let __inited: boolean = false;

let _measure = measure;
let _text2path = text2path;

export function initModule(measure?: typeof _measure, text2path?: typeof _text2path) {
    // if (!measure || !text2path) throw new Error('measure or text2path is undefined')
    if (measure) _measure = measure;
    if (text2path) _text2path = text2path;
}

export async function initDataModule() {
    if (__inited) return;

    initData(_measure, _text2path)

    __inited = true;
}
