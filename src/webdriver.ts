import { writeFileSync, mkdirSync } from "fs";
import { Browser, Builder, Condition, WebDriver } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome.js";

/**
 * Create a Selenium WebDriver necessary for navigating to and interacting with web pages.
 * @returns the WebDriver.
 */
 export async function createWebDriver(): Promise<WebDriver> {
    const opts: ChromeOptions = new ChromeOptions().addArguments(
      "--no-sandbox",
      "--disable-infobars",
      "--disable-dev-shm-usage",
      "--disable-browser-side-navigation",
      "--disable-gpu",
      "--disable-features=VizDisplayCompositor"
    );
    return await new Builder()
      .usingServer("http://localhost:4444/wd/hub")
      .forBrowser(Browser.CHROME)
      .setChromeOptions(opts)
      .build();
  }
  
  /**
   * Selenium WebDriver Condition to check for DOM's document `readyState` event.
   * Unfortunatelly it does not guarantee all scripts will be loaded by then.
   * @returns a boolean Condition to be used by the WebDriver.
   */
  export function untilDocumentReady(): Condition<boolean> {
    return new Condition("wait document to be ready", async (driver) => {
      let state = (
        await driver.executeScript("return document.readyState")
      ).toString();
      return state === "complete";
    });
  }
  
  /**
   * Apply delay of a given number of miliseconds.
   */
  export async function untilDelay(t: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, t));
  }
  
  /**
   * Take a screenshot of the current web page being rendered by `driver`.
   * @param driver Selenium WebDriver
   */
  export async function takeScreenshot(driver: WebDriver): Promise<void> {
    const screenShot: string = await driver.takeScreenshot();
    const buff: Buffer = Buffer.from(screenShot, "base64");
    mkdirSync("screenshots", { recursive: true });
    writeFileSync(`screenshots/screenshot_${new Date().toISOString()}.png`, buff);
  }