import { measure } from "./measure";
import { text2path } from "@kcdesign/text2path";
import { importRemote, TransactDataGuard, initModule as initData, IStorage } from '@kcdesign/data';

let __inited: boolean = false;

let _measure = measure;
let _text2path = text2path;

export function initModule(measure?: typeof _measure, text2path?: typeof _text2path) {
    // if (!measure || !text2path) throw new Error('measure or text2path is undefined')
    if (measure) _measure = measure;
    if (text2path) _text2path = text2path;
}

export async function initDataModule() {
    if (__inited) return;

    initData(_measure, _text2path)

    __inited = true;
}

type DocumentProps = { 
    source: 'storage',
    storage: IStorage,
    path: string,
    fid: string,
    versionId: string
}

async function _open(props: DocumentProps) {
    await initDataModule();
    if (props.source === 'storage') {
        const repo = new TransactDataGuard();
        const { document } = await importRemote(props.storage, props.path, props.fid, props.versionId, repo);
        return {data: document , repo};
    }

}

/**
 * 打开文档
 * @param props @see DocumentProps
 * @returns 
 */
export async function openDocument(props: DocumentProps) {
    return await _open(props);
}