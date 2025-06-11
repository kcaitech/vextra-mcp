/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

export class DataTransformHelper {
    static transform(t: { m00: number, m01: number, m10: number, m11: number, m12: number }) {
        return [[t.m00, t.m01, t.m11], [t.m10, t.m11, t.m12]];
    }

    static transform2root() {

    }
}