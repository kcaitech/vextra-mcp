/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { Artboard } from "@kcdesign/data";
import { convertIsLayerTrait } from "./IsLayerTrait";
import { FrameTraits } from "./copy";
import { convertHasBlendModeAndOpacityTrait } from "./BlendMode";
import { convertHasGeometryTrait } from "./HasGeometryTrait";
import { convertHasEffectsTrait } from "./HasEffectsTrait";
import { convertHasMaskTrait } from "./HasMaskTrait";
import { convertHasFramePropertiesTrait } from "./HasFramePropertiesTrait";
import { convertCornerTrait } from "./CornerTrait";
import { convertHasLayoutTrait } from "./HasLayoutTrait";
import { convertIndividualStrokesTrait } from "./IndividualStrokesTrait";
import { convertChildren } from "./SubChildren";

export function convertFrameTraits(shape: Artboard): FrameTraits {
    return {
        ...convertIsLayerTrait(shape),
        ...convertHasBlendModeAndOpacityTrait(shape),
        /* HasChildrenTrait */
        children: convertChildren(shape.childs),
        ...convertHasLayoutTrait(shape),
        ...convertHasFramePropertiesTrait(shape),
        ...convertCornerTrait(shape),
        ...convertHasGeometryTrait(shape),
        ...convertHasEffectsTrait(shape),
        ...convertHasMaskTrait(shape),
        /* TransitionSourceTrait */
        /* IndividualStrokesTrait */
        ...convertIndividualStrokesTrait(shape),
    }
}