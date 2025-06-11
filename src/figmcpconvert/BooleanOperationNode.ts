/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import * as classes from "@kcdesign/data";
import { BooleanOperationNode } from "./copy";
import { convertHasLayoutTrait } from "./HasLayoutTrait";
import { convertHasGeometryTrait } from "./HasGeometryTrait";
import { convertHasEffectsTrait } from "./HasEffectsTrait";
import { convertHasMaskTrait } from "./HasMaskTrait";
import { convertIsLayerTrait } from "./IsLayerTrait";
import { convertHasBlendModeAndOpacityTrait } from "./BlendMode";
import { convertChildren } from "./SubChildren";

function boolOPToString(boolOp?: classes.BoolOp) {
    switch (boolOp) {
        case classes.BoolOp.Diff:
            return "EXCLUDE";
        case classes.BoolOp.Union:
            return "UNION";
        case classes.BoolOp.Intersect:
            return "INTERSECT";
        case classes.BoolOp.Subtract:
            return "SUBTRACT";
        case classes.BoolOp.None:
        default:
            return 'UNION'
    }
}

export function convertBooleanOperationNode(bool: classes.BoolShape): BooleanOperationNode {
    return {
        ...convertIsLayerTrait(bool),
        type: 'BOOLEAN_OPERATION',
        booleanOperation: boolOPToString(bool.boolOp),
        ...convertHasBlendModeAndOpacityTrait(bool),
        ...convertHasLayoutTrait(bool as unknown as (classes.Shape & { __parent: classes.Shape })),
        ...convertHasGeometryTrait(bool),
        ...convertHasEffectsTrait(bool),
        ...convertHasMaskTrait(bool),
        children: convertChildren(bool.childs)
        /* TransitionSourceTrait */
        /* HasExportSettingsTrait */
    }
}