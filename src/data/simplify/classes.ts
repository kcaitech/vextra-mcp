/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

export {
    BlendMode,
    BlurType,
    BoolOp,
    BorderPosition,
    BulletNumbersBehavior,
    BulletNumbersType,
    ContactRoleType,
    ContactType,
    CornerType,
    CurveMode,
    FillRule,
    FillType,
    GradientType,
    GuideAxis,
    ImageScaleMode,
    LineCapStyle,
    LineJoinStyle,
    MarkerType,
    OverlayBackgroundInteraction,
    OverlayBackgroundType,
    OverlayPositionType,
    OverrideType,
    PaintFilterType,
    PrototypeConnectionType,
    PrototypeEasingType,
    PrototypeEvents,
    PrototypeNavigationType,
    PrototypeTransitionType,
    ResizeType,
    ScrollBehavior,
    ScrollDirection,
    ShadowPosition,
    ShapeType,
    SideType,
    StackAlign,
    StackMode,
    StackPositioning,
    StackSizing,
    StackWrap,
    StrikethroughType,
    StyleLibType,
    StyleVarType,
    TextBehaviour,
    TextHorAlign,
    TextOrientation,
    TextTransformType,
    TextVerAlign,
    UnderlineType,
    VariableType,
    WindingRule
} from "./types"
import {
    BlendMode,
    BlurType,
    BoolOp,
    BorderPosition,
    BulletNumbersBehavior,
    BulletNumbersType,
    ContactRoleType,
    ContactType,
    CornerType,
    CurveMode,
    FillRule,
    FillType,
    GradientType,
    GuideAxis,
    ImageScaleMode,
    LineCapStyle,
    LineJoinStyle,
    MarkerType,
    OverlayBackgroundInteraction,
    OverlayBackgroundType,
    OverlayPositionType,
    OverrideType,
    PaintFilterType,
    PrototypeConnectionType,
    PrototypeEasingType,
    PrototypeEvents,
    PrototypeNavigationType,
    PrototypeTransitionType,
    ResizeType,
    ScrollBehavior,
    ScrollDirection,
    ShadowPosition,
    ShapeType,
    SideType,
    StackAlign,
    StackMode,
    StackPositioning,
    StackSizing,
    StackWrap,
    StrikethroughType,
    StyleLibType,
    StyleVarType,
    TextBehaviour,
    TextHorAlign,
    TextOrientation,
    TextTransformType,
    TextVerAlign,
    UnderlineType,
    VariableType,
    WindingRule
} from "./types"
type Artboard_guides = Array<Guide>
/* border style */
export class BorderStyle {
    typeId = "border-style"
    length: number
    gap: number
    constructor(length: number = 0, gap: number = 0) {
        this.length = length
        this.gap = gap
    }
}
type Border_strokePaints = Array<Fill>
/* bullet numbers */
export class BulletNumbers {
    typeId = "bullet-numbers"
    type: BulletNumbersType
    behavior?: BulletNumbersBehavior
    offset?: number
    constructor(type: BulletNumbersType) {
        this.type = type
    }
}
/* color controls */
export class ColorControls {
    typeId = "color-controls"
    isEnabled: boolean
    brightness: number
    contrast: number
    hue: number
    saturation: number
    constructor(isEnabled: boolean = false, brightness: number = 0, contrast: number = 0, hue: number = 0, saturation: number = 0) {
        this.isEnabled = isEnabled
        this.brightness = brightness
        this.contrast = contrast
        this.hue = hue
        this.saturation = saturation
    }
}
/* color */
export class Color {
    typeId = "color"
    alpha: number
    red: number
    green: number
    blue: number
    constructor(alpha: number = 0, red: number = 0, green: number = 0, blue: number = 0) {
        this.alpha = alpha
        this.red = red
        this.green = green
        this.blue = blue
    }
}
/* contactstyle */
export class ContactRole {
    typeId = "contact-role"
    id: string
    roleType: ContactRoleType
    shapeId: string
    constructor(id: string, roleType: ContactRoleType, shapeId: string) {
        this.id = id
        this.roleType = roleType
        this.shapeId = shapeId
    }
}
/* context settings */
export class ContextSettings {
    typeId = "context-settings"
    blenMode: BlendMode
    opacity: number
    constructor(blenMode: BlendMode, opacity: number = 1) {
        this.blenMode = blenMode
        this.opacity = opacity
    }
}
/* couner radius */
export class CornerRadius {
    typeId = "corner-radius"
    id: string
    lt: number
    rt: number
    lb: number
    rb: number
    constructor(id: string, lt: number = 0, rt: number = 0, lb: number = 0, rb: number = 0) {
        this.id = id
        this.lt = lt
        this.rt = rt
        this.lb = lb
        this.rb = rb
    }
}
/* crdt number */
export class CrdtNumber {
    typeId = "crdt-number"
    id: string
    value: number
    constructor(id: string, value: number) {
        this.id = id
        this.value = value
    }
}
/* curve point */
export class CurvePoint {
    typeId = "curve-point"
    id: string
    x: number
    y: number
    mode: CurveMode
    radius?: number
    fromX?: number
    fromY?: number
    toX?: number
    toY?: number
    hasFrom?: boolean
    hasTo?: boolean
    constructor(id: string, x: number, y: number, mode: CurveMode) {
        this.id = id
        this.x = x
        this.y = y
        this.mode = mode
    }
}
/* ellipse attributes */
export class Ellipse {
    typeId = "ellipse"
    cx: number
    cy: number
    rx: number
    ry: number
    constructor(cx: number = 0, cy: number = 0, rx: number = 0, ry: number = 0) {
        this.cx = cx
        this.cy = cy
        this.rx = rx
        this.ry = ry
    }
}
type FillMask_fills = Array<Fill>
type Gradient_stops = Array<Stop>
/* graphics contex settings */
export class GraphicsContextSettings {
    typeId = "graphics-context-settings"
    blendMode: BlendMode
    opacity: number
    constructor(blendMode: BlendMode, opacity: number = 1) {
        this.blendMode = blendMode
        this.opacity = opacity
    }
}
type GroupShape_childs = Array<GroupShape | ImageShape | PathShape | PathShape2 | RectShape | SymbolRefShape | SymbolShape | SymbolUnionShape | TextShape | Artboard | LineShape | OvalShape | ContactShape | Shape | CutoutShape | BoolShape | PolygonShape | StarShape>
/* guide */
export class Guide {
    typeId = "guide"
    id: string
    axis: GuideAxis
    offset: number
    constructor(id: string, axis: GuideAxis, offset: number = 0) {
        this.id = id
        this.axis = axis
        this.offset = offset
    }
}
/* overlay margin */
export class OverlayMargin {
    typeId = "overlay-margin"
    top: number
    bottom: number
    left: number
    right: number
    constructor(top: number = 0, bottom: number = 0, left: number = 0, right: number = 0) {
        this.top = top
        this.bottom = bottom
        this.left = left
        this.right = right
    }
}
/* overlay position */
export class OverlayPosition {
    typeId = "overlay-position"
    position: OverlayPositionType
    margin: OverlayMargin
    constructor(position: OverlayPositionType, margin: OverlayMargin) {
        this.position = position
        this.margin = margin
    }
}
/* padding */
export class Padding {
    typeId = "padding"
    left?: number
    top?: number
    right?: number
    bottom?: number
}
/* page list item */
export class PageListItem {
    typeId = "page-list-item"
    id: string
    name: string
    versionId?: string
    constructor(id: string, name: string) {
        this.id = id
        this.name = name
    }
}
type Page_guides = Array<Guide>
type Page_connections = Array<Connection>
/* paint filter */
export class PaintFilter {
    typeId = "paint-filter"
    exposure: number
    contrast: number
    saturation: number
    temperature: number
    tint: number
    shadow: number
    hue: number
    constructor(exposure: number = 0, contrast: number = 0, saturation: number = 0, temperature: number = 0, tint: number = 0, shadow: number = 0, hue: number = 0) {
        this.exposure = exposure
        this.contrast = contrast
        this.saturation = saturation
        this.temperature = temperature
        this.tint = tint
        this.shadow = shadow
        this.hue = hue
    }
}
type Para_spans = Array<Span>
type PathSegment_points = Array<CurvePoint>
/* path segment */
export class PathSegment {
    typeId = "path-segment"
    id: string
    points: PathSegment_points
    isClosed: boolean
    constructor(id: string, points: PathSegment_points, isClosed: boolean) {
        this.id = id
        this.points = points
        this.isClosed = isClosed
    }
}
type PathShape_pathsegs = Array<PathSegment>
type PathShape2_pathsegs = Array<PathSegment>
/* pattern transform */
export class PatternTransform {
    typeId = "pattern-transform"
    m00: number
    m01: number
    m02: number
    m10: number
    m11: number
    m12: number
    constructor(m00: number = 1, m01: number = 0, m02: number = 0, m10: number = 1, m11: number = 0, m12: number = 0) {
        this.m00 = m00
        this.m01 = m01
        this.m02 = m02
        this.m10 = m10
        this.m11 = m11
        this.m12 = m12
    }
}
/* point 2d */
export class Point2D {
    typeId = "point-2d"
    x: number
    y: number
    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }
}
/* prototypeEasingBezier */
export class PrototypeEasingBezier {
    typeId = "prototype-easing-bezier"
    x1: number
    y1: number
    x2: number
    y2: number
    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }
}
/* prototypeStartingPoint */
export class PrototypeStartingPoint {
    typeId = "prototype-starting-point"
    name: string
    desc: string
    constructor(name: string, desc: string) {
        this.name = name
        this.desc = desc
    }
}
/* crdtidx */
export type Radius = Array<number>
type ShadowMask_shadows = Array<Shadow>
/* shadow */
export class Shadow {
    typeId = "shadow"
    id: string
    isEnabled: boolean
    blurRadius: number
    color: Color
    offsetX: number
    offsetY: number
    spread: number
    position: ShadowPosition
    contextSettings?: GraphicsContextSettings
    mask?: string
    constructor(id: string, isEnabled: boolean, blurRadius: number, color: Color, offsetX: number, offsetY: number, spread: number, position: ShadowPosition) {
        this.id = id
        this.isEnabled = isEnabled
        this.blurRadius = blurRadius
        this.color = color
        this.offsetX = offsetX
        this.offsetY = offsetY
        this.spread = spread
        this.position = position
    }
}
/* shape frame
 * x,y为parent坐标系里的点
 * width,height为当前shape的坐标空间大小 */
export class ShapeFrame {
    typeId = "shape-frame"
    x: number
    y: number
    width: number
    height: number
    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}
/* shape size */
export class ShapeSize {
    typeId = "shape-size"
    width: number
    height: number
    constructor(width: number = 0, height: number = 0) {
        this.width = width
        this.height = height
    }
}
type Shape_prototypeInteractions = Array<PrototypeInteraction>
/* stack size */
export class StackSize {
    typeId = "stack-size"
    x: number
    y: number
    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }
}
/* stop */
export class Stop {
    typeId = "stop"
    id: string
    position: number
    color: Color
    constructor(id: string, position: number, color: Color) {
        this.id = id
        this.position = position
        this.color = color
    }
}
type StyleSheet_variables = Array<FillMask | ShadowMask | BlurMask | BorderMask | RadiusMask | TextMask>
type Style_fills = Array<Fill>
type Style_shadows = Array<Shadow>
type Style_innerShadows = Array<Shadow>
type Style_contacts = Array<ContactRole>
type SymbolShape_guides = Array<Guide>
type Text_paras = Array<Para>
/* transform */
export class Transform {
    typeId = "transform"
    m00: number
    m01: number
    m02: number
    m10: number
    m11: number
    m12: number
    constructor(m00: number = 1, m01: number = 0, m02: number = 0, m10: number = 0, m11: number = 1, m12: number = 0) {
        this.m00 = m00
        this.m01 = m01
        this.m02 = m02
        this.m10 = m10
        this.m11 = m11
        this.m12 = m12
    }
}
/* user infomation */
export class UserInfo {
    typeId = "user-info"
    userId: string
    userNickname: string
    avatar: string
    constructor(userId: string, userNickname: string, avatar: string) {
        this.userId = userId
        this.userNickname = userNickname
        this.avatar = avatar
    }
}
type Variable_0 = Array<Fill | Shadow | PrototypeInteraction>
/* auto layout */
export class AutoLayout {
    typeId = "auto-layout"
    stackSpacing: number
    stackCounterSpacing: number
    stackHorizontalPadding: number
    stackVerticalPadding: number
    stackPaddingRight: number
    stackPaddingBottom: number
    stackPrimarySizing: StackSizing
    stackMode?: StackMode
    stackWrap?: StackWrap
    stackHorizontalGapSizing?: StackSizing
    stackVerticalGapSizing?: StackSizing
    stackCounterSizing?: StackSizing
    stackPrimaryAlignItems?: StackAlign
    stackCounterAlignItems?: StackAlign
    stackReverseZIndex?: boolean
    bordersTakeSpace?: boolean
    minSize?: StackSize
    maxSize?: StackSize
    constructor(stackSpacing: number, stackCounterSpacing: number, stackHorizontalPadding: number, stackVerticalPadding: number, stackPaddingRight: number, stackPaddingBottom: number, stackPrimarySizing: StackSizing) {
        this.stackSpacing = stackSpacing
        this.stackCounterSpacing = stackCounterSpacing
        this.stackHorizontalPadding = stackHorizontalPadding
        this.stackVerticalPadding = stackVerticalPadding
        this.stackPaddingRight = stackPaddingRight
        this.stackPaddingBottom = stackPaddingBottom
        this.stackPrimarySizing = stackPrimarySizing
    }
}
/* blur */
export class Blur {
    typeId = "blur"
    isEnabled: boolean
    center: Point2D
    saturation: number
    type: BlurType
    motionAngle?: number
    radius?: number
    constructor(isEnabled: boolean, center: Point2D, saturation: number, type: BlurType) {
        this.isEnabled = isEnabled
        this.center = center
        this.saturation = saturation
        this.type = type
    }
}
/* border options */
export class BorderOptions {
    typeId = "border-options"
    isEnabled: boolean
    lineCapStyle: LineCapStyle
    lineJoinStyle: LineJoinStyle
    constructor(isEnabled: boolean, lineCapStyle: LineCapStyle, lineJoinStyle: LineJoinStyle) {
        this.isEnabled = isEnabled
        this.lineCapStyle = lineCapStyle
        this.lineJoinStyle = lineJoinStyle
    }
}
/* border side setting */
export class BorderSideSetting {
    typeId = "border-side-setting"
    sideType: SideType
    thicknessTop: number
    thicknessLeft: number
    thicknessBottom: number
    thicknessRight: number
    constructor(sideType: SideType, thicknessTop: number = 1, thicknessLeft: number = 1, thicknessBottom: number = 1, thicknessRight: number = 1) {
        this.sideType = sideType
        this.thicknessTop = thicknessTop
        this.thicknessLeft = thicknessLeft
        this.thicknessBottom = thicknessBottom
        this.thicknessRight = thicknessRight
    }
}
/* contact form */
export class ContactForm {
    typeId = "contact-form"
    contactType: ContactType
    shapeId: string
    constructor(contactType: ContactType, shapeId: string) {
        this.contactType = contactType
        this.shapeId = shapeId
    }
}
/* gradient */
export class Gradient {
    typeId = "gradient"
    from: Point2D
    to: Point2D
    gradientType: GradientType
    stops: Gradient_stops
    elipseLength?: number
    gradientOpacity?: number
    constructor(from: Point2D, to: Point2D, gradientType: GradientType, stops: Gradient_stops) {
        this.from = from
        this.to = to
        this.gradientType = gradientType
        this.stops = stops
    }
}
/* overlay-background-appearance */
export class OverlayBackgroundAppearance {
    typeId = "overlay-background-appearance"
    backgroundType: OverlayBackgroundType
    backgroundColor: Color
    constructor(backgroundType: OverlayBackgroundType, backgroundColor: Color) {
        this.backgroundType = backgroundType
        this.backgroundColor = backgroundColor
    }
}
/* actions */
export class PrototypeActions {
    typeId = "prototype-actions"
    connectionType: PrototypeConnectionType
    openUrlInNewTab: boolean
    targetNodeID?: string
    transitionType?: PrototypeTransitionType
    transitionDuration?: number
    easingType?: PrototypeEasingType
    connectionURL?: string
    navigationType?: PrototypeNavigationType
    easingFunction?: PrototypeEasingBezier
    extraScrollOffset?: Point2D
    constructor(connectionType: PrototypeConnectionType, openUrlInNewTab: boolean) {
        this.connectionType = connectionType
        this.openUrlInNewTab = openUrlInNewTab
    }
}
/* event */
export class PrototypeEvent {
    typeId = "prototype-event"
    interactionType: PrototypeEvents
    transitionTimeout?: number
    constructor(interactionType: PrototypeEvents) {
        this.interactionType = interactionType
    }
}
/* prototypeInteraction */
export class PrototypeInteraction {
    typeId = "prototype-interaction"
    event: PrototypeEvent
    actions: PrototypeActions
    id?: string
    isDeleted?: boolean
    constructor(event: PrototypeEvent, actions: PrototypeActions) {
        this.event = event
        this.actions = actions
    }
}
/* radius mask */
export class RadiusMask {
    typeId = "radius-mask"
    sheet: string
    id: string
    name: string
    description: string
    radius: Radius
    disabled?: boolean
    constructor(sheet: string, id: string, name: string, description: string, radius: Radius) {
        this.sheet = sheet
        this.id = id
        this.name = name
        this.description = description
        this.radius = radius
    }
}
/* shadow mask */
export class ShadowMask {
    typeId = "shadow-mask"
    sheet: string
    id: string
    name: string
    description: string
    shadows: ShadowMask_shadows
    disabled?: boolean
    constructor(sheet: string, id: string, name: string, description: string, shadows: ShadowMask_shadows) {
        this.sheet = sheet
        this.id = id
        this.name = name
        this.description = description
        this.shadows = shadows
    }
}
/* span attr */
export class SpanAttr {
    typeId = "span-attr"
    fontName?: string
    fontSize?: number
    color?: Color
    strikethrough?: StrikethroughType
    underline?: UnderlineType
    weight?: number
    italic?: boolean
    bulletNumbers?: BulletNumbers
    highlight?: Color
    kerning?: number
    transform?: TextTransformType
    placeholder?: boolean
    fillType?: FillType
    gradient?: Gradient
    textMask?: string
}
/* span attr */
export class Span extends SpanAttr {
    typeId = "span"
    length: number
    constructor(length: number = 0) {
        super()
        this.length = length
    }
}
/* blur mask */
export class BlurMask {
    typeId = "blur-mask"
    sheet: string
    id: string
    name: string
    description: string
    blur: Blur
    disabled?: boolean
    constructor(sheet: string, id: string, name: string, description: string, blur: Blur) {
        this.sheet = sheet
        this.id = id
        this.name = name
        this.description = description
        this.blur = blur
    }
}
/* border mask type */
export class BorderMaskType {
    typeId = "border-mask-type"
    position: BorderPosition
    sideSetting: BorderSideSetting
    constructor(position: BorderPosition, sideSetting: BorderSideSetting) {
        this.position = position
        this.sideSetting = sideSetting
    }
}
/* border mask */
export class BorderMask {
    typeId = "border-mask"
    sheet: string
    id: string
    name: string
    description: string
    border: BorderMaskType
    disabled?: boolean
    constructor(sheet: string, id: string, name: string, description: string, border: BorderMaskType) {
        this.sheet = sheet
        this.id = id
        this.name = name
        this.description = description
        this.border = border
    }
}
/* fill */
export class Fill {
    typeId = "fill"
    id: string
    isEnabled: boolean
    fillType: FillType
    color: Color
    contextSettings?: ContextSettings
    gradient?: Gradient
    imageRef?: string
    fillRule?: FillRule
    imageScaleMode?: ImageScaleMode
    rotation?: number
    scale?: number
    originalImageWidth?: number
    originalImageHeight?: number
    paintFilter?: PaintFilter
    transform?: PatternTransform
    constructor(id: string, isEnabled: boolean, fillType: FillType, color: Color) {
        this.id = id
        this.isEnabled = isEnabled
        this.fillType = fillType
        this.color = color
    }
}
/* span attr */
export class ParaAttr extends SpanAttr {
    typeId = "para-attr"
    alignment?: TextHorAlign
    paraSpacing?: number
    minimumLineHeight?: number
    maximumLineHeight?: number
    autoLineHeight?: boolean
    indent?: number
}
/* para */
export class Para {
    typeId = "para"
    text: string
    spans: Para_spans
    attr?: ParaAttr
    constructor(text: string, spans: Para_spans) {
        this.text = text
        this.spans = spans
    }
}
/* text attr */
export class TextAttr extends ParaAttr {
    typeId = "text-attr"
    verAlign?: TextVerAlign
    orientation?: TextOrientation
    textBehaviour?: TextBehaviour
    padding?: Padding
}
/* text mask */
export class TextMask {
    typeId = "text-mask"
    sheet: string
    id: string
    name: string
    description: string
    text: TextAttr
    disabled?: boolean
    constructor(sheet: string, id: string, name: string, description: string, text: TextAttr) {
        this.sheet = sheet
        this.id = id
        this.name = name
        this.description = description
        this.text = text
    }
}
/* text */
export class Text {
    typeId = "text"
    paras: Text_paras
    attr?: TextAttr
    fixed?: boolean
    constructor(paras: Text_paras) {
        this.paras = paras
    }
}
/* border */
export class Border {
    typeId = "border"
    position: BorderPosition
    borderStyle: BorderStyle
    cornerType: CornerType
    sideSetting: BorderSideSetting
    strokePaints: Border_strokePaints
    fillsMask?: string
    constructor(position: BorderPosition, borderStyle: BorderStyle, cornerType: CornerType, sideSetting: BorderSideSetting, strokePaints: Border_strokePaints) {
        this.position = position
        this.borderStyle = borderStyle
        this.cornerType = cornerType
        this.sideSetting = sideSetting
        this.strokePaints = strokePaints
    }
}
/* fill mask */
export class FillMask {
    typeId = "fill-mask"
    sheet: string
    id: string
    name: string
    description: string
    fills: FillMask_fills
    disabled?: boolean
    constructor(sheet: string, id: string, name: string, description: string, fills: FillMask_fills) {
        this.sheet = sheet
        this.id = id
        this.name = name
        this.description = description
        this.fills = fills
    }
}
/* style sheet */
export class StyleSheet {
    typeId = "style-sheet"
    id: string
    name: string
    variables: StyleSheet_variables
    constructor(id: string, name: string, variables: StyleSheet_variables) {
        this.id = id
        this.name = name
        this.variables = variables
    }
}
/* style */
export class Style {
    typeId = "style"
    fills: Style_fills
    shadows: Style_shadows
    borders: Border
    miterLimit?: number
    windingRule?: WindingRule
    blur?: Blur
    borderOptions?: BorderOptions
    colorControls?: ColorControls
    contextSettings?: ContextSettings
    innerShadows?: Style_innerShadows
    contacts?: Style_contacts
    startMarkerType?: MarkerType
    endMarkerType?: MarkerType
    varbinds?: Map<string, string>
    fillsMask?: string
    shadowsMask?: string
    blursMask?: string
    bordersMask?: string
    constructor(fills: Style_fills, shadows: Style_shadows, borders: Border) {
        this.fills = fills
        this.shadows = shadows
        this.borders = borders
    }
}
/* color */
export class Variable {
    typeId = "variable"
    id: string
    type: VariableType
    name: string
    value: undefined | number | string | boolean | Color | Text | Gradient | Style | Variable_0 | Border | ContextSettings | CornerRadius | Blur | AutoLayout
    constructor(id: string, type: VariableType, name: string, value: undefined | number | string | boolean | Color | Text | Gradient | Style | Variable_0 | Border | ContextSettings | CornerRadius | Blur | AutoLayout) {
        this.id = id
        this.type = type
        this.name = name
        this.value = value
    }
}
/* shape */
export class Shape {
    typeId = "shape"
    id: string
    name: string
    type: ShapeType
    transform: Transform
    style: Style
    boolOp?: BoolOp
    isFixedToViewport?: boolean
    isLocked?: boolean
    isVisible?: boolean
    nameIsFixed?: boolean
    resizingConstraint?: number
    resizingType?: ResizeType
    constrainerProportions?: boolean
    clippingMaskMode?: number
    hasClippingMask?: boolean
    shouldBreakMaskChain?: boolean
    varbinds?: Map<string, string>
    haveEdit?: boolean
    prototypeStartingPoint?: PrototypeStartingPoint
    prototypeInteractions?: Shape_prototypeInteractions
    overlayPosition?: OverlayPosition
    overlayBackgroundInteraction?: OverlayBackgroundInteraction
    overlayBackgroundAppearance?: OverlayBackgroundAppearance
    scrollDirection?: ScrollDirection
    scrollBehavior?: ScrollBehavior
    mask?: boolean
    stackPositioning?: StackPositioning
    radiusMask?: string
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style) {
        this.id = id
        this.name = name
        this.type = type
        this.transform = transform
        this.style = style
    }
}
/* symbol ref shape */
export class SymbolRefShape extends Shape {
    typeId = "symbol-ref-shape"
    size: ShapeSize
    refId: string
    variables: Map<string, Variable>
    overrides?: Map<string, string>
    isCustomSize?: boolean
    cornerRadius?: CornerRadius
    innerEnvScale?: number
    uniformScale?: number
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, size: ShapeSize, refId: string, variables: Map<string, Variable>) {
        super(id, name, type, transform, style)
        this.size = size
        this.refId = refId
        this.variables = variables
    }
}
/* text shape */
export class TextShape extends Shape {
    typeId = "text-shape"
    size: ShapeSize
    text: Text
    fixedRadius?: number
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, size: ShapeSize, text: Text) {
        super(id, name, type, transform, style)
        this.size = size
        this.text = text
    }
}
/* comment */
export class Comment {
    typeId = "comment"
    pageId: string
    id: string
    frame: ShapeFrame
    user: UserInfo
    createAt: string
    content: string
    parasiticBody: Shape
    parentId?: string
    rootId?: string
    constructor(pageId: string, id: string, frame: ShapeFrame, user: UserInfo, createAt: string, content: string, parasiticBody: Shape) {
        this.pageId = pageId
        this.id = id
        this.frame = frame
        this.user = user
        this.createAt = createAt
        this.content = content
        this.parasiticBody = parasiticBody
    }
}
/* path shape */
export class PathShape extends Shape {
    typeId = "path-shape"
    size: ShapeSize
    pathsegs: PathShape_pathsegs
    fixedRadius?: number
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, size: ShapeSize, pathsegs: PathShape_pathsegs) {
        super(id, name, type, transform, style)
        this.size = size
        this.pathsegs = pathsegs
    }
}
/* path shape */
export class PathShape2 extends Shape {
    typeId = "path-shape2"
    size: ShapeSize
    pathsegs: PathShape2_pathsegs
    fixedRadius?: number
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, size: ShapeSize, pathsegs: PathShape2_pathsegs) {
        super(id, name, type, transform, style)
        this.size = size
        this.pathsegs = pathsegs
    }
}
/* polygon shape */
export class PolygonShape extends PathShape {
    typeId = "polygon-shape"
    counts: number
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, size: ShapeSize, pathsegs: PathShape_pathsegs, counts: number = 3) {
        super(id, name, type, transform, style, size, pathsegs)
        this.counts = counts
    }
}
/* rect shape */
export class RectShape extends PathShape {
    typeId = "rect-shape"
}
/* star shape */
export class StarShape extends PathShape {
    typeId = "star-shape"
    counts: number
    innerAngle: number
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, size: ShapeSize, pathsegs: PathShape_pathsegs, counts: number = 5, innerAngle: number = 0.382) {
        super(id, name, type, transform, style, size, pathsegs)
        this.counts = counts
        this.innerAngle = innerAngle
    }
}
/* connection */
export class Connection extends PathShape {
    typeId = "connection"
    isEdited: boolean
    from?: ContactForm
    to?: ContactForm
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, size: ShapeSize, pathsegs: PathShape_pathsegs, isEdited: boolean) {
        super(id, name, type, transform, style, size, pathsegs)
        this.isEdited = isEdited
    }
}
/* contact shape */
export class ContactShape extends PathShape {
    typeId = "contact-shape"
    isEdited: boolean
    text: Text
    mark: boolean
    from?: ContactForm
    to?: ContactForm
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, size: ShapeSize, pathsegs: PathShape_pathsegs, isEdited: boolean, text: Text, mark: boolean) {
        super(id, name, type, transform, style, size, pathsegs)
        this.isEdited = isEdited
        this.text = text
        this.mark = mark
    }
}
/* cutout shape */
export class CutoutShape extends PathShape {
    typeId = "cutout-shape"
}
/* image shape */
export class ImageShape extends PathShape {
    typeId = "image-shape"
    imageRef: string
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, size: ShapeSize, pathsegs: PathShape_pathsegs, imageRef: string) {
        super(id, name, type, transform, style, size, pathsegs)
        this.imageRef = imageRef
    }
}
/* line shape */
export class LineShape extends PathShape {
    typeId = "line-shape"
}
/* oval shape */
export class OvalShape extends PathShape {
    typeId = "oval-shape"
    ellipse: Ellipse
    startingAngle?: number
    endingAngle?: number
    innerRadius?: number
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, size: ShapeSize, pathsegs: PathShape_pathsegs, ellipse: Ellipse) {
        super(id, name, type, transform, style, size, pathsegs)
        this.ellipse = ellipse
    }
}
/* group shape */
export class GroupShape extends Shape {
    typeId = "group-shape"
    childs: GroupShape_childs
    fixedRadius?: number
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, childs: GroupShape_childs) {
        super(id, name, type, transform, style)
        this.childs = childs
    }
}
/* page */
export class Page extends GroupShape {
    typeId = "page"
    backgroundColor?: Color
    guides?: Page_guides
    connections?: Page_connections
}
/* symbol shape */
export class SymbolShape extends GroupShape {
    typeId = "symbol-shape"
    size: ShapeSize
    variables: Map<string, Variable>
    symtags?: Map<string, string>
    cornerRadius?: CornerRadius
    guides?: SymbolShape_guides
    autoLayout?: AutoLayout
    frameMaskDisabled?: boolean
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, childs: GroupShape_childs, size: ShapeSize, variables: Map<string, Variable>) {
        super(id, name, type, transform, style, childs)
        this.size = size
        this.variables = variables
    }
}
/* symbol union shape */
export class SymbolUnionShape extends SymbolShape {
    typeId = "symbol-union-shape"
}
/* artboard shape */
export class Artboard extends GroupShape {
    typeId = "artboard"
    size: ShapeSize
    cornerRadius?: CornerRadius
    guides?: Artboard_guides
    autoLayout?: AutoLayout
    frameMaskDisabled?: boolean
    constructor(id: string, name: string, type: ShapeType, transform: Transform, style: Style, childs: GroupShape_childs, size: ShapeSize) {
        super(id, name, type, transform, style, childs)
        this.size = size
    }
}
/* bool shape */
export class BoolShape extends GroupShape {
    typeId = "bool-shape"
}