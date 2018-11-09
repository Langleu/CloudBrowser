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

### Limitations

Current Limitaitons:
Macs are currently limited to 6 fps, ubuntu should be able to achieve up to 25 fps.
Solution: Switch over to MediaRecorder API

## ToDos

- [ ] switch to MediaRecorder API with Xvfb
- [ ] use SSR with React/Vue or Templating Engine
- [ ] clean up code
- [ ] use css framework
- [ ] switch to winston
- [ ] ...