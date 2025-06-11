/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { Page, Shape } from "@kcdesign/data";
import { DocumentNode } from "./copy";
import { convertIsLayerTrait } from "./IsLayerTrait";
import { convertCanvasNode } from "./CanvasNode";
import { Document } from "@kcdesign/data";

export function convertDocumentNode(document: Document): DocumentNode {
    return {
        ...convertIsLayerTrait(document as unknown as Shape),
        children: (document as unknown as { pages: Page[] }).pages.map(i => convertCanvasNode(i)),
        type: 'DOCUMENT'
    }
}