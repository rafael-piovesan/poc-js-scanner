import fetch from "node-fetch";
import { StartedTestContainer } from "testcontainers";
import { By, WebDriver, WebElement } from "selenium-webdriver";
import { startSeleniumServer } from "./testcontainer.js";
import { createWebDriver, takeScreenshot, untilDelay } from "./webdriver.js";
import { deobfuscateScript } from "./deobfuscator.js";
import { logger } from "./logger.js";

const webpageLoadDelay =
  Number.parseInt(process.env.WEBPAGE_LOAD_DELAY_MS) || 15 * 1000;

async function scan(webpages: Array<string>) {
  let seleniumServer: StartedTestContainer;
  let driver: WebDriver;

  try {
    seleniumServer = await startSeleniumServer();
    driver = await createWebDriver();

    while (webpages.length > 0) {
      // dequeue a new URL to be scanned
      const webpage: string = webpages.splice(0, 1)?.[0];
      if (!webpage) break;

      // navigate to web page
      const webpageURL: URL = new URL(webpage);
      await driver.get(webpageURL.href);

      // wait a couple seconds, so all the sripts will be loaded
      logger.info("waiting for web page at %s to load", webpageURL.href);
      await driver.wait(untilDelay(webpageLoadDelay));

      // take a screenshot, so we can visually inspect the web page being scanned
      await takeScreenshot(driver);

      // enqueue all iframes to be scanned as well
      const iframes: WebElement[] = await driver.findElements(By.css("iframe"));
      iframes.forEach(async (i) => {
        const src = await i.getAttribute("src");
        if (src) webpages.push(src);
      });

      const scripts: WebElement[] = await driver.findElements(By.css("script"));

      for (const idx in scripts) {
        let innerHTML: string = await scripts[idx].getAttribute("innerHTML");
        const src: string = (await scripts[idx].getAttribute("src")).trim();
        const srcURL: URL = src ? new URL(src) : webpageURL;
        let fileName = `${idx}_inline`;

        // check for external script, i.e., `src` attribute is not empty
        if (src) {
          const response = await fetch(src);
          innerHTML = await response.text();
          fileName = srcURL.pathname
            .split("/")
            .pop()
            .replace(new RegExp(".js$"), "");
        }

        deobfuscateScript({
          script: innerHTML,
          hostname: srcURL.hostname,
          filename: fileName,
          webpage: webpageURL.hostname,
        });
      }
    }
  } catch (e) {
    logger.error(e);
  } finally {
    await driver?.quit();
    await seleniumServer?.stop();
  }
}

function main() {
  // default list of web pages to scan
  let sitesToScan: Array<string> = ["https://www.google.com"];

  // check for values passed as arguments
  const args = process.argv.slice(2);
  if (args.length) {
    sitesToScan = args
  }

  scan(sitesToScan);
}

main();
