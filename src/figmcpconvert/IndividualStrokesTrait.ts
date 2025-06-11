/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { IndividualStrokesTrait, StrokeWeights } from "./copy";
import { Shape, SideType } from "@kcdesign/data";

export function convertIndividualStrokesTrait(shape: Shape): IndividualStrokesTrait {
    let individualStrokeWeights: StrokeWeights | undefined;
    if (shape.style.borders.sideSetting.sideType !== SideType.Normal) {
        individualStrokeWeights = {
            left: shape.style.borders.sideSetting.thicknessLeft,
            top: shape.style.borders.sideSetting.thicknessTop,
            right: shape.style.borders.sideSetting.thicknessRight,
            bottom: shape.style.borders.sideSetting.thicknessBottom,
        }
    }
    return { individualStrokeWeights };
}