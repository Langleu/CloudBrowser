# Cloud Browser

Cloud Browser which takes over the processing of webpages for older devices.

Made for the project AWT at TU-Berlin and Fraunhofer FOKUS.

## Getting Started

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

Solution: Switch over to MediaRecorder API

## ToDos

- [ ] switch to MediaRecorder API with Xvfb
- [x] use SSR with React/Vue or Templating Engine
- [ ] clean up code
- [x] use css framework
- [x] switch to winston
- [ ] pseudo accounts
    - [ ] sessions
- [ ] adjust puppeteer for better performance
- [ ] ...
