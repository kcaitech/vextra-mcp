/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { HasBlendModeAndOpacityTrait } from "./copy";
import { BlendMode, Shape } from "@kcdesign/data";

function BlendModeAnd(type?: BlendMode) {
    switch (type) {
        case BlendMode.Normal:
            return "NORMAL"
        case BlendMode.Darken:
            return "DARKEN"
        case BlendMode.Multiply:
            return "MULTIPLY"
        case BlendMode.ColorBurn:
            return "COLOR_BURN"
        case BlendMode.Lighten:
            return "LIGHTEN"
        case BlendMode.Screen:
            return "SCREEN"
        case BlendMode.ColorDodge:
            return "COLOR_DODGE"
        case BlendMode.Overlay:
            return "OVERLAY"
        case BlendMode.SoftLight:
            return "SOFT_LIGHT"
        case BlendMode.HardLight:
            return "HARD_LIGHT"
        case BlendMode.Difference:
            return "DIFFERENCE"
        case BlendMode.Exclusion:
            return "EXCLUSION"
        case BlendMode.Hue:
            return "HUE"
        case BlendMode.Saturation:
            return "SATURATION"
        case BlendMode.Color:
            return "COLOR"
        case BlendMode.Luminosity:
            return "LUMINOSITY"
        default:
            return 'NORMAL'
    }

}

export function convertHasBlendModeAndOpacityTrait(shape: Shape): HasBlendModeAndOpacityTrait {
    return {
        blendMode: BlendModeAnd(shape.style.contextSettings?.blenMode),
        opacity: shape.style.contextSettings?.opacity
    }
}
