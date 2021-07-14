import puppeteer from "puppeteer";
import { exec } from "child_process";
import { openChrome, chromeApp } from "./chrome";
import { getBrowser } from "./puppetInstance";

const getCurrentPage = async (
  pages: puppeteer.Page[],
  timeout: number = 100000
): Promise<puppeteer.Page> => {
  var start = new Date().getTime();
  while (new Date().getTime() - start < timeout) {
    var arr = [];
    for (const p of pages) {
      if (
        await p.evaluate(() => {
          return document.visibilityState == "visible";
        })
      ) {
        arr.push(p);
      }
    }
    if (arr.length == 1) return arr[0];
  }
  throw "Unable to get active page";
};

const moveAndClick = async (page: puppeteer.Page, x: number, y: number) => {
  console.log("test");
  await page.evaluate(() => {
    window.scrollBy(0, -document.documentElement.scrollHeight);
  });

  const offsetHeight = await page.evaluate((y) => {
    if (y - window.innerHeight / 2 > 0) {
      window.scrollBy(0, y - window.innerHeight / 2);
      return y - window.innerHeight / 2;
    }
    return 0;
  }, y);

  console.log(x, y, offsetHeight);

  await page.mouse.move(x, y - offsetHeight);
  await page.mouse.click(x, y - offsetHeight, { delay: 1000 });
  // const maxPageHeight = await page.evaluate(() => document.documentElement.scrollHeight);

  // setInterval(async () => console.log(await page.evaluate(() => document.documentElement.height)), 1000)

  // await page.mouse.move(225, 1000);
  // await new Promise((resolve) => setTimeout(resolve, 5000))
  // await page.mouse.click(225, 1000);
};
// /usr/bin/google-chrome-stable --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=remote-profile

setTimeout(async () => {
  setInterval(() => {}, 1000);
  const browser = await getBrowser();

  const pageNames = await Promise.all(
    (await browser.pages()).map((element) => element.title())
  );

  const currentPage = await getCurrentPage(await browser.pages());

  await currentPage.goto("https://google.com");

  // await moveAndClick(currentPage, 195, 765);
  try {
    // await moveAndClick(page, 225, 100);
    // page.mouse.wheel({deltaY: 500})
    // const hulu = await browser.newPage();
    // await hulu.goto('https://www.hulu.com/', {
    //     waitUntil: 'networkidle2'
    // });
    // await hulu.screenshot({
    //     path: './screenshot.png',
    //     captureBeyondViewport: true,
    //     fullPage: true
    // })
    // setInterval(async () => {
    //     console.log(await Promise.all((await browser.pages()).map(entry => {
    //         return entry.title()
    //     })))
    // }, 1000)
  } catch (ex) {
    console.error(ex);
  }
}, 2000);

async function exitHandler(evtOrExitCodeOrError: number | string | Error) {
  try {
    chromeApp.kill();
  } catch (e) {
    console.error("EXIT HANDLER ERROR", e);
  }

  process.exit(isNaN(+evtOrExitCodeOrError) ? 1 : +evtOrExitCodeOrError);
}

[
  "beforeExit",
  "uncaughtException",
  "unhandledRejection",
  "SIGHUP",
  "SIGINT",
  "SIGQUIT",
  "SIGILL",
  "SIGTRAP",
  "SIGABRT",
  "SIGBUS",
  "SIGFPE",
  "SIGUSR1",
  "SIGSEGV",
  "SIGUSR2",
  "SIGTERM",
].forEach((evt) => process.on(evt, exitHandler));

// process.on('SIGINT', handleExit);
// process.on('SIGQUIT', handleExit);
// process.on('SIGTERM', handleExit);

// console.log(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share"))
// console.log(process.platform === 'linux')
