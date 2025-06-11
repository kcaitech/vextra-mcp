/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { convertRGBA } from "./HasGeometryTrait";
import { BlurType, Shadow, ShadowPosition } from "@kcdesign/data";
import { Blur, Shape } from "@kcdesign/data";
import {
    BaseShadowEffect,
    BlurEffect,
    DropShadowEffect,
    Effect,
    InnerShadowEffect,
    HasEffectsTrait
} from "./copy";

function convertBaseShadowEffect(shadow: Shadow): BaseShadowEffect {
    return {
        color: convertRGBA(shadow.color),
        blendMode: 'NORMAL',
        offset: { x: shadow.offsetX, y: shadow.offsetY },
        radius: shadow.blurRadius,
        spread: shadow.spread,
        visible: shadow.isEnabled
    }
}

function convertShadowEffect(shadow: Shadow): DropShadowEffect | InnerShadowEffect {
    return (shadow.position === ShadowPosition.Inner) ? {
        type: 'INNER_SHADOW',
        ...convertBaseShadowEffect(shadow)
    } : {
        type: 'DROP_SHADOW',
        showShadowBehindNode: true,
        ...convertBaseShadowEffect(shadow),
    }
}

function convertBlurType(type: BlurType): 'LAYER_BLUR' | 'BACKGROUND_BLUR' {
    if (type === BlurType.Background) return 'BACKGROUND_BLUR';
    else return 'LAYER_BLUR';
}

function convertBlurEffect(blur: Blur): BlurEffect {
    return {
        type: convertBlurType(blur.type),
        visible: blur.isEnabled,
        radius: blur.saturation,
    }
}

export function convertHasEffectsTrait(shape: Shape): HasEffectsTrait {
    const effects: Effect[] = [...shape.style.shadows.map(convertShadowEffect)];
    if (shape.style.blur) effects.push(convertBlurEffect(shape.style.blur));
    return {
        effects
    };
}