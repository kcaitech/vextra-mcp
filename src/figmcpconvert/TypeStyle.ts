/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { TextShape } from "@kcdesign/data";
import { TypeStyle } from "./copy";

export function convertTypeStyle(shape: TextShape): TypeStyle {
    // todo fill text traits
    return {
        fontFamily: shape.text.attr?.fontName,
        fontPostScriptName: shape.text.attr?.fontName,
        paragraphSpacing: shape.text.attr?.paraSpacing,
        paragraphIndent: shape.text.attr?.indent,
        italic: shape.text.attr?.italic,
        fontWeight: shape.text.attr?.weight,
        fontSize: shape.text.attr?.fontSize,
        letterSpacing: shape.text.attr?.kerning
    }
}