import {
  GenericContainer,
  StartedTestContainer,
  TestContainer,
} from "testcontainers";

/**
 * Create and start a Docker container running Selenium Server (Chrome-based & standalone).
 * It will be available on `localhost:4444`.
 * @returns a handle to the Docker container, which can be used to dispose of it afterwards.
 */
export async function startSeleniumServer(): Promise<StartedTestContainer> {
  // Create a new Chrome-based Selenium Standalone container
  const container: TestContainer = new GenericContainer(
    "selenium/standalone-chrome:4.3.0-20220726"
  );

  // Start Selenium container on port 4444
  return await container
    .withExposedPorts({ container: 4444, host: 4444 })
    .start();
}
