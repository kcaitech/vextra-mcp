
export type StyleId = `${string}_${string}` & { __brand: "StyleId" };
export type CSSRGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;
export type CSSHexColor = `#${string}`;
export interface ColorValue {
    hex: CSSHexColor;
    opacity: number;
}

export interface SimplifiedLayout {
    mode: "none" | "row" | "column";
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "baseline" | "stretch";
    alignItems?: "flex-start" | "flex-end" | "center" | "space-between" | "baseline" | "stretch";
    alignSelf?: "flex-start" | "flex-end" | "center" | "stretch";
    wrap?: boolean;
    gap?: string;
    locationRelativeToParent?: {
        x: number;
        y: number;
    };
    dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
    };
    padding?: string;
    sizing?: {
        horizontal?: "fixed" | "fill" | "hug";
        vertical?: "fixed" | "fill" | "hug";
    };
    overflowScroll?: ("x" | "y")[];
    position?: "absolute";
}
export type SimplifiedStroke = {
    colors: SimplifiedFill[];
    strokeWeight?: string;
    strokeDashes?: number[];
    strokeWeights?: string;
};
export type SimplifiedEffects = {
    boxShadow?: string;
    filter?: string;
    backdropFilter?: string;
    textShadow?: string;
};

export type TextStyle = Partial<{
    fontFamily: string;
    fontWeight: number;
    fontSize: number;
    lineHeight: string;
    letterSpacing: string;
    textCase: string;
    textAlignHorizontal: string;
    textAlignVertical: string;
}>;
export type StrokeWeights = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
type StyleTypes =
    | TextStyle
    | SimplifiedFill[]
    | SimplifiedLayout
    | SimplifiedStroke
    | SimplifiedEffects
    | string;
type GlobalVars = {
    styles: Record<StyleId, StyleTypes>;
};
export interface SimplifiedComponentDefinition {
    id: string;
    key: string;
    name: string;
    componentSetId?: string;
}

export interface SimplifiedComponentSetDefinition {
    id: string;
    key: string;
    name: string;
    description?: string;
}

export interface SimplifiedDesign {
    name: string;
    lastModified: string;
    thumbnailUrl: string;
    nodes: SimplifiedNode[];
    components: Record<string, SimplifiedComponentDefinition>;
    componentSets: Record<string, SimplifiedComponentSetDefinition>;
    globalVars: GlobalVars;
}

export type ComponentPropertyType = 'BOOLEAN' | 'INSTANCE_SWAP' | 'TEXT' | 'VARIANT'

export interface ComponentProperties {
    name: string;
    value: string;
    type: ComponentPropertyType;
}

export interface SimplifiedNode {
    id: string;
    name: string;
    type: string; // e.g. FRAME, TEXT, INSTANCE, RECTANGLE, etc.
    // geometry
    boundingBox?: BoundingBox;
    // text
    text?: string;
    textStyle?: string;
    // appearance
    fills?: string;
    styles?: string;
    strokes?: string;
    effects?: string;
    opacity?: number;
    borderRadius?: string;
    // layout & alignment
    layout?: string;
    // backgroundColor?: ColorValue; // Deprecated by Figma API
    // for rect-specific strokes, etc.
    componentId?: string;
    componentProperties?: ComponentProperties[];
    // children
    children?: SimplifiedNode[];
}

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Vector {
    x: number;
    y: number;
}

export type SimplifiedFill =
    | {
        type?: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'IMAGE';
        hex?: string;
        rgba?: string;
        opacity?: number;
        imageRef?: string;
        scaleMode?: string;
        gradientHandlePositions?: Vector[];
        gradientStops?: {
            position: number;
            color: ColorValue | string;
        }[];
    }
    | CSSRGBAColor
    | CSSHexColor;

