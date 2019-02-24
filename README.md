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

Ubuntu/Debian needs the following dependencies
```
sudo apt-get install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

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
docker-compose up
````

### Limitations

Current Limitations:

Running it on MacOS as server is currently limited to 6 fps same for Windows.
Linux has reached 25 fps in current tests. (solely based on the device resolution)

Stick to screenshots as requested from our supervisor.

## Benchmarks
### Diffs of images
We used several implementations to get the diff image of 2 initial images.
The Goal was to just send the diff of 2 images to save space.

We used [Resemble.js](https://github.com/rsmbl/Resemble.js) as it provided a good and simple module to get the pure difference of two images and not just an overlay.

Both initial supplied images were ~135kb and the output image was almost 6 times bigger (762kb).
This and the fact that it took 100-200ms to process the diff made it unusable for our project.

As we generate up to 30 images per second it would take an additional 3-6 seconds to calculate the difference of all images.

#### input images
![1](https://raw.githubusercontent.com/Langleu/CloudBrowser/master/test/server/imgdiff/a.jpg)
![2](https://raw.githubusercontent.com/Langleu/CloudBrowser/master/test/server/imgdiff/b.jpg)

#### outcome
![outcome](https://raw.githubusercontent.com/Langleu/CloudBrowser/master/test/server/imgdiff/output.jpg)

### Misc
Further results can be found in the project documentation.