"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowser = void 0;
const puppeteer_1 = require("puppeteer");
const chrome_1 = require("./chrome");
let browser = undefined;
const getBrowser = async () => {
    if (!browser) {
        browser = await puppeteer_1.connect({
            browserWSEndpoint: await chrome_1.openChrome(),
            defaultViewport: null
        });
    }
    return browser;
};
exports.getBrowser = getBrowser;
//# sourceMappingURL=puppetInstance.js.map