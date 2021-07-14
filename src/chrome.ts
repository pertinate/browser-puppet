import open from "open";
import { exec, ChildProcess } from "child_process";

interface ChromeApp {
  Browser: string;
  "Protocol-Version": string;
  "User-Agent": string;
  "V8-Version": string;
  "WebKit-Version": string;
  webSocketDebuggerUrl: string;
}

const getUrlData = (count = 0): Promise<ChromeApp> => {
  return new Promise((resolve) => {
    exec("curl http://localhost:9222/json/version", (error, stdout, stderr) => {
      console.log(error, stdout, stderr);
      if (error) {
        return resolve(getUrlData(++count));
      }
      resolve(JSON.parse(stdout));
    });
  });
};

export let chromeApp: ChildProcess = undefined;

export const openChrome = async (): Promise<string> => {
  // console.log('test')
  // let urlData = await getUrlData();
  // console.log(urlData);
  // console.log('testttt')
  if (!chromeApp) {
    chromeApp = await open("", {
      app: {
        name: open.apps.chrome,
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
