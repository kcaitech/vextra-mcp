/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { HasLayoutTrait, LayoutConstraint, Vector } from "./copy";
import * as t from "@kcdesign/data"
import { ResizingConstraints2 } from "@kcdesign/data";
import { DataTransformHelper } from "./transform";

function convertConstraint(constraint?: number): LayoutConstraint {
    let vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
    let horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
    if (constraint === undefined) {
        vertical = 'TOP';
        horizontal = 'LEFT';
    } else {
        if (ResizingConstraints2.isFixedToTop(constraint)) {
            vertical = 'TOP';
        } else if (ResizingConstraints2.isFixedToBottom(constraint)) {
            vertical = 'BOTTOM';
        } else if (ResizingConstraints2.isFixedTopAndBottom(constraint)) {
            vertical = 'TOP_BOTTOM';
        } else if (ResizingConstraints2.isVerticalJustifyCenter(constraint)) {
            vertical = 'CENTER';
        } else {
            vertical = 'SCALE';
        }
        if (ResizingConstraints2.isFixedToLeft(constraint)) {
            horizontal = 'LEFT';
        } else if (ResizingConstraints2.isFixedToRight(constraint)) {
            horizontal = 'RIGHT';
        } else if (ResizingConstraints2.isFixedLeftAndRight(constraint)) {
            horizontal = 'LEFT_RIGHT';
        } else if (ResizingConstraints2.isHorizontalJustifyCenter(constraint)) {
            horizontal = 'CENTER';
        } else {
            horizontal = 'SCALE';
        }
    }
    return { vertical, horizontal };
}

export function convertHasLayoutTrait(shape: t.Shape): HasLayoutTrait {
    let size: Vector | undefined = { x: 0, y: 0 };
    const s = (shape as any).size
    if (s) {
        size.x = s.width;
        size.y = s.height;
    }
    return {
        absoluteRenderBounds: null,
        absoluteBoundingBox: null,
        preserveRatio: shape.constrainerProportions,
        constraints: convertConstraint(shape.resizingConstraint),
        relativeTransform: DataTransformHelper.transform(shape.transform),
        size,
        layoutPositioning: ((shape as any).__parent as t.Artboard).autoLayout ? 'AUTO' : 'ABSOLUTE',
        /* minWidth: 0, */
        /* maxWidth: 0, */
        /* minHeight: 0 */
        /* maxHeight: 0 */
        /* layoutSizingHorizontal: 'FIXED' */
        /* layoutSizingVertical: 'FIXED' */
        /* layoutGrow: 0 */
        /* layoutAlign: 'INHERIT' */
    }
}