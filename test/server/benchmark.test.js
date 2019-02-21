import test from 'ava';

const puppeteer = require('puppeteer');
const compareImages = require('resemblejs/compareImages');

const options = {
    headless: true,
    args: [
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        '--window-size=1280,800',
        '--no-sandbox',
        '--disable-infobars',
    ],
    ignoreHTTPSErrors: true,
    dumpio: false,
};

const resolutions = [
    {
        name: "4k",
        w: 3840,
        h: 2160
    },
    {
        name: "1080p",
        w: 1920,
        h: 1080
    },
    {
        name: "720p",
        w: 1280,
        h: 720
    },
    {
        name: "480p",
        w: 720,
        h: 576
    }
];

let results = [];
let diffImage = 0;

const runBenchmark = async (quality) => {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto('https://google.com/', {waitUntil: 'domcontentloaded'});
    await page.setBypassCSP(true);

    for (let i = 0; i < resolutions.length; i++) {
        await page.setViewport({
            width: resolutions[i].w,
            height: resolutions[i].h,
            hasTouch: false,
            isLandscape: false,
        });

        let startTime = Date.now();
        for (let j = 0; j < 30; j++) {
            await page.screenshot({
                type: 'jpeg',
                quality: quality
            });
        }
        let endTime = Date.now();

        let diffTime = endTime - startTime;

        results.push({
            name: resolutions[i].name,
            time: diffTime,
            quality: quality
        });
    }
};

const checkLatency = async () => {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto('https://codepen.io/nfxpnk/full/vERyxK', {waitUntil: 'domcontentloaded'});
    await page.setBypassCSP(true);

    let a = await page.screenshot({ type: 'jpeg', quality: 100});

    let startTime = Date.now();
    await page.mouse.click(200,200);

    let endTime = Date.now();
    let diffTime = endTime - startTime;

    let b = await page.screenshot({ type: 'jpeg', quality: 100});

    const imgOptions = {
        output: {
            errorType: "diffOnly",
            useCrossOrigin: false,
            outputDiff: false
        },
        scaleToSameSize: false,
        ignore: "nothing"
    };

    const data = await compareImages(
        a,
        b,
        imgOptions
    );

    diffImage = data.misMatchPercentage;
    console.log(`It took ${diffTime} ms to click and the diff of the two occurred frames is ${data.misMatchPercentage}`);
};

test('Run benchmark', async (t) => {
    await runBenchmark(0);
    await runBenchmark(25);
    await runBenchmark(50);
    await runBenchmark(75);
    await runBenchmark(100);

    console.log(results);
    t.not(results, null);
});

test('Check Latency', async (t) => {
   await checkLatency();
   t.not(diffImage, 0);
});