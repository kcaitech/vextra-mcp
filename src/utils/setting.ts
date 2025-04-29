// const currentUrl = new URL(window.location.href);

// // 开发可以自己改后端地址
// let protocol = currentUrl.protocol
// let isSsl = protocol.startsWith("https")
// let hostname = currentUrl.hostname
// let port = currentUrl.port

// export const BASE_URL = protocol + "//" + hostname + ':' + port;
// export const API_URL = BASE_URL + '/api'
// export const COMMUNICATION_URL = (isSsl ? 'wss://' : "ws://") + hostname + ":" + port + '/api/ws'

export const COMMUNICATION_URL = "ws://localhost:80/api/ws"
