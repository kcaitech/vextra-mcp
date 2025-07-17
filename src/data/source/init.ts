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
import { text2path } from "./text2path";
import { initModule as initData } from '@kcaitech/vextra-core';
import { Path2D, Canvas, Image, DOMMatrix } from 'skia-canvas';

let __inited: boolean = false;

let _measure = measure;
let _text2path = text2path;


export async function initDataModule() {
    if (__inited) return;

    initData(_measure, _text2path, {
        Path2D: Path2D as any,
        OffscreenCanvas: Canvas as any,
        Image: Image as any,
        DOMMatrix: DOMMatrix as any,
    })

    __inited = true;
}

