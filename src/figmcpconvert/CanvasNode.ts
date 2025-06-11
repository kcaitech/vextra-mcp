/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { Page } from "@kcdesign/data";
import { CanvasNode } from "./copy";
import { convertIsLayerTrait } from "./IsLayerTrait";
import { convertChildren } from "./SubChildren";
import { convertRGBA } from "./HasGeometryTrait";
import { Color } from "@kcdesign/data";
import { convertPrototypeDevice } from "./PrototypeDevice";

export function convertCanvasNode(page: Page): CanvasNode {
    return  {
        ...convertIsLayerTrait(page),
        type: 'CANVAS',
        children: convertChildren(page.childs),
        backgroundColor: convertRGBA(page.backgroundColor ?? Color.DefaultColor),
        prototypeStartNodeID: null,
        flowStartingPoints: [],
        prototypeDevice: convertPrototypeDevice()
    }
}