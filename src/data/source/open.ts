/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { IO, TransactDataGuard, Document, Creator, DocEditor, Repo } from "@kcaitech/vextra-core";
import { initDataModule } from "./init";
import { SupportedFormatsType } from "./consts";


export async function openLocalDocument(file: string, fmt: SupportedFormatsType) {
    await initDataModule();

    const repo = new TransactDataGuard();
    let data: Document | undefined;

    if (fmt === 'sketch') {
        data = await IO.importSketch(file, repo);
    } else if (fmt === 'fig') {
        data = await IO.importFigma(file, repo)
    } else if (fmt === 'vext') {
        data = await IO.importVext(file, repo);
    } else if (fmt === 'svg') {
        data = await IO.importSvg(file, repo);
    }

    return data;
}

export type DocumentProps = (
    { source: 'storage', storage: IO.IStorage, path: string, fid: string, versionId: string } |
    { source: 'file', file: File | string, fmt: SupportedFormatsType } |
    { source: 'new' })

async function _open(props: DocumentProps, repoCreator: (data: Document, guard: TransactDataGuard) => Repo.IRepository) {
    await initDataModule();

    const repo = new TransactDataGuard();
    let cooprepo: Repo.IRepository | undefined;
    let data: Document | undefined;
    if (props.source === 'storage') {
        const { document } = await IO.importRemote(props.storage, props.path, props.fid, props.versionId, repo);
        data = document
        cooprepo = repoCreator(data, repo)
    } else if (props.source === 'file') {
        if (props.fmt === 'sketch') {
            data = await IO.importSketch(props.file, repo);
            cooprepo = repoCreator(data, repo)
        } else if (props.fmt === 'fig') {
            data = await IO.importFigma(props.file, repo)
            cooprepo = repoCreator(data, repo)
        } else if (props.fmt === 'vext') {
            data = await IO.importVext(props.file, repo);
            cooprepo = repoCreator(data, repo)
        } else if (props.fmt === 'svg') {
            data = await IO.importSvg(props.file, repo);
            cooprepo = repoCreator(data, repo)
        }
    } else if (props.source === 'new') {
        data = Creator.newDocument('New Document', repo);
        cooprepo = repoCreator(data, repo)
        cooprepo.startInitData();
        const editor = new DocEditor(data, cooprepo);
        const page = editor.create('Page 1');
        editor.insert(0, page);
        cooprepo.endInitData();
    }

    if (data) {
        return { data, cooprepo: cooprepo! }
    }
}

/**
 * 打开文档
 * @param props @see DocumentProps
 * @returns 
 */
export async function openDocument(props: DocumentProps, repoCreator: (data: Document, guard: TransactDataGuard) => Repo.IRepository) {
    return await _open(props, repoCreator);
}