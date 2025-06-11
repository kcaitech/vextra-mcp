/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { Shape } from "@kcdesign/data";
import { HasMaskTrait } from "./copy"

export function convertHasMaskTrait(shape: Shape): HasMaskTrait {
    return {
        isMask: shape.mask,
        maskType: shape.mask ? 'ALPHA' : undefined,
        isMaskOutline: true
    }
}