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
import { IsLayerTrait } from "./copy";

function scrollBehaviorToString(scrollBehavior?: classes.ScrollBehavior) {
    switch (scrollBehavior) {
        case classes.ScrollBehavior.SCROLLS:
            return "SCROLLS"
        case classes.ScrollBehavior.FIXEDWHENCHILDOFSCROLLINGFRAME:
            return "FIXED"
        case classes.ScrollBehavior.STICKYSCROLLS:
            return "STICKY_SCROLLS"
        default:
            return "SCROLLS"
    }
}

export function convertIsLayerTrait(shape: classes.Shape): IsLayerTrait {
    return {
        id: shape.id,
        name: shape.name,
        type: shape.type,
        visible: shape.isVisible,
        locked: shape.isLocked,
        scrollBehavior: scrollBehaviorToString(shape.scrollBehavior),
        rotation: 0,
        // isFixed: shape.isFixedToViewport,
        // componentPropertyReferences: undefined,
        // pluginData: undefined,
        // sharedPluginData: undefined,
        // boundVariables: undefined,
        // explicitVariableModes: undefined
    }
}
