"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openChrome = exports.chromeApp = void 0;
const open_1 = __importDefault(require("open"));
const child_process_1 = require("child_process");
const getUrlData = (count = 0) => {
    return new Promise((resolve) => {
        child_process_1.exec("curl http://localhost:9222/json/version", (error, stdout, stderr) => {
            console.log(error, stdout, stderr);
            if (error) {
                return resolve(getUrlData(++count));
            }
            resolve(JSON.parse(stdout));
        });
    });
};
exports.chromeApp = undefined;
const openChrome = async () => {
    // console.log('test')
    // let urlData = await getUrlData();
    // console.log(urlData);
    // console.log('testttt')
    if (!exports.chromeApp) {
        exports.chromeApp = await open_1.default("", {
            app: {
                name: open_1.default.apps.chrome,
                arguments: [
                    "--remote-debugging-port=9222",
                    "--no-first-run",
                    "--no-default-browser-check",
                    // '--user-data-dir=remote-profile'
                ],
            },
            newInstance: false,
        });
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    let urlData = await getUrlData();
    // console.log(urlData)
    return urlData.webSocketDebuggerUrl;
};
exports.openChrome = openChrome;
//# sourceMappingURL=chrome.js.map