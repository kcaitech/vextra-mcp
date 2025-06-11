/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { Artboard, PathShape, Shape } from "@kcdesign/data";
import { CornerTrait } from "./copy";

export function convertCornerTrait(shape: Shape): CornerTrait {
    return {
        cornerRadius: (shape as Artboard).cornerRadius?.lt ?? (shape as PathShape).fixedRadius,
        rectangleCornerRadii: (shape as Artboard).cornerRadius ? [
            (shape as Artboard).cornerRadius!.lt,
            (shape as Artboard).cornerRadius!.rt,
            (shape as Artboard).cornerRadius!.rb,
            (shape as Artboard).cornerRadius!.lb,
        ] : undefined
    }
}