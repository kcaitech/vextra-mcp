/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

/* 代码生成，勿手动修改 */
import { types } from "@kcdesign/data"
export interface IExportContext {
}
export function exportArtboard_guides(source: types.Artboard_guides, ctx?: IExportContext): types.Artboard_guides {
    const ret: types.Artboard_guides = []
    source.forEach((source) => {
        ret.push(exportGuide(source, ctx))
    })
    return ret
}
/* blend mode */
export function exportBlendMode(source: types.BlendMode, ctx?: IExportContext): types.BlendMode {
    return source
}
/* blur types */
export function exportBlurType(source: types.BlurType, ctx?: IExportContext): types.BlurType {
    return source
}
/* bool op types */
export function exportBoolOp(source: types.BoolOp, ctx?: IExportContext): types.BoolOp {
    return source
}
/* border position */
export function exportBorderPosition(source: types.BorderPosition, ctx?: IExportContext): types.BorderPosition {
    return source
}
/* border style */
export function exportBorderStyle(source: types.BorderStyle, ctx?: IExportContext): types.BorderStyle {
    const ret: types.BorderStyle = {} as types.BorderStyle
    ret.length = source.length
    ret.gap = source.gap
    return ret
}
export function exportBorder_strokePaints(source: types.Border_strokePaints, ctx?: IExportContext): types.Border_strokePaints {
    const ret: types.Border_strokePaints = []
    source.forEach((source) => {
        ret.push(exportFill(source, ctx))
    })
    return ret
}
/* bullet & item number behavior */
export function exportBulletNumbersBehavior(source: types.BulletNumbersBehavior, ctx?: IExportContext): types.BulletNumbersBehavior {
    return source
}
/* bullet & item number types */
export function exportBulletNumbersType(source: types.BulletNumbersType, ctx?: IExportContext): types.BulletNumbersType {
    return source
}
/* bullet numbers */
export function exportBulletNumbers(source: types.BulletNumbers, ctx?: IExportContext): types.BulletNumbers {
    const ret: types.BulletNumbers = {} as types.BulletNumbers
    ret.type = exportBulletNumbersType(source.type, ctx)
    if (source.behavior !== undefined) ret.behavior = exportBulletNumbersBehavior(source.behavior, ctx)
    if (source.offset !== undefined) ret.offset = source.offset
    return ret
}
/* color controls */
export function exportColorControls(source: types.ColorControls, ctx?: IExportContext): types.ColorControls {
    const ret: types.ColorControls = {} as types.ColorControls
    ret.isEnabled = source.isEnabled
    ret.brightness = source.brightness
    ret.contrast = source.contrast
    ret.hue = source.hue
    ret.saturation = source.saturation
    return ret
}
/* color */
export function exportColor(source: types.Color, ctx?: IExportContext): types.Color {
    const ret: types.Color = {} as types.Color
    ret.alpha = source.alpha
    ret.red = source.red
    ret.green = source.green
    ret.blue = source.blue
    return ret
}
/* contact role type */
export function exportContactRoleType(source: types.ContactRoleType, ctx?: IExportContext): types.ContactRoleType {
    return source
}
/* contactstyle */
export function exportContactRole(source: types.ContactRole, ctx?: IExportContext): types.ContactRole {
    const ret: types.ContactRole = {} as types.ContactRole
    ret.id = source.id
    ret.roleType = exportContactRoleType(source.roleType, ctx)
    ret.shapeId = source.shapeId
    return ret
}
/* contact type */
export function exportContactType(source: types.ContactType, ctx?: IExportContext): types.ContactType {
    return source
}
/* context settings */
export function exportContextSettings(source: types.ContextSettings, ctx?: IExportContext): types.ContextSettings {
    const ret: types.ContextSettings = {} as types.ContextSettings
    ret.blenMode = exportBlendMode(source.blenMode, ctx)
    ret.opacity = source.opacity
    return ret
}
/* couner radius */
export function exportCornerRadius(source: types.CornerRadius, ctx?: IExportContext): types.CornerRadius {
    const ret: types.CornerRadius = {} as types.CornerRadius
    ret.id = source.id
    ret.lt = source.lt
    ret.rt = source.rt
    ret.lb = source.lb
    ret.rb = source.rb
    return ret
}
/* corner type */
export function exportCornerType(source: types.CornerType, ctx?: IExportContext): types.CornerType {
    return source
}
/* crdt number */
export function exportCrdtNumber(source: types.CrdtNumber, ctx?: IExportContext): types.CrdtNumber {
    const ret: types.CrdtNumber = {} as types.CrdtNumber
    ret.id = source.id
    ret.value = source.value
    return ret
}
/* curve mode */
export function exportCurveMode(source: types.CurveMode, ctx?: IExportContext): types.CurveMode {
    return source
}
/* curve point */
export function exportCurvePoint(source: types.CurvePoint, ctx?: IExportContext): types.CurvePoint {
    const ret: types.CurvePoint = {} as types.CurvePoint
    ret.id = source.id
    ret.x = source.x
    ret.y = source.y
    ret.mode = exportCurveMode(source.mode, ctx)
    if (source.radius !== undefined) ret.radius = source.radius
    if (source.fromX !== undefined) ret.fromX = source.fromX
    if (source.fromY !== undefined) ret.fromY = source.fromY
    if (source.toX !== undefined) ret.toX = source.toX
    if (source.toY !== undefined) ret.toY = source.toY
    if (source.hasFrom !== undefined) ret.hasFrom = source.hasFrom
    if (source.hasTo !== undefined) ret.hasTo = source.hasTo
    return ret
}
/* ellipse attributes */
export function exportEllipse(source: types.Ellipse, ctx?: IExportContext): types.Ellipse {
    const ret: types.Ellipse = {} as types.Ellipse
    ret.cx = source.cx
    ret.cy = source.cy
    ret.rx = source.rx
    ret.ry = source.ry
    return ret
}
/* export file format */
export function exportExportFileFormat(source: types.ExportFileFormat, ctx?: IExportContext): types.ExportFileFormat {
    return source
}
/* export format nameing scheme */
export function exportExportFormatNameingScheme(source: types.ExportFormatNameingScheme, ctx?: IExportContext): types.ExportFormatNameingScheme {
    return source
}
export function exportExportOptions_exportFormats(source: types.ExportOptions_exportFormats, ctx?: IExportContext): types.ExportOptions_exportFormats {
    const ret: types.ExportOptions_exportFormats = []
    source.forEach((source) => {
        ret.push(exportExportFormat(source, ctx))
    })
    return ret
}
/* visible scale type */
export function exportExportVisibleScaleType(source: types.ExportVisibleScaleType, ctx?: IExportContext): types.ExportVisibleScaleType {
    return source
}
export function exportFillMask_fills(source: types.FillMask_fills, ctx?: IExportContext): types.FillMask_fills {
    const ret: types.FillMask_fills = []
    source.forEach((source) => {
        ret.push(exportFill(source, ctx))
    })
    return ret
}
/* fill rule */
export function exportFillRule(source: types.FillRule, ctx?: IExportContext): types.FillRule {
    return source
}
/* fill types */
export function exportFillType(source: types.FillType, ctx?: IExportContext): types.FillType {
    return source
}
/* gradient type */
export function exportGradientType(source: types.GradientType, ctx?: IExportContext): types.GradientType {
    return source
}
export function exportGradient_stops(source: types.Gradient_stops, ctx?: IExportContext): types.Gradient_stops {
    const ret: types.Gradient_stops = []
    source.forEach((source) => {
        ret.push(exportStop(source, ctx))
    })
    return ret
}
/* graphics contex settings */
export function exportGraphicsContextSettings(source: types.GraphicsContextSettings, ctx?: IExportContext): types.GraphicsContextSettings {
    const ret: types.GraphicsContextSettings = {} as types.GraphicsContextSettings
    ret.blendMode = exportBlendMode(source.blendMode, ctx)
    ret.opacity = source.opacity
    return ret
}
export function exportGroupShape_childs(source: types.GroupShape_childs, ctx?: IExportContext): types.GroupShape_childs {
    const ret: types.GroupShape_childs = []
    source.forEach((source) => {
        ret.push((() => {
            if (typeof source !== "object") {
                return source
            }
            if (source.typeId === "group-shape") {
                return exportGroupShape(source as types.GroupShape, ctx)
            }
            if (source.typeId === "image-shape") {
                return exportImageShape(source as types.ImageShape, ctx)
            }
            if (source.typeId === "path-shape") {
                return exportPathShape(source as types.PathShape, ctx)
            }
            if (source.typeId === "path-shape2") {
                return exportPathShape2(source as types.PathShape2, ctx)
            }
            if (source.typeId === "rect-shape") {
                return exportRectShape(source as types.RectShape, ctx)
            }
            if (source.typeId === "symbol-ref-shape") {
                return exportSymbolRefShape(source as types.SymbolRefShape, ctx)
            }
            if (source.typeId === "symbol-shape") {
                return exportSymbolShape(source as types.SymbolShape, ctx)
            }
            if (source.typeId === "symbol-union-shape") {
                return exportSymbolUnionShape(source as types.SymbolUnionShape, ctx)
            }
            if (source.typeId === "text-shape") {
                return exportTextShape(source as types.TextShape, ctx)
            }
            if (source.typeId === "artboard") {
                return exportArtboard(source as types.Artboard, ctx)
            }
            if (source.typeId === "line-shape") {
                return exportLineShape(source as types.LineShape, ctx)
            }
            if (source.typeId === "oval-shape") {
                return exportOvalShape(source as types.OvalShape, ctx)
            }
            if (source.typeId === "table-shape") {
                return exportTableShape(source as types.TableShape, ctx)
            }
            if (source.typeId === "contact-shape") {
                return exportContactShape(source as types.ContactShape, ctx)
            }
            if (source.typeId === "shape") {
                return exportShape(source as types.Shape, ctx)
            }
            if (source.typeId === "cutout-shape") {
                return exportCutoutShape(source as types.CutoutShape, ctx)
            }
            if (source.typeId === "bool-shape") {
                return exportBoolShape(source as types.BoolShape, ctx)
            }
            if (source.typeId === "polygon-shape") {
                return exportPolygonShape(source as types.PolygonShape, ctx)
            }
            if (source.typeId === "star-shape") {
                return exportStarShape(source as types.StarShape, ctx)
            }
            throw new Error("unknow typeId: " + source.typeId)
        })())
    })
    return ret
}
/* guide axis */
export function exportGuideAxis(source: types.GuideAxis, ctx?: IExportContext): types.GuideAxis {
    return source
}
/* guide */
export function exportGuide(source: types.Guide, ctx?: IExportContext): types.Guide {
    const ret: types.Guide = {} as types.Guide
    ret.id = source.id
    ret.axis = exportGuideAxis(source.axis, ctx)
    ret.offset = source.offset
    return ret
}
/* image scale mode */
export function exportImageScaleMode(source: types.ImageScaleMode, ctx?: IExportContext): types.ImageScaleMode {
    return source
}
/* line cap style */
export function exportLineCapStyle(source: types.LineCapStyle, ctx?: IExportContext): types.LineCapStyle {
    return source
}
/* line join style */
export function exportLineJoinStyle(source: types.LineJoinStyle, ctx?: IExportContext): types.LineJoinStyle {
    return source
}
/* marker type */
export function exportMarkerType(source: types.MarkerType, ctx?: IExportContext): types.MarkerType {
    return source
}
/* overlayBackgroundInteraction */
export function exportOverlayBackgroundInteraction(source: types.OverlayBackgroundInteraction, ctx?: IExportContext): types.OverlayBackgroundInteraction {
    return source
}
/* interactionType */
export function exportOverlayBackgroundType(source: types.OverlayBackgroundType, ctx?: IExportContext): types.OverlayBackgroundType {
    return source
}
/* overlay margin */
export function exportOverlayMargin(source: types.OverlayMargin, ctx?: IExportContext): types.OverlayMargin {
    const ret: types.OverlayMargin = {} as types.OverlayMargin
    ret.top = source.top
    ret.bottom = source.bottom
    ret.left = source.left
    ret.right = source.right
    return ret
}
/* overlayPositionType */
export function exportOverlayPositionType(source: types.OverlayPositionType, ctx?: IExportContext): types.OverlayPositionType {
    return source
}
/* overlay position */
export function exportOverlayPosition(source: types.OverlayPosition, ctx?: IExportContext): types.OverlayPosition {
    const ret: types.OverlayPosition = {} as types.OverlayPosition
    ret.position = exportOverlayPositionType(source.position, ctx)
    ret.margin = exportOverlayMargin(source.margin, ctx)
    return ret
}
/* override types */
export function exportOverrideType(source: types.OverrideType, ctx?: IExportContext): types.OverrideType {
    return source
}
/* padding */
export function exportPadding(source: types.Padding, ctx?: IExportContext): types.Padding {
    const ret: types.Padding = {} as types.Padding
    if (source.left !== undefined) ret.left = source.left
    if (source.top !== undefined) ret.top = source.top
    if (source.right !== undefined) ret.right = source.right
    if (source.bottom !== undefined) ret.bottom = source.bottom
    return ret
}
/* page list item */
export function exportPageListItem(source: types.PageListItem, ctx?: IExportContext): types.PageListItem {
    const ret: types.PageListItem = {} as types.PageListItem
    ret.id = source.id
    ret.name = source.name
    if (source.versionId !== undefined) ret.versionId = source.versionId
    return ret
}
export function exportPage_guides(source: types.Page_guides, ctx?: IExportContext): types.Page_guides {
    const ret: types.Page_guides = []
    source.forEach((source) => {
        ret.push(exportGuide(source, ctx))
    })
    return ret
}
export function exportPage_connections(source: types.Page_connections, ctx?: IExportContext): types.Page_connections {
    const ret: types.Page_connections = []
    source.forEach((source) => {
        ret.push(exportConnection(source, ctx))
    })
    return ret
}
/* paint filter */
export function exportPaintFilter(source: types.PaintFilter, ctx?: IExportContext): types.PaintFilter {
    const ret: types.PaintFilter = {} as types.PaintFilter
    ret.exposure = source.exposure
    ret.contrast = source.contrast
    ret.saturation = source.saturation
    ret.temperature = source.temperature
    ret.tint = source.tint
    ret.shadow = source.shadow
    ret.hue = source.hue
    return ret
}
/* paint filter type */
export function exportPaintFilterType(source: types.PaintFilterType, ctx?: IExportContext): types.PaintFilterType {
    return source
}
export function exportPara_spans(source: types.Para_spans, ctx?: IExportContext): types.Para_spans {
    const ret: types.Para_spans = []
    source.forEach((source) => {
        ret.push(exportSpan(source, ctx))
    })
    return ret
}
export function exportPathSegment_points(source: types.PathSegment_points, ctx?: IExportContext): types.PathSegment_points {
    const ret: types.PathSegment_points = []
    source.forEach((source) => {
        ret.push(exportCurvePoint(source, ctx))
    })
    return ret
}
/* path segment */
export function exportPathSegment(source: types.PathSegment, ctx?: IExportContext): types.PathSegment {
    const ret: types.PathSegment = {} as types.PathSegment
    ret.id = source.id
    ret.points = exportPathSegment_points(source.points, ctx)
    ret.isClosed = source.isClosed
    return ret
}
export function exportPathShape_pathsegs(source: types.PathShape_pathsegs, ctx?: IExportContext): types.PathShape_pathsegs {
    const ret: types.PathShape_pathsegs = []
    source.forEach((source) => {
        ret.push(exportPathSegment(source, ctx))
    })
    return ret
}
export function exportPathShape2_pathsegs(source: types.PathShape2_pathsegs, ctx?: IExportContext): types.PathShape2_pathsegs {
    const ret: types.PathShape2_pathsegs = []
    source.forEach((source) => {
        ret.push(exportPathSegment(source, ctx))
    })
    return ret
}
/* pattern transform */
export function exportPatternTransform(source: types.PatternTransform, ctx?: IExportContext): types.PatternTransform {
    const ret: types.PatternTransform = {} as types.PatternTransform
    ret.m00 = source.m00
    ret.m01 = source.m01
    ret.m02 = source.m02
    ret.m10 = source.m10
    ret.m11 = source.m11
    ret.m12 = source.m12
    return ret
}
/* point 2d */
export function exportPoint2D(source: types.Point2D, ctx?: IExportContext): types.Point2D {
    const ret: types.Point2D = {} as types.Point2D
    ret.x = source.x
    ret.y = source.y
    return ret
}
/* connectionType */
export function exportPrototypeConnectionType(source: types.PrototypeConnectionType, ctx?: IExportContext): types.PrototypeConnectionType {
    return source
}
/* prototypeEasingBezier */
export function exportPrototypeEasingBezier(source: types.PrototypeEasingBezier, ctx?: IExportContext): types.PrototypeEasingBezier {
    const ret: types.PrototypeEasingBezier = {} as types.PrototypeEasingBezier
    ret.x1 = source.x1
    ret.y1 = source.y1
    ret.x2 = source.x2
    ret.y2 = source.y2
    return ret
}
/* easingType */
export function exportPrototypeEasingType(source: types.PrototypeEasingType, ctx?: IExportContext): types.PrototypeEasingType {
    return source
}
/* interactionType */
export function exportPrototypeEvents(source: types.PrototypeEvents, ctx?: IExportContext): types.PrototypeEvents {
    return source
}
/* navigationType */
export function exportPrototypeNavigationType(source: types.PrototypeNavigationType, ctx?: IExportContext): types.PrototypeNavigationType {
    return source
}
/* prototypeStartingPoint */
export function exportPrototypeStartingPoint(source: types.PrototypeStartingPoint, ctx?: IExportContext): types.PrototypeStartingPoint {
    const ret: types.PrototypeStartingPoint = {} as types.PrototypeStartingPoint
    ret.name = source.name
    ret.desc = source.desc
    return ret
}
/* transitionType */
export function exportPrototypeTransitionType(source: types.PrototypeTransitionType, ctx?: IExportContext): types.PrototypeTransitionType {
    return source
}
/* crdtidx */
export function exportRadius(source: types.Radius, ctx?: IExportContext): types.Radius {
    const ret: types.Radius = []
    source.forEach((source) => {
        ret.push(source)
    })
    return ret
}
/* resize type */
export function exportResizeType(source: types.ResizeType, ctx?: IExportContext): types.ResizeType {
    return source
}
/* scrollBehavior */
export function exportScrollBehavior(source: types.ScrollBehavior, ctx?: IExportContext): types.ScrollBehavior {
    return source
}
/* scrollDirection */
export function exportScrollDirection(source: types.ScrollDirection, ctx?: IExportContext): types.ScrollDirection {
    return source
}
export function exportShadowMask_shadows(source: types.ShadowMask_shadows, ctx?: IExportContext): types.ShadowMask_shadows {
    const ret: types.ShadowMask_shadows = []
    source.forEach((source) => {
        ret.push(exportShadow(source, ctx))
    })
    return ret
}
/* shadow position */
export function exportShadowPosition(source: types.ShadowPosition, ctx?: IExportContext): types.ShadowPosition {
    return source
}
/* shadow */
export function exportShadow(source: types.Shadow, ctx?: IExportContext): types.Shadow {
    const ret: types.Shadow = {} as types.Shadow
    ret.id = source.id
    ret.isEnabled = source.isEnabled
    ret.blurRadius = source.blurRadius
    ret.color = exportColor(source.color, ctx)
    ret.offsetX = source.offsetX
    ret.offsetY = source.offsetY
    ret.spread = source.spread
    ret.position = exportShadowPosition(source.position, ctx)
    if (source.contextSettings !== undefined) ret.contextSettings = exportGraphicsContextSettings(source.contextSettings, ctx)
    if (source.mask !== undefined) ret.mask = source.mask
    return ret
}
/* shape frame
 * x,y为parent坐标系里的点
 * width,height为当前shape的坐标空间大小 */
export function exportShapeFrame(source: types.ShapeFrame, ctx?: IExportContext): types.ShapeFrame {
    const ret: types.ShapeFrame = {} as types.ShapeFrame
    ret.x = source.x
    ret.y = source.y
    ret.width = source.width
    ret.height = source.height
    return ret
}
/* shape size */
export function exportShapeSize(source: types.ShapeSize, ctx?: IExportContext): types.ShapeSize {
    const ret: types.ShapeSize = {} as types.ShapeSize
    ret.width = source.width
    ret.height = source.height
    return ret
}
/* shape types */
export function exportShapeType(source: types.ShapeType, ctx?: IExportContext): types.ShapeType {
    return source
}
export function exportShape_prototypeInteractions(source: types.Shape_prototypeInteractions, ctx?: IExportContext): types.Shape_prototypeInteractions {
    const ret: types.Shape_prototypeInteractions = []
    source.forEach((source) => {
        ret.push(exportPrototypeInteraction(source, ctx))
    })
    return ret
}
/* side type */
export function exportSideType(source: types.SideType, ctx?: IExportContext): types.SideType {
    return source
}
/* stack align */
export function exportStackAlign(source: types.StackAlign, ctx?: IExportContext): types.StackAlign {
    return source
}
/* stack mode */
export function exportStackMode(source: types.StackMode, ctx?: IExportContext): types.StackMode {
    return source
}
/* stack positioning */
export function exportStackPositioning(source: types.StackPositioning, ctx?: IExportContext): types.StackPositioning {
    return source
}
/* stack size */
export function exportStackSize(source: types.StackSize, ctx?: IExportContext): types.StackSize {
    const ret: types.StackSize = {} as types.StackSize
    ret.x = source.x
    ret.y = source.y
    return ret
}
/* stack sizing */
export function exportStackSizing(source: types.StackSizing, ctx?: IExportContext): types.StackSizing {
    return source
}
/* stack wrap */
export function exportStackWrap(source: types.StackWrap, ctx?: IExportContext): types.StackWrap {
    return source
}
/* stop */
export function exportStop(source: types.Stop, ctx?: IExportContext): types.Stop {
    const ret: types.Stop = {} as types.Stop
    ret.id = source.id
    ret.position = source.position
    ret.color = exportColor(source.color, ctx)
    return ret
}
/* strikethrough types */
export function exportStrikethroughType(source: types.StrikethroughType, ctx?: IExportContext): types.StrikethroughType {
    return source
}
/* style library type */
export function exportStyleLibType(source: types.StyleLibType, ctx?: IExportContext): types.StyleLibType {
    return source
}
export function exportStyleSheet_variables(source: types.StyleSheet_variables, ctx?: IExportContext): types.StyleSheet_variables {
    const ret: types.StyleSheet_variables = []
    source.forEach((source) => {
        ret.push((() => {
            if (typeof source !== "object") {
                return source
            }
            if (source.typeId === "fill-mask") {
                return exportFillMask(source as types.FillMask, ctx)
            }
            if (source.typeId === "shadow-mask") {
                return exportShadowMask(source as types.ShadowMask, ctx)
            }
            if (source.typeId === "blur-mask") {
                return exportBlurMask(source as types.BlurMask, ctx)
            }
            if (source.typeId === "border-mask") {
                return exportBorderMask(source as types.BorderMask, ctx)
            }
            if (source.typeId === "radius-mask") {
                return exportRadiusMask(source as types.RadiusMask, ctx)
            }
            if (source.typeId === "text-mask") {
                return exportTextMask(source as types.TextMask, ctx)
            }
            throw new Error("unknow typeId: " + source.typeId)
        })())
    })
    return ret
}
/* shape types */
export function exportStyleVarType(source: types.StyleVarType, ctx?: IExportContext): types.StyleVarType {
    return source
}
export function exportStyle_fills(source: types.Style_fills, ctx?: IExportContext): types.Style_fills {
    const ret: types.Style_fills = []
    source.forEach((source) => {
        ret.push(exportFill(source, ctx))
    })
    return ret
}
export function exportStyle_shadows(source: types.Style_shadows, ctx?: IExportContext): types.Style_shadows {
    const ret: types.Style_shadows = []
    source.forEach((source) => {
        ret.push(exportShadow(source, ctx))
    })
    return ret
}
export function exportStyle_innerShadows(source: types.Style_innerShadows, ctx?: IExportContext): types.Style_innerShadows {
    const ret: types.Style_innerShadows = []
    source.forEach((source) => {
        ret.push(exportShadow(source, ctx))
    })
    return ret
}
export function exportStyle_contacts(source: types.Style_contacts, ctx?: IExportContext): types.Style_contacts {
    const ret: types.Style_contacts = []
    source.forEach((source) => {
        ret.push(exportContactRole(source, ctx))
    })
    return ret
}
export function exportSymbolShape_guides(source: types.SymbolShape_guides, ctx?: IExportContext): types.SymbolShape_guides {
    const ret: types.SymbolShape_guides = []
    source.forEach((source) => {
        ret.push(exportGuide(source, ctx))
    })
    return ret
}
/* table cell info */
export function exportTableCellAttr(source: types.TableCellAttr, ctx?: IExportContext): types.TableCellAttr {
    const ret: types.TableCellAttr = {} as types.TableCellAttr
    if (source.rowSpan !== undefined) ret.rowSpan = source.rowSpan
    if (source.colSpan !== undefined) ret.colSpan = source.colSpan
    return ret
}
/* table cell types */
export function exportTableCellType(source: types.TableCellType, ctx?: IExportContext): types.TableCellType {
    return source
}
export function exportTableShape_rowHeights(source: types.TableShape_rowHeights, ctx?: IExportContext): types.TableShape_rowHeights {
    const ret: types.TableShape_rowHeights = []
    source.forEach((source) => {
        ret.push(exportCrdtNumber(source, ctx))
    })
    return ret
}
export function exportTableShape_colWidths(source: types.TableShape_colWidths, ctx?: IExportContext): types.TableShape_colWidths {
    const ret: types.TableShape_colWidths = []
    source.forEach((source) => {
        ret.push(exportCrdtNumber(source, ctx))
    })
    return ret
}
export function exportTableShape2_rowHeights(source: types.TableShape2_rowHeights, ctx?: IExportContext): types.TableShape2_rowHeights {
    const ret: types.TableShape2_rowHeights = []
    source.forEach((source) => {
        ret.push(exportCrdtNumber(source, ctx))
    })
    return ret
}
export function exportTableShape2_colWidths(source: types.TableShape2_colWidths, ctx?: IExportContext): types.TableShape2_colWidths {
    const ret: types.TableShape2_colWidths = []
    source.forEach((source) => {
        ret.push(exportCrdtNumber(source, ctx))
    })
    return ret
}
/* text behaviour */
export function exportTextBehaviour(source: types.TextBehaviour, ctx?: IExportContext): types.TextBehaviour {
    return source
}
/* text horizontal alignment */
export function exportTextHorAlign(source: types.TextHorAlign, ctx?: IExportContext): types.TextHorAlign {
    return source
}
/* text orientation */
export function exportTextOrientation(source: types.TextOrientation, ctx?: IExportContext): types.TextOrientation {
    return source
}
/* text transform types */
export function exportTextTransformType(source: types.TextTransformType, ctx?: IExportContext): types.TextTransformType {
    return source
}
/* text vertical alignment */
export function exportTextVerAlign(source: types.TextVerAlign, ctx?: IExportContext): types.TextVerAlign {
    return source
}
export function exportText_paras(source: types.Text_paras, ctx?: IExportContext): types.Text_paras {
    const ret: types.Text_paras = []
    source.forEach((source) => {
        ret.push(exportPara(source, ctx))
    })
    return ret
}
/* transform */
export function exportTransform(source: types.Transform, ctx?: IExportContext): types.Transform {
    const ret: types.Transform = {} as types.Transform
    ret.m00 = source.m00
    ret.m01 = source.m01
    ret.m02 = source.m02
    ret.m10 = source.m10
    ret.m11 = source.m11
    ret.m12 = source.m12
    return ret
}
/* underline types */
export function exportUnderlineType(source: types.UnderlineType, ctx?: IExportContext): types.UnderlineType {
    return source
}
/* user infomation */
export function exportUserInfo(source: types.UserInfo, ctx?: IExportContext): types.UserInfo {
    const ret: types.UserInfo = {} as types.UserInfo
    ret.userId = source.userId
    ret.userNickname = source.userNickname
    ret.avatar = source.avatar
    return ret
}
/* variable types */
export function exportVariableType(source: types.VariableType, ctx?: IExportContext): types.VariableType {
    return source
}
export function exportVariable_0(source: types.Variable_0, ctx?: IExportContext): types.Variable_0 {
    const ret: types.Variable_0 = []
    source.forEach((source) => {
        ret.push((() => {
            if (typeof source !== "object") {
                return source
            }
            if (source.typeId === "fill") {
                return exportFill(source as types.Fill, ctx)
            }
            if (source.typeId === "shadow") {
                return exportShadow(source as types.Shadow, ctx)
            }
            if (source.typeId === "prototype-interaction") {
                return exportPrototypeInteraction(source as types.PrototypeInteraction, ctx)
            }
            throw new Error("unknow typeId: " + source.typeId)
        })())
    })
    return ret
}
/* winding rule */
export function exportWindingRule(source: types.WindingRule, ctx?: IExportContext): types.WindingRule {
    return source
}
/* auto layout */
export function exportAutoLayout(source: types.AutoLayout, ctx?: IExportContext): types.AutoLayout {
    const ret: types.AutoLayout = {} as types.AutoLayout
    ret.stackSpacing = source.stackSpacing
    ret.stackCounterSpacing = source.stackCounterSpacing
    ret.stackHorizontalPadding = source.stackHorizontalPadding
    ret.stackVerticalPadding = source.stackVerticalPadding
    ret.stackPaddingRight = source.stackPaddingRight
    ret.stackPaddingBottom = source.stackPaddingBottom
    ret.stackPrimarySizing = exportStackSizing(source.stackPrimarySizing, ctx)
    if (source.stackMode !== undefined) ret.stackMode = exportStackMode(source.stackMode, ctx)
    if (source.stackWrap !== undefined) ret.stackWrap = exportStackWrap(source.stackWrap, ctx)
    if (source.stackHorizontalGapSizing !== undefined) ret.stackHorizontalGapSizing = exportStackSizing(source.stackHorizontalGapSizing, ctx)
    if (source.stackVerticalGapSizing !== undefined) ret.stackVerticalGapSizing = exportStackSizing(source.stackVerticalGapSizing, ctx)
    if (source.stackCounterSizing !== undefined) ret.stackCounterSizing = exportStackSizing(source.stackCounterSizing, ctx)
    if (source.stackPrimaryAlignItems !== undefined) ret.stackPrimaryAlignItems = exportStackAlign(source.stackPrimaryAlignItems, ctx)
    if (source.stackCounterAlignItems !== undefined) ret.stackCounterAlignItems = exportStackAlign(source.stackCounterAlignItems, ctx)
    if (source.stackReverseZIndex !== undefined) ret.stackReverseZIndex = source.stackReverseZIndex
    if (source.bordersTakeSpace !== undefined) ret.bordersTakeSpace = source.bordersTakeSpace
    if (source.minSize !== undefined) ret.minSize = exportStackSize(source.minSize, ctx)
    if (source.maxSize !== undefined) ret.maxSize = exportStackSize(source.maxSize, ctx)
    return ret
}
/* blur */
export function exportBlur(source: types.Blur, ctx?: IExportContext): types.Blur {
    const ret: types.Blur = {} as types.Blur
    ret.isEnabled = source.isEnabled
    ret.center = exportPoint2D(source.center, ctx)
    ret.saturation = source.saturation
    ret.type = exportBlurType(source.type, ctx)
    if (source.motionAngle !== undefined) ret.motionAngle = source.motionAngle
    if (source.radius !== undefined) ret.radius = source.radius
    return ret
}
/* border options */
export function exportBorderOptions(source: types.BorderOptions, ctx?: IExportContext): types.BorderOptions {
    const ret: types.BorderOptions = {} as types.BorderOptions
    ret.isEnabled = source.isEnabled
    ret.lineCapStyle = exportLineCapStyle(source.lineCapStyle, ctx)
    ret.lineJoinStyle = exportLineJoinStyle(source.lineJoinStyle, ctx)
    return ret
}
/* border side setting */
export function exportBorderSideSetting(source: types.BorderSideSetting, ctx?: IExportContext): types.BorderSideSetting {
    const ret: types.BorderSideSetting = {} as types.BorderSideSetting
    ret.sideType = exportSideType(source.sideType, ctx)
    ret.thicknessTop = source.thicknessTop
    ret.thicknessLeft = source.thicknessLeft
    ret.thicknessBottom = source.thicknessBottom
    ret.thicknessRight = source.thicknessRight
    return ret
}
/* contact form */
export function exportContactForm(source: types.ContactForm, ctx?: IExportContext): types.ContactForm {
    const ret: types.ContactForm = {} as types.ContactForm
    ret.contactType = exportContactType(source.contactType, ctx)
    ret.shapeId = source.shapeId
    return ret
}
/* export format */
export function exportExportFormat(source: types.ExportFormat, ctx?: IExportContext): types.ExportFormat {
    const ret: types.ExportFormat = {} as types.ExportFormat
    ret.id = source.id
    ret.absoluteSize = source.absoluteSize
    ret.fileFormat = exportExportFileFormat(source.fileFormat, ctx)
    ret.name = source.name
    ret.namingScheme = exportExportFormatNameingScheme(source.namingScheme, ctx)
    ret.scale = source.scale
    ret.visibleScaleType = exportExportVisibleScaleType(source.visibleScaleType, ctx)
    return ret
}
/* export options */
export function exportExportOptions(source: types.ExportOptions, ctx?: IExportContext): types.ExportOptions {
    const ret: types.ExportOptions = {} as types.ExportOptions
    ret.exportFormats = exportExportOptions_exportFormats(source.exportFormats, ctx)
    ret.childOptions = source.childOptions
    ret.shouldTrim = source.shouldTrim
    ret.trimTransparent = source.trimTransparent
    ret.canvasBackground = source.canvasBackground
    ret.unfold = source.unfold
    return ret
}
/* gradient */
export function exportGradient(source: types.Gradient, ctx?: IExportContext): types.Gradient {
    const ret: types.Gradient = {} as types.Gradient
    ret.from = exportPoint2D(source.from, ctx)
    ret.to = exportPoint2D(source.to, ctx)
    ret.gradientType = exportGradientType(source.gradientType, ctx)
    ret.stops = exportGradient_stops(source.stops, ctx)
    if (source.elipseLength !== undefined) ret.elipseLength = source.elipseLength
    if (source.gradientOpacity !== undefined) ret.gradientOpacity = source.gradientOpacity
    return ret
}
/* overlay-background-appearance */
export function exportOverlayBackgroundAppearance(source: types.OverlayBackgroundAppearance, ctx?: IExportContext): types.OverlayBackgroundAppearance {
    const ret: types.OverlayBackgroundAppearance = {} as types.OverlayBackgroundAppearance
    ret.backgroundType = exportOverlayBackgroundType(source.backgroundType, ctx)
    ret.backgroundColor = exportColor(source.backgroundColor, ctx)
    return ret
}
/* actions */
export function exportPrototypeActions(source: types.PrototypeActions, ctx?: IExportContext): types.PrototypeActions {
    const ret: types.PrototypeActions = {} as types.PrototypeActions
    ret.connectionType = exportPrototypeConnectionType(source.connectionType, ctx)
    ret.openUrlInNewTab = source.openUrlInNewTab
    if (source.targetNodeID !== undefined) ret.targetNodeID = source.targetNodeID
    if (source.transitionType !== undefined) ret.transitionType = exportPrototypeTransitionType(source.transitionType, ctx)
    if (source.transitionDuration !== undefined) ret.transitionDuration = source.transitionDuration
    if (source.easingType !== undefined) ret.easingType = exportPrototypeEasingType(source.easingType, ctx)
    if (source.connectionURL !== undefined) ret.connectionURL = source.connectionURL
    if (source.navigationType !== undefined) ret.navigationType = exportPrototypeNavigationType(source.navigationType, ctx)
    if (source.easingFunction !== undefined) ret.easingFunction = exportPrototypeEasingBezier(source.easingFunction, ctx)
    if (source.extraScrollOffset !== undefined) ret.extraScrollOffset = exportPoint2D(source.extraScrollOffset, ctx)
    return ret
}
/* event */
export function exportPrototypeEvent(source: types.PrototypeEvent, ctx?: IExportContext): types.PrototypeEvent {
    const ret: types.PrototypeEvent = {} as types.PrototypeEvent
    ret.interactionType = exportPrototypeEvents(source.interactionType, ctx)
    if (source.transitionTimeout !== undefined) ret.transitionTimeout = source.transitionTimeout
    return ret
}
/* prototypeInteraction */
export function exportPrototypeInteraction(source: types.PrototypeInteraction, ctx?: IExportContext): types.PrototypeInteraction {
    const ret: types.PrototypeInteraction = {} as types.PrototypeInteraction
    ret.event = exportPrototypeEvent(source.event, ctx)
    ret.actions = exportPrototypeActions(source.actions, ctx)
    if (source.id !== undefined) ret.id = source.id
    if (source.isDeleted !== undefined) ret.isDeleted = source.isDeleted
    return ret
}
/* radius mask */
export function exportRadiusMask(source: types.RadiusMask, ctx?: IExportContext): types.RadiusMask {
    const ret: types.RadiusMask = {} as types.RadiusMask
    ret.sheet = source.sheet
    ret.id = source.id
    ret.name = source.name
    ret.description = source.description
    ret.radius = exportRadius(source.radius, ctx)
    if (source.disabled !== undefined) ret.disabled = source.disabled
    return ret
}
/* shadow mask */
export function exportShadowMask(source: types.ShadowMask, ctx?: IExportContext): types.ShadowMask {
    const ret: types.ShadowMask = {} as types.ShadowMask
    ret.sheet = source.sheet
    ret.id = source.id
    ret.name = source.name
    ret.description = source.description
    ret.shadows = exportShadowMask_shadows(source.shadows, ctx)
    if (source.disabled !== undefined) ret.disabled = source.disabled
    return ret
}
/* span attr */
export function exportSpanAttr(source: types.SpanAttr, ctx?: IExportContext): types.SpanAttr {
    const ret: types.SpanAttr = {} as types.SpanAttr
    if (source.fontName !== undefined) ret.fontName = source.fontName
    if (source.fontSize !== undefined) ret.fontSize = source.fontSize
    if (source.color !== undefined) ret.color = exportColor(source.color, ctx)
    if (source.strikethrough !== undefined) ret.strikethrough = exportStrikethroughType(source.strikethrough, ctx)
    if (source.underline !== undefined) ret.underline = exportUnderlineType(source.underline, ctx)
    if (source.weight !== undefined) ret.weight = source.weight
    if (source.italic !== undefined) ret.italic = source.italic
    if (source.bulletNumbers !== undefined) ret.bulletNumbers = exportBulletNumbers(source.bulletNumbers, ctx)
    if (source.highlight !== undefined) ret.highlight = exportColor(source.highlight, ctx)
    if (source.kerning !== undefined) ret.kerning = source.kerning
    if (source.transform !== undefined) ret.transform = exportTextTransformType(source.transform, ctx)
    if (source.placeholder !== undefined) ret.placeholder = source.placeholder
    if (source.fillType !== undefined) ret.fillType = exportFillType(source.fillType, ctx)
    if (source.gradient !== undefined) ret.gradient = exportGradient(source.gradient, ctx)
    if (source.textMask !== undefined) ret.textMask = source.textMask
    return ret
}
/* span attr */
export function exportSpan(source: types.Span, ctx?: IExportContext): types.Span {
    const ret: types.Span = exportSpanAttr(source, ctx) as types.Span
    ret.length = source.length
    return ret
}
/* blur mask */
export function exportBlurMask(source: types.BlurMask, ctx?: IExportContext): types.BlurMask {
    const ret: types.BlurMask = {} as types.BlurMask
    ret.sheet = source.sheet
    ret.id = source.id
    ret.name = source.name
    ret.description = source.description
    ret.blur = exportBlur(source.blur, ctx)
    if (source.disabled !== undefined) ret.disabled = source.disabled
    return ret
}
/* border mask type */
export function exportBorderMaskType(source: types.BorderMaskType, ctx?: IExportContext): types.BorderMaskType {
    const ret: types.BorderMaskType = {} as types.BorderMaskType
    ret.typeId = "border-mask-type"
    ret.typeId = source.typeId
    ret.position = exportBorderPosition(source.position, ctx)
    ret.sideSetting = exportBorderSideSetting(source.sideSetting, ctx)
    return ret
}
/* border mask */
export function exportBorderMask(source: types.BorderMask, ctx?: IExportContext): types.BorderMask {
    const ret: types.BorderMask = {} as types.BorderMask
    ret.sheet = source.sheet
    ret.id = source.id
    ret.name = source.name
    ret.description = source.description
    ret.border = exportBorderMaskType(source.border, ctx)
    if (source.disabled !== undefined) ret.disabled = source.disabled
    return ret
}
/* fill */
export function exportFill(source: types.Fill, ctx?: IExportContext): types.Fill {
    const ret: types.Fill = {} as types.Fill
    ret.id = source.id
    ret.isEnabled = source.isEnabled
    ret.fillType = exportFillType(source.fillType, ctx)
    ret.color = exportColor(source.color, ctx)
    if (source.contextSettings !== undefined) ret.contextSettings = exportContextSettings(source.contextSettings, ctx)
    if (source.gradient !== undefined) ret.gradient = exportGradient(source.gradient, ctx)
    if (source.imageRef !== undefined) ret.imageRef = source.imageRef
    if (source.fillRule !== undefined) ret.fillRule = exportFillRule(source.fillRule, ctx)
    if (source.imageScaleMode !== undefined) ret.imageScaleMode = exportImageScaleMode(source.imageScaleMode, ctx)
    if (source.rotation !== undefined) ret.rotation = source.rotation
    if (source.scale !== undefined) ret.scale = source.scale
    if (source.originalImageWidth !== undefined) ret.originalImageWidth = source.originalImageWidth
    if (source.originalImageHeight !== undefined) ret.originalImageHeight = source.originalImageHeight
    if (source.paintFilter !== undefined) ret.paintFilter = exportPaintFilter(source.paintFilter, ctx)
    if (source.transform !== undefined) ret.transform = exportPatternTransform(source.transform, ctx)
    return ret
}
/* span attr */
export function exportParaAttr(source: types.ParaAttr, ctx?: IExportContext): types.ParaAttr {
    const ret: types.ParaAttr = exportSpanAttr(source, ctx) as types.ParaAttr
    if (source.alignment !== undefined) ret.alignment = exportTextHorAlign(source.alignment, ctx)
    if (source.paraSpacing !== undefined) ret.paraSpacing = source.paraSpacing
    if (source.minimumLineHeight !== undefined) ret.minimumLineHeight = source.minimumLineHeight
    if (source.maximumLineHeight !== undefined) ret.maximumLineHeight = source.maximumLineHeight
    if (source.autoLineHeight !== undefined) ret.autoLineHeight = source.autoLineHeight
    if (source.indent !== undefined) ret.indent = source.indent
    return ret
}
/* para */
export function exportPara(source: types.Para, ctx?: IExportContext): types.Para {
    const ret: types.Para = {} as types.Para
    ret.text = source.text
    ret.spans = exportPara_spans(source.spans, ctx)
    if (source.attr !== undefined) ret.attr = exportParaAttr(source.attr, ctx)
    return ret
}
/* text attr */
export function exportTextAttr(source: types.TextAttr, ctx?: IExportContext): types.TextAttr {
    const ret: types.TextAttr = exportParaAttr(source, ctx) as types.TextAttr
    if (source.verAlign !== undefined) ret.verAlign = exportTextVerAlign(source.verAlign, ctx)
    if (source.orientation !== undefined) ret.orientation = exportTextOrientation(source.orientation, ctx)
    if (source.textBehaviour !== undefined) ret.textBehaviour = exportTextBehaviour(source.textBehaviour, ctx)
    if (source.padding !== undefined) ret.padding = exportPadding(source.padding, ctx)
    return ret
}
/* text mask */
export function exportTextMask(source: types.TextMask, ctx?: IExportContext): types.TextMask {
    const ret: types.TextMask = {} as types.TextMask
    ret.sheet = source.sheet
    ret.id = source.id
    ret.name = source.name
    ret.description = source.description
    ret.text = exportTextAttr(source.text, ctx)
    if (source.disabled !== undefined) ret.disabled = source.disabled
    return ret
}
/* text */
export function exportText(source: types.Text, ctx?: IExportContext): types.Text {
    const ret: types.Text = {} as types.Text
    ret.paras = exportText_paras(source.paras, ctx)
    if (source.attr !== undefined) ret.attr = exportTextAttr(source.attr, ctx)
    if (source.fixed !== undefined) ret.fixed = source.fixed
    return ret
}
/* border */
export function exportBorder(source: types.Border, ctx?: IExportContext): types.Border {
    const ret: types.Border = {} as types.Border
    ret.position = exportBorderPosition(source.position, ctx)
    ret.borderStyle = exportBorderStyle(source.borderStyle, ctx)
    ret.cornerType = exportCornerType(source.cornerType, ctx)
    ret.sideSetting = exportBorderSideSetting(source.sideSetting, ctx)
    ret.strokePaints = exportBorder_strokePaints(source.strokePaints, ctx)
    if (source.fillsMask !== undefined) ret.fillsMask = source.fillsMask
    return ret
}
/* fill mask */
export function exportFillMask(source: types.FillMask, ctx?: IExportContext): types.FillMask {
    const ret: types.FillMask = {} as types.FillMask
    ret.sheet = source.sheet
    ret.id = source.id
    ret.name = source.name
    ret.description = source.description
    ret.fills = exportFillMask_fills(source.fills, ctx)
    if (source.disabled !== undefined) ret.disabled = source.disabled
    return ret
}
/* style sheet */
export function exportStyleSheet(source: types.StyleSheet, ctx?: IExportContext): types.StyleSheet {
    const ret: types.StyleSheet = {} as types.StyleSheet
    ret.id = source.id
    ret.name = source.name
    ret.variables = exportStyleSheet_variables(source.variables, ctx)
    return ret
}
/* style */
export function exportStyle(source: types.Style, ctx?: IExportContext): types.Style {
    const ret: types.Style = {} as types.Style
    ret.fills = exportStyle_fills(source.fills, ctx)
    ret.shadows = exportStyle_shadows(source.shadows, ctx)
    ret.borders = exportBorder(source.borders, ctx)
    if (source.miterLimit !== undefined) ret.miterLimit = source.miterLimit
    if (source.windingRule !== undefined) ret.windingRule = exportWindingRule(source.windingRule, ctx)
    if (source.blur !== undefined) ret.blur = exportBlur(source.blur, ctx)
    if (source.borderOptions !== undefined) ret.borderOptions = exportBorderOptions(source.borderOptions, ctx)
    if (source.colorControls !== undefined) ret.colorControls = exportColorControls(source.colorControls, ctx)
    if (source.contextSettings !== undefined) ret.contextSettings = exportContextSettings(source.contextSettings, ctx)
    if (source.innerShadows !== undefined) ret.innerShadows = exportStyle_innerShadows(source.innerShadows, ctx)
    if (source.contacts !== undefined) ret.contacts = exportStyle_contacts(source.contacts, ctx)
    if (source.startMarkerType !== undefined) ret.startMarkerType = exportMarkerType(source.startMarkerType, ctx)
    if (source.endMarkerType !== undefined) ret.endMarkerType = exportMarkerType(source.endMarkerType, ctx)
    if (source.varbinds !== undefined) ret.varbinds = (() => {
        const ret: any = {}
        source.varbinds.forEach((source, k) => {
            ret[k] = source
        })
        return ret
    })()
    if (source.fillsMask !== undefined) ret.fillsMask = source.fillsMask
    if (source.shadowsMask !== undefined) ret.shadowsMask = source.shadowsMask
    if (source.blursMask !== undefined) ret.blursMask = source.blursMask
    if (source.bordersMask !== undefined) ret.bordersMask = source.bordersMask
    return ret
}
/* shape */
export function exportShape(source: types.Shape, ctx?: IExportContext): types.Shape {
    const ret: types.Shape = {} as types.Shape
    ret.id = source.id
    ret.name = source.name
    ret.type = exportShapeType(source.type, ctx)
    ret.transform = exportTransform(source.transform, ctx)
    ret.style = exportStyle(source.style, ctx)
    if (source.boolOp !== undefined) ret.boolOp = exportBoolOp(source.boolOp, ctx)
    if (source.isFixedToViewport !== undefined) ret.isFixedToViewport = source.isFixedToViewport
    if (source.isLocked !== undefined) ret.isLocked = source.isLocked
    if (source.isVisible !== undefined) ret.isVisible = source.isVisible
    if (source.exportOptions !== undefined) ret.exportOptions = exportExportOptions(source.exportOptions, ctx)
    if (source.nameIsFixed !== undefined) ret.nameIsFixed = source.nameIsFixed
    if (source.resizingConstraint !== undefined) ret.resizingConstraint = source.resizingConstraint
    if (source.resizingType !== undefined) ret.resizingType = exportResizeType(source.resizingType, ctx)
    if (source.constrainerProportions !== undefined) ret.constrainerProportions = source.constrainerProportions
    if (source.clippingMaskMode !== undefined) ret.clippingMaskMode = source.clippingMaskMode
    if (source.hasClippingMask !== undefined) ret.hasClippingMask = source.hasClippingMask
    if (source.shouldBreakMaskChain !== undefined) ret.shouldBreakMaskChain = source.shouldBreakMaskChain
    if (source.varbinds !== undefined) ret.varbinds = (() => {
        const ret: any = {}
        source.varbinds.forEach((source, k) => {
            ret[k] = source
        })
        return ret
    })()
    if (source.haveEdit !== undefined) ret.haveEdit = source.haveEdit
    if (source.prototypeStartingPoint !== undefined) ret.prototypeStartingPoint = exportPrototypeStartingPoint(source.prototypeStartingPoint, ctx)
    if (source.prototypeInteractions !== undefined) ret.prototypeInteractions = exportShape_prototypeInteractions(source.prototypeInteractions, ctx)
    if (source.overlayPosition !== undefined) ret.overlayPosition = exportOverlayPosition(source.overlayPosition, ctx)
    if (source.overlayBackgroundInteraction !== undefined) ret.overlayBackgroundInteraction = exportOverlayBackgroundInteraction(source.overlayBackgroundInteraction, ctx)
    if (source.overlayBackgroundAppearance !== undefined) ret.overlayBackgroundAppearance = exportOverlayBackgroundAppearance(source.overlayBackgroundAppearance, ctx)
    if (source.scrollDirection !== undefined) ret.scrollDirection = exportScrollDirection(source.scrollDirection, ctx)
    if (source.scrollBehavior !== undefined) ret.scrollBehavior = exportScrollBehavior(source.scrollBehavior, ctx)
    if (source.mask !== undefined) ret.mask = source.mask
    if (source.stackPositioning !== undefined) ret.stackPositioning = exportStackPositioning(source.stackPositioning, ctx)
    if (source.radiusMask !== undefined) ret.radiusMask = source.radiusMask
    return ret
}
/* table cell */
export function exportTableCell(source: types.TableCell, ctx?: IExportContext): types.TableCell {
    const ret: types.TableCell = exportShape(source, ctx) as types.TableCell
    ret.cellType = exportTableCellType(source.cellType, ctx)
    ret.text = exportText(source.text, ctx)
    if (source.imageRef !== undefined) ret.imageRef = source.imageRef
    if (source.rowSpan !== undefined) ret.rowSpan = source.rowSpan
    if (source.colSpan !== undefined) ret.colSpan = source.colSpan
    return ret
}
/* table shape */
export function exportTableShape(source: types.TableShape, ctx?: IExportContext): types.TableShape {
    const ret: types.TableShape = exportShape(source, ctx) as types.TableShape
    ret.size = exportShapeSize(source.size, ctx)
    ret.cells = (() => {
        const ret: any = {}
        source.cells.forEach((source, k) => {
            ret[k] = exportTableCell(source, ctx)
        })
        return ret
    })()
    ret.rowHeights = exportTableShape_rowHeights(source.rowHeights, ctx)
    ret.colWidths = exportTableShape_colWidths(source.colWidths, ctx)
    if (source.textAttr !== undefined) ret.textAttr = exportTextAttr(source.textAttr, ctx)
    return ret
}
/* text shape */
export function exportTextShape(source: types.TextShape, ctx?: IExportContext): types.TextShape {
    const ret: types.TextShape = exportShape(source, ctx) as types.TextShape
    ret.size = exportShapeSize(source.size, ctx)
    ret.text = exportText(source.text, ctx)
    if (source.fixedRadius !== undefined) ret.fixedRadius = source.fixedRadius
    return ret
}
/* color */
export function exportVariable(source: types.Variable, ctx?: IExportContext): types.Variable {
    const ret: types.Variable = {} as types.Variable
    ret.id = source.id
    ret.type = exportVariableType(source.type, ctx)
    ret.name = source.name
    ret.value = (() => {
        if (typeof source.value !== "object" || source.value == null) {
            return source.value == null ? undefined : source.value
        }
        if (Array.isArray(source.value)) {
            return exportVariable_0(source.value, ctx)
        }
        if (source.value.typeId === "color") {
            return exportColor(source.value as types.Color, ctx)
        }
        if (source.value.typeId === "text") {
            return exportText(source.value as types.Text, ctx)
        }
        if (source.value.typeId === "gradient") {
            return exportGradient(source.value as types.Gradient, ctx)
        }
        if (source.value.typeId === "style") {
            return exportStyle(source.value as types.Style, ctx)
        }
        if (source.value.typeId === "border") {
            return exportBorder(source.value as types.Border, ctx)
        }
        if (source.value.typeId === "context-settings") {
            return exportContextSettings(source.value as types.ContextSettings, ctx)
        }
        if (source.value.typeId === "table-cell") {
            return exportTableCell(source.value as types.TableCell, ctx)
        }
        if (source.value.typeId === "export-options") {
            return exportExportOptions(source.value as types.ExportOptions, ctx)
        }
        if (source.value.typeId === "corner-radius") {
            return exportCornerRadius(source.value as types.CornerRadius, ctx)
        }
        if (source.value.typeId === "blur") {
            return exportBlur(source.value as types.Blur, ctx)
        }
        if (source.value.typeId === "auto-layout") {
            return exportAutoLayout(source.value as types.AutoLayout, ctx)
        }
        throw new Error("unknow typeId: " + source.value.typeId)
    })()
    return ret
}
/* comment */
export function exportComment(source: types.Comment, ctx?: IExportContext): types.Comment {
    const ret: types.Comment = {} as types.Comment
    ret.pageId = source.pageId
    ret.id = source.id
    ret.frame = exportShapeFrame(source.frame, ctx)
    ret.user = exportUserInfo(source.user, ctx)
    ret.createAt = source.createAt
    ret.content = source.content
    ret.parasiticBody = exportShape(source.parasiticBody, ctx)
    if (source.parentId !== undefined) ret.parentId = source.parentId
    if (source.rootId !== undefined) ret.rootId = source.rootId
    return ret
}
/* path shape */
export function exportPathShape(source: types.PathShape, ctx?: IExportContext): types.PathShape {
    const ret: types.PathShape = exportShape(source, ctx) as types.PathShape
    ret.size = exportShapeSize(source.size, ctx)
    ret.pathsegs = exportPathShape_pathsegs(source.pathsegs, ctx)
    if (source.fixedRadius !== undefined) ret.fixedRadius = source.fixedRadius
    return ret
}
/* path shape */
export function exportPathShape2(source: types.PathShape2, ctx?: IExportContext): types.PathShape2 {
    const ret: types.PathShape2 = exportShape(source, ctx) as types.PathShape2
    ret.size = exportShapeSize(source.size, ctx)
    ret.pathsegs = exportPathShape2_pathsegs(source.pathsegs, ctx)
    if (source.fixedRadius !== undefined) ret.fixedRadius = source.fixedRadius
    return ret
}
/* polygon shape */
export function exportPolygonShape(source: types.PolygonShape, ctx?: IExportContext): types.PolygonShape {
    const ret: types.PolygonShape = exportPathShape(source, ctx) as types.PolygonShape
    ret.counts = source.counts
    return ret
}
/* rect shape */
export function exportRectShape(source: types.RectShape, ctx?: IExportContext): types.RectShape {
    const ret: types.RectShape = exportPathShape(source, ctx) as types.RectShape
    return ret
}
/* star shape */
export function exportStarShape(source: types.StarShape, ctx?: IExportContext): types.StarShape {
    const ret: types.StarShape = exportPathShape(source, ctx) as types.StarShape
    ret.counts = source.counts
    ret.innerAngle = source.innerAngle
    return ret
}
/* symbol ref shape */
export function exportSymbolRefShape(source: types.SymbolRefShape, ctx?: IExportContext): types.SymbolRefShape {
    const ret: types.SymbolRefShape = exportShape(source, ctx) as types.SymbolRefShape
    ret.size = exportShapeSize(source.size, ctx)
    ret.refId = source.refId
    ret.variables = (() => {
        const ret: any = {}
        source.variables.forEach((source, k) => {
            ret[k] = exportVariable(source, ctx)
        })
        return ret
    })()
    if (source.overrides !== undefined) ret.overrides = (() => {
        const ret: any = {}
        source.overrides.forEach((source, k) => {
            ret[k] = source
        })
        return ret
    })()
    if (source.isCustomSize !== undefined) ret.isCustomSize = source.isCustomSize
    if (source.cornerRadius !== undefined) ret.cornerRadius = exportCornerRadius(source.cornerRadius, ctx)
    if (source.innerEnvScale !== undefined) ret.innerEnvScale = source.innerEnvScale
    if (source.uniformScale !== undefined) ret.uniformScale = source.uniformScale
    return ret
}
/* connection */
export function exportConnection(source: types.Connection, ctx?: IExportContext): types.Connection {
    const ret: types.Connection = exportPathShape(source, ctx) as types.Connection
    ret.isEdited = source.isEdited
    if (source.from !== undefined) ret.from = exportContactForm(source.from, ctx)
    if (source.to !== undefined) ret.to = exportContactForm(source.to, ctx)
    return ret
}
/* contact shape */
export function exportContactShape(source: types.ContactShape, ctx?: IExportContext): types.ContactShape {
    const ret: types.ContactShape = exportPathShape(source, ctx) as types.ContactShape
    ret.isEdited = source.isEdited
    ret.text = exportText(source.text, ctx)
    ret.mark = source.mark
    if (source.from !== undefined) ret.from = exportContactForm(source.from, ctx)
    if (source.to !== undefined) ret.to = exportContactForm(source.to, ctx)
    return ret
}
/* cutout shape */
export function exportCutoutShape(source: types.CutoutShape, ctx?: IExportContext): types.CutoutShape {
    const ret: types.CutoutShape = exportPathShape(source, ctx) as types.CutoutShape
    return ret
}
/* image shape */
export function exportImageShape(source: types.ImageShape, ctx?: IExportContext): types.ImageShape {
    const ret: types.ImageShape = exportPathShape(source, ctx) as types.ImageShape
    ret.imageRef = source.imageRef
    return ret
}
/* line shape */
export function exportLineShape(source: types.LineShape, ctx?: IExportContext): types.LineShape {
    const ret: types.LineShape = exportPathShape(source, ctx) as types.LineShape
    return ret
}
/* oval shape */
export function exportOvalShape(source: types.OvalShape, ctx?: IExportContext): types.OvalShape {
    const ret: types.OvalShape = exportPathShape(source, ctx) as types.OvalShape
    ret.ellipse = exportEllipse(source.ellipse, ctx)
    if (source.startingAngle !== undefined) ret.startingAngle = source.startingAngle
    if (source.endingAngle !== undefined) ret.endingAngle = source.endingAngle
    if (source.innerRadius !== undefined) ret.innerRadius = source.innerRadius
    return ret
}
/* artboard shape */
export function exportArtboard(source: types.Artboard, ctx?: IExportContext): types.Artboard {
    const ret: types.Artboard = exportGroupShape(source, ctx) as types.Artboard
    ret.size = exportShapeSize(source.size, ctx)
    if (source.cornerRadius !== undefined) ret.cornerRadius = exportCornerRadius(source.cornerRadius, ctx)
    if (source.guides !== undefined) ret.guides = exportArtboard_guides(source.guides, ctx)
    if (source.autoLayout !== undefined) ret.autoLayout = exportAutoLayout(source.autoLayout, ctx)
    if (source.frameMaskDisabled !== undefined) ret.frameMaskDisabled = source.frameMaskDisabled
    return ret
}
/* bool shape */
export function exportBoolShape(source: types.BoolShape, ctx?: IExportContext): types.BoolShape {
    const ret: types.BoolShape = exportGroupShape(source, ctx) as types.BoolShape
    return ret
}
/* group shape */
export function exportGroupShape(source: types.GroupShape, ctx?: IExportContext): types.GroupShape {
    const ret: types.GroupShape = exportShape(source, ctx) as types.GroupShape
    ret.childs = exportGroupShape_childs(source.childs, ctx)
    if (source.fixedRadius !== undefined) ret.fixedRadius = source.fixedRadius
    return ret
}
/* page */
export function exportPage(source: types.Page, ctx?: IExportContext): types.Page {
    const ret: types.Page = exportGroupShape(source, ctx) as types.Page
    if (source.backgroundColor !== undefined) ret.backgroundColor = exportColor(source.backgroundColor, ctx)
    if (source.guides !== undefined) ret.guides = exportPage_guides(source.guides, ctx)
    if (source.connections !== undefined) ret.connections = exportPage_connections(source.connections, ctx)
    return ret
}
/* symbol shape */
export function exportSymbolShape(source: types.SymbolShape, ctx?: IExportContext): types.SymbolShape {
    const ret: types.SymbolShape = exportGroupShape(source, ctx) as types.SymbolShape
    ret.size = exportShapeSize(source.size, ctx)
    ret.variables = (() => {
        const ret: any = {}
        source.variables.forEach((source, k) => {
            ret[k] = exportVariable(source, ctx)
        })
        return ret
    })()
    if (source.symtags !== undefined) ret.symtags = (() => {
        const ret: any = {}
        source.symtags.forEach((source, k) => {
            ret[k] = source
        })
        return ret
    })()
    if (source.cornerRadius !== undefined) ret.cornerRadius = exportCornerRadius(source.cornerRadius, ctx)
    if (source.guides !== undefined) ret.guides = exportSymbolShape_guides(source.guides, ctx)
    if (source.autoLayout !== undefined) ret.autoLayout = exportAutoLayout(source.autoLayout, ctx)
    if (source.frameMaskDisabled !== undefined) ret.frameMaskDisabled = source.frameMaskDisabled
    return ret
}
/* symbol union shape */
export function exportSymbolUnionShape(source: types.SymbolUnionShape, ctx?: IExportContext): types.SymbolUnionShape {
    const ret: types.SymbolUnionShape = exportSymbolShape(source, ctx) as types.SymbolUnionShape
    return ret
}
/* table shape2 */
export function exportTableShape2(source: types.TableShape2, ctx?: IExportContext): types.TableShape2 {
    const ret: types.TableShape2 = exportShape(source, ctx) as types.TableShape2
    ret.size = exportShapeSize(source.size, ctx)
    ret.cells = (() => {
        const ret: any = {}
        source.cells.forEach((source, k) => {
            ret[k] = exportArtboard(source, ctx)
        })
        return ret
    })()
    ret.cellAttrs = (() => {
        const ret: any = {}
        source.cellAttrs.forEach((source, k) => {
            ret[k] = exportTableCellAttr(source, ctx)
        })
        return ret
    })()
    ret.rowHeights = exportTableShape2_rowHeights(source.rowHeights, ctx)
    ret.colWidths = exportTableShape2_colWidths(source.colWidths, ctx)
    if (source.textAttr !== undefined) ret.textAttr = exportTextAttr(source.textAttr, ctx)
    return ret
}