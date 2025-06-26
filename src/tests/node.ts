import { VextraService } from "@/data/vextra";

const fileKey = "file://Users/zhangruiqiang/dev/kcdesign-editor/samples/Ant.Design.home-3.0.sketch"
const pageId = '1459CE9A-B502-4C72-8EF0-CFDBB4DAA819'
const nodeId = '695A2BF2-CCCF-4B06-B672-8010031D4A92'
const depth = 3;

const vextraService = new VextraService(process.env.VESTRA_OAUTH_TOKEN || "");

vextraService.getNode(fileKey, pageId, nodeId, depth).then(node => {
    console.log(node);
})