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
import { DefaultShapeTraits } from "./copy";
import { convertIsLayerTrait } from "./IsLayerTrait";
import { convertHasBlendModeAndOpacityTrait } from "./BlendMode";
import { convertHasLayoutTrait } from "./HasLayoutTrait";
import { convertHasGeometryTrait } from "./HasGeometryTrait";
import { convertHasEffectsTrait } from "./HasEffectsTrait";
import { convertHasMaskTrait } from "./HasMaskTrait";

export function convertDefaultShapeTraits(shape: Shape): DefaultShapeTraits {
    return {
        ...convertIsLayerTrait(shape),
        ...convertHasBlendModeAndOpacityTrait(shape),
        ...convertHasLayoutTrait(shape),
        ...convertHasGeometryTrait(shape),
        ...convertHasEffectsTrait(shape),
        ...convertHasMaskTrait(shape),
    }
}