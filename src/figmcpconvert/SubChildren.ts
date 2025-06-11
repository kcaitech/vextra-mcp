/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { GroupShape, ShapeType } from "@kcdesign/data";
import { SubcanvasNode } from "./copy";
import { convertBooleanOperationNode } from "./BooleanOperationNode";
import { Shape, Artboard, BoolShape, SymbolRefShape, SymbolShape, TextShape } from "@kcdesign/data";
import { convertGroupNode } from "./GroupNode";
import { convertLineNode } from "./LineNode";
import { convertInstanceNode } from "./InstanceNode";
import { convertFrameNode } from "./FrameNode";
import { convertComponentNode } from "./ComponentNode";
import { convertComponentSetNode } from "./ComponentSetNode";
import { convertVectorNode } from "./VectorNode";
import { convertRegularPolygonNode } from "./RegularPolygonNode";
import { convertStarNode } from "./StarNode";
import { convertEllipseNode } from "./EllipseNode";
import { convertRectangleNode } from "./RectangleNode";
import { convertTextNode } from "./TextNode";
import { convertSliceNode } from "./SliceNode";

type GroupShape_childs = GroupShape['childs'];
export function convertChildren(children: GroupShape_childs): SubcanvasNode[] {
    const childs: SubcanvasNode[] = [];
    for (const child of children) {
        const shape = child as Shape;
        if (child.type === ShapeType.BoolShape) {
            childs.push(convertBooleanOperationNode(shape as unknown as BoolShape));
        } else if (child.type === ShapeType.Group) {
            childs.push(convertGroupNode(shape as unknown as Artboard))
        } else if (child.type === ShapeType.Line) {
            childs.push(convertLineNode(shape));
        } else if (child.type === ShapeType.SymbolRef) {
            childs.push(convertInstanceNode(shape as unknown as SymbolRefShape));
        } else if (child.type === ShapeType.Artboard) {
            childs.push(convertFrameNode(shape as unknown as Artboard));
        } else if (child.type === ShapeType.Symbol) {
            childs.push(convertComponentNode(shape as unknown as SymbolShape));
        } else if (child.type === ShapeType.SymbolUnion) {
            childs.push(convertComponentSetNode(shape as unknown as SymbolShape));
        } else if (child.type === ShapeType.Path) {
            childs.push(convertVectorNode(shape));
        } else if (child.type === ShapeType.Polygon) {
            childs.push(convertRegularPolygonNode(shape));
        } else if (child.type === ShapeType.Star) {
            childs.push(convertStarNode(shape));
        } else if (child.type === ShapeType.Oval) {
            childs.push(convertEllipseNode(shape));
        } else if (child.type === ShapeType.Rectangle) {
            childs.push(convertRectangleNode(shape));
        } else if (child.type === ShapeType.Text) {
            childs.push(convertTextNode(shape as unknown as TextShape));
        } else if (child.type === ShapeType.Cutout) {
            childs.push(convertSliceNode(shape));
        } else if (child.type === ShapeType.Triangle) {
            childs.push(convertRegularPolygonNode(shape));
        }
    }
    return childs;
}
