# Cloud Browser <a href="https://ci.langl.eu/job/CloudBrowser/" target="_blank"><img src="https://ci.langl.eu/job/CloudBrowser/job/master/badge/icon"></a>

Cloud Browser which takes over the processing of webpages for older devices.

Made for the project AWT at TU-Berlin and Fraunhofer FOKUS.

## Getting Started
Documentation can be found [here](https://langleu.github.io/CloudBrowser/).

### Prerequisites

```
Node.js >= v8
```

### Installing

```
git clone https://github.com/Langleu/CloudBrowser
```

```
cd CloudBrowser
```

```
npm install
```

### Start

```
npm run dev
```
or
````
docker-compuse up
````

### Limitations

Current Limitations:

Running it on MacOS as server is currently limited to 6 fps same for Windows.
Linux has reached 20 fps in current tests.

Stick to screenshots as requested from our supervisor.

## ToDos

- [x] use SSR with React/Vue or Templating Engine
- [x] clean up code
- [x] use css framework
- [x] switch to winston
- [ ] pseudo accounts
    - [ ] sessions
- [ ] adjust puppeteer for better performance
- [ ] ...
