/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { Artboard, ScrollDirection, StackMode, StackWrap } from "@kcdesign/data";
import { HasFramePropertiesTrait } from "./copy"

function convertOverflowDirection(shape: Artboard): 'HORIZONTAL_SCROLLING' | 'VERTICAL_SCROLLING' | 'HORIZONTAL_AND_VERTICAL_SCROLLING' | 'NONE' {
    if (shape.scrollDirection === ScrollDirection.HORIZONTAL) return 'HORIZONTAL_SCROLLING';
    else if (shape.scrollDirection === ScrollDirection.VERTICAL) return 'VERTICAL_SCROLLING';
    else if (shape.scrollDirection === ScrollDirection.BOTH) return 'HORIZONTAL_AND_VERTICAL_SCROLLING';
    else return 'NONE';
}

function convertLayoutMode(shape: Artboard): 'NONE' | 'HORIZONTAL' | 'VERTICAL' {
    if (!shape.autoLayout) return 'NONE';
    else return shape.autoLayout.stackMode === StackMode.Horizontal ? 'HORIZONTAL' : 'VERTICAL';
}

function convertLayoutWrap(shape: Artboard): 'NO_WRAP' | 'WRAP' | undefined {
    if (!shape.autoLayout) return undefined;
    return shape.autoLayout.stackWrap === StackWrap.NoWrap ? 'NO_WRAP' : 'WRAP';
}

export function convertHasFramePropertiesTrait(shape: Artboard): HasFramePropertiesTrait {
    return {
        clipsContent: !shape.frameMaskDisabled,
        overflowDirection: convertOverflowDirection(shape),
        layoutMode: convertLayoutMode(shape),
        /* primaryAxisSizingMode */
        /* counterAxisSizingMode */
        /* primaryAxisAlignItems */
        /* counterAxisAlignItems */
        paddingLeft: shape.autoLayout?.stackHorizontalPadding,
        paddingRight: shape.autoLayout?.stackPaddingRight,
        paddingTop: shape.autoLayout?.stackVerticalPadding,
        paddingBottom: shape.autoLayout?.stackPaddingBottom,
        itemSpacing: shape.autoLayout?.stackSpacing,
        itemReverseZIndex: shape.autoLayout?.stackReverseZIndex,
        strokesIncludedInLayout: shape.autoLayout?.bordersTakeSpace,
        layoutWrap: convertLayoutWrap(shape),
        /* counterAxisSpacing */
        counterAxisAlignContent: 'AUTO'
    }
}