import { Browser, connect } from 'puppeteer';
import { openChrome } from './chrome';

let browser: Browser = undefined;

export const getBrowser = async () => {
    if (!browser) {
        browser = await connect({
            browserWSEndpoint: await openChrome(),
            defaultViewport: null
        });
    }

    return browser;
}
