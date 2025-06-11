/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import {
    Border,
    Color,
    CornerType,
    Fill,
    FillType,
    Gradient,
    GradientType,
    ImageScaleMode,
    MarkerType,
    Shape
} from "@kcdesign/data";
import {
    BasePaint,
    GradientPaint,
    ImageFilters,
    ImagePaint,
    MinimalFillsTrait,
    MinimalStrokesTrait,
    Paint,
    RGBA,
    SolidPaint,
    Transform,
    Vector
} from "./copy";
import { DataTransformHelper } from "./transform";

function convertBasePaint(fill: Fill): BasePaint {
    return { visible: fill.isEnabled, opacity: 1, blendMode: 'NORMAL' };
}

function convertSolidPaint(fill: Fill): SolidPaint {
    return {
        type: 'SOLID',
        color: convertRGBA(fill.color),
        ...convertBasePaint(fill)
    }
}

function convertGradientType(gradient: Gradient) {
    if (gradient.gradientType === GradientType.Angular) {
        return 'GRADIENT_ANGULAR';
    } else if (gradient.gradientType === GradientType.Radial) {
        return 'GRADIENT_RADIAL';
    } else {
        return 'GRADIENT_LINEAR';
    }
}

function convertGradientHandlePositions(gradient: Gradient): Vector[] {
    /* 缺少第三个点 */
    return [{ x: gradient.from.x, y: gradient.from.y }, { x: gradient.to.x, y: gradient.to.y }];
}

function covertColorStop(gradient: Gradient) {
    return gradient.stops.map(i => ({
        position: i.position,
        color: convertRGBA(i.color)
    }))
}

function convertGradientPaint(fill: Fill): GradientPaint {
    return {
        type: convertGradientType(fill.gradient!),
        gradientHandlePositions: convertGradientHandlePositions(fill.gradient!),
        gradientStops: covertColorStop(fill.gradient!),
        ...convertBasePaint(fill)
    }
}

function convertScaleMode(fill: Fill) {
    if (fill.imageScaleMode === ImageScaleMode.Fit) {
        return 'FIT';
    } else if (fill.imageScaleMode === ImageScaleMode.Fill) {
        return 'FILL';
    } else if (fill.imageScaleMode === ImageScaleMode.Tile) {
        return 'TILE';
    } else {
        return 'STRETCH';
    }
}

function convertImageFilters(fill: Fill): ImageFilters {
    return {
        exposure: fill.paintFilter?.exposure,
        contrast: fill.paintFilter?.contrast,
        saturation: fill.paintFilter?.saturation,
        temperature: fill.paintFilter?.temperature,
        tint: fill.paintFilter?.tint,
        shadows: fill.paintFilter?.shadow
    }
}

function convertImagePaint(fill: Fill): ImagePaint {
    const imageTransform: Transform | undefined = fill.transform ? DataTransformHelper.transform(fill.transform!) : undefined;
    return {
        type: 'IMAGE',
        scaleMode: convertScaleMode(fill),
        imageRef: fill.imageRef!,
        imageTransform,
        scalingFactor: fill.scale,
        filters: convertImageFilters(fill),
        rotation: fill.rotation,
        ...convertBasePaint(fill)
    }
}

function convertPaints(fills: Fill[]): Paint[] {
    return fills.map(i => {
        if (i.fillType === FillType.Pattern) return convertImagePaint(i);
        else if (i.fillType === FillType.Gradient) return convertGradientPaint(i);
        else return convertSolidPaint(i)
    })
}

function convertMinimalFillsTrait(shape: Shape): MinimalFillsTrait {
    return {
        fills: convertPaints(shape.style.fills),
    }
}

function convertStrokeAlign(border: Border): 'INSIDE' | 'OUTSIDE' | 'CENTER' {
    if (border.position === "center") return 'CENTER';
    else if (border.position === "outer") return 'OUTSIDE';
    else return 'INSIDE';
}

function convertStrokeJoin(border: Border): 'MITER' | 'BEVEL' | 'ROUND' {
    if (border.cornerType === CornerType.Bevel) return 'BEVEL';
    else if (border.cornerType === CornerType.Round) return 'ROUND';
    else return 'MITER';
}

function convertMinimalStrokesTrait(shape: Shape): MinimalStrokesTrait {
    const border = shape.style.borders;
    return {
        strokes: convertPaints(border.strokePaints),
        strokeWeight: border.sideSetting.thicknessTop,
        strokeAlign: convertStrokeAlign(border),
        strokeJoin: convertStrokeJoin(border),
        strokeDashes: [border.borderStyle.length, border.borderStyle.gap]
    }
}

function convertStrokeCap(mark?: MarkerType):'ROUND' | 'LINE_ARROW' | 'CIRCLE_FILLED' | 'NONE' {
    if (mark === MarkerType.Round) return 'ROUND';
    else if (mark === MarkerType.OpenArrow) return 'LINE_ARROW';
    else if (mark === MarkerType.FilledCircle) return 'CIRCLE_FILLED';
    else return 'NONE'
}

export function convertRGBA(color: { red: number, green: number, blue: number, alpha: number }): RGBA {
    return { r: color.red, g: color.green, b: color.blue, a: color.alpha };
}

export function convertHasGeometryTrait(shape: Shape) {
    return {
        ...convertMinimalFillsTrait(shape),
        ...convertMinimalStrokesTrait(shape),
        strokeCap: convertStrokeCap(shape.style.endMarkerType)
    }
}