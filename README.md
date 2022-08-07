## About
This project is a simple Proof of Concept to assess how to download all scripts referenced by a given web page and then scan their contents checking for malicious code.

## Requirements
This projects depends on [TestContainers](https://github.com/testcontainers/testcontainers-node) (more about the original project [here](https://www.testcontainers.org/)) and, of course, on Docker as well. In order to execute the code, Docker service must be running. It's necessary for launching Selenium Standalone container (detail [here](https://github.com/SeleniumHQ/docker-selenium)).

## Running
- Before running the project, make sure Docker service is started.
- Install the dependencies:
```bash
npm i
```
- Set the web pages to be scanned at [main.ts](src/main.ts#L76).
- Finally run the code:
```bash
npm run start
```
- When it's finished, checkout the `output` folder, which is where the scripts will be saved. Also, take a look at the `screenshots` directory for inspecting if the web page was loaded successfully during the scan.