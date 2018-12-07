const express = require('express');
const { Nuxt, Builder } = require('nuxt-edge');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const winston = require('winston');

// Winston
const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'grey',
        info: 'green',
        verbose: 'cyan',
        silly: 'magenta',
        custom: 'yellow'
    }
};

winston.addColors(config.colors);

const logger = module.exports = winston.createLogger({
    levels: config.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ],
    level: 'custom'
});

// Nuxt
let nuxtConfig = require('./nuxt.config');
nuxtConfig.dev = !(process.env.NODE_ENV === 'production')
const nuxt = new Nuxt(nuxtConfig);

if (nuxtConfig.dev) {
    const builder = new Builder(nuxt);
    builder.build();
}

app.use(nuxt.render);


//const Xvfb = require('xvfb');
//var xvfb = new Xvfb();


server.listen(port, { perMessageDeflate: false });
logger.info(`Listening on port ${port}`);

/**
app.use(express.static(path.join(__dirname, 'client')));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
 */

let options = {
    headless: true,
    args: [
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        '--window-size=1280,800'
    ],
    ignoreHTTPSErrors: true,
    dumpio: false
}

/**
var options = {
    headless: false,
    args: [
        '--enable-usermedia-screen-capturing',
        '--allow-http-screen-capture',
        '--auto-select-desktop-capture-source=puppetcam',
        '--load-extension=' + __dirname + '/plugins',
        '--disable-extensions-except=' + __dirname + '/plugins',
        '--disable-infobars',
        `--window-size=1280,800`,
        '--no-sandbox'
    ],
    //executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
}
 */

io.on('connection', function(socket) {

    socket.id = Math.random();
    logger.info(`${socket.id} connected`);

    socket.emit('requestScreen', true);

    let frameNum = 0;

    (async() => {
        //xvfb.startSync();
        let width = 1280;
        let height = 800;

        socket.on('windowSize', async(data) => {
            logger.info(data);
            //await page.setViewport({ width: data.w, height: data.h });
            width = data.w;
            height = data.h;
            logger.info(`changing viewPort ${data}`);
        });

        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        const mouse = page.mouse;
        const keyboard = page.keyboard;

        //await page.goto('https://cookie.riimu.net/speed/');

        //await page.goto('https://codepen.io/riskers/full/xpqPee/');
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

        //await page._client.send('Emulation.clearDeviceMetricsOverride');
        await page.goto('https://google.com/', { waitUntil: 'domcontentloaded' });
        await page.setBypassCSP(true);

        await page.setViewport({
            width: width,
            height: height,
            hasTouch: false,
            isLandscape: false
        });

        /**
        page.on('console', msg => {
            //console.log(msg.text());
            if (msg.text().includes('chunk')) {
                console.log('received chunk');
                socketServer.broadcast(str2ab(JSON.parse(msg.text()).chunk));
                socket.emit('news', { data: JSON.parse(msg.text()).chunk });
                //chunks.push(JSON.parse(msg.text()).chunk);
            }
            //console.log(msg.text());
        });
        setInterval(async function() {
            await page.bringToFront();
        }, 1000);
 */

        setInterval(async() => {
            let frame = null;
            try {
                frame = await page.screenshot({
                    type: 'jpeg',
                    quality: 80
                });
            } catch (e) {

            }

            socket.emit('data', { data: frame });

        }, 1000 / 30);

        page.on('domcontentloaded', async() => {
            let url = await page.evaluate(_ => {
                return window.location.href;
            });
            socket.emit('urlChange', { url });
        });

        socket.on('changeWindowSize', async(data) => {
            logger.info(data);
            await page.setViewport({
                width: data.w,
                height: data.h,
                hasTouch: false,
                isLandscape: false
            });
        });

        socket.on('click', async function(data) {
            await mouse.click(Math.round(data.x), Math.round(data.y), { delay: 200 });
            logger.info(`mouse click at ${data.x}|${data.y}`);
        });

        socket.on('keypress', async function(data) {
            await keyboard.press(data);
            logger.info(`key ${data} pressed`);
        });

        socket.on('scroll', async function(data) {
            if (data == 'down')
                await page.evaluate(_ => {
                    window.scrollBy(0, 25);
                });
            else
                await page.evaluate(_ => {
                    window.scrollBy(0, -25);
                });
        });

        socket.on('uri', async function(data) {
            logger.info(`Redirecting to ${data}`);
            try {
                await page.goto(data, { waitUntil: 'domcontentloaded' });
            } catch (e) {
                logger.error(e);
            }
        });

        socket.on('disconnect', async function() {
            logger.info(`${socket.id} disconnected`);
            await browser.close();
            //xvfb.stopSync();
        });

    })();

});

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}