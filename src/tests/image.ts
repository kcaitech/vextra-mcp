
import { VextraService } from "@/data/vextra";

// const fileKey = "file://Users/zhangruiqiang/dev/kcdesign-editor/samples/Ant.Design.home-3.0.sketch"
// const pageId = '1459CE9A-B502-4C72-8EF0-CFDBB4DAA819'
const fileKey = "file://Users/zhangruiqiang/dev/kcdesign-editor/samples/simple.vext"
const pageId = "dfbbc3fa-9e6a-4c76-b875-540605cf8782"
const nodeId = "92a4307d-9cb7-485c-9630-d1302df10755"

const vextraService = new VextraService(process.env.VESTRA_OAUTH_TOKEN || "");

vextraService.getImages(fileKey, [{
    pageId,
    nodeId: pageId,
    fileName: 'Page1.png',
    fileType: 'png'

}], "/Users/zhangruiqiang/dev/mcp-file-server/src/tests/", 1, {
    outlineText: true,
    includeId: true,
    simplifyStroke: true
}).then(images => {
    console.log(images);
})


