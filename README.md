## About
This project is a simple Proof of Concept to assess how to download all scripts referenced by a given web page and then scan their contents checking for malicious code.

## Requirements
It depends on [TestContainers](https://github.com/testcontainers/testcontainers-node) (more about the original project [here](https://www.testcontainers.org/)) and, of course, on Docker as well. In order to execute the code, Docker service must be running. It's necessary for launching Selenium Standalone container (detail [here](https://github.com/SeleniumHQ/docker-selenium)).

## Running
- Before running the project, make sure Docker service is started.
- Install the dependencies:
```bash
npm i
```
- Finally run the code, passing the web page's URL as argument like this:
```bash
npm run start -- http://www.google.com
```
- When it's finished, checkout the `output` folder, which is where the scripts will be saved. Also, take a look at the `screenshots` directory to confirm if web pages were loaded successfully during the scraping.
- From here on, it's possible to inspect the files manually or using [Yara](https://yara.readthedocs.io/en/stable).
- To do that create new rules following the sample file provided in [yara_rules/google.yara](yara_rules/google.yara).
- Yara can be installed locally using [Brew](https://brew.sh/) (see [here](https://yara.readthedocs.io/en/stable/gettingstarted.html#compiling-and-installing-yara) for other options):
```bash
brew install yara
```
- Alternatively, there's also a Dockerfile to provide an easier way:
```bash
# build the image
docker build --target yara . -f docker/yara.dockerfile -t yara
```
- Finally, scan the files using it:
```bash
# when using Docker image, first create a container
docker run --rm -it -v $(pwd)/yara_rules:/rules -v $(pwd)/output:/files yara

# then run Yara
yara -m yara_rules/*.yara -r output
```

## Further work
From this point on, the idea is to research ways for actually detecting malicious code. Below is a list of interesting approaches.

### Static Analysis
- https://github.com/VirusTotal/yara
- https://yara.readthedocs.io/en/stable

### ML Analysis
- https://towardsai.net/p/l/detect-malicious-javascript-code-using-machine-learning