const express = require('express');
const app = express();
const path = require('path');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const fs = require('fs');

//const Xvfb = require('xvfb');
//var xvfb = new Xvfb();

const puppeteer = require('puppeteer');

server.listen(8000);
console.log('Listening on port 8000');

app.use(express.static(path.join(__dirname, 'client')));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

/**
var options = {
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
} */

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
}

io.on('connection', function(socket) {

    socket.id = Math.random();
    console.log(`${socket.id} connected`);

    socket.emit('requestScreen', true);

    let frameNum = 0;

    (async() => {
        //xvfb.startSync();
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        const mouse = page.mouse;
        const keyboard = page.keyboard;

        //await page.goto('https://cookie.riimu.net/speed/');

        socket.on('windowSize', async function(data) {
            console.log(data);
            await page.setViewport({ width: data.w, height: data.h });
            console.log(`changing viewPort ${data}`);
        });

        //await page.goto('https://codepen.io/riskers/full/xpqPee/');
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

        await page._client.send('Emulation.clearDeviceMetricsOverride');
        await page.goto('https://google.com/', { waitUntil: 'networkidle2' });
        await page.setBypassCSP(true);

        await page.setViewport({
            width: 1280,
            height: 800,
            hasTouch: false,
            isLandscape: false
        });

        /**
        setInterval(async function() {
            let frame = await page.screenshot({
                path: `frame${String(frameNum).padStart(5, '0')}.jpg`,
                type: 'jpeg',
                quality: 20
            });

            socket.emit('news', { data: frame });

            */

        page.on('console', msg => {
            //console.log(msg.text());
            if (msg.text().includes('chunk')) {
                console.log('received chunk');
                socket.emit('news', { data: JSON.parse(msg.text()).chunk });
                //chunks.push(JSON.parse(msg.text()).chunk);
            }
            //console.log(msg.text());
        });


        //}, 1000 / 30);

        setInterval(async function() {
            await page.bringToFront();
        }, 1000);

        socket.on('click', async function(data) {
            await mouse.click(Math.round(data.x / 2), Math.round(data.y / 2), { delay: 200 });
            console.log(`mouse click at ${data}`);
        });

        socket.on('keypress', async function(data) {
            await keyboard.press(data);
            console.log(`key ${data} pressed`);
        });

        socket.on('scroll', async function(data) {
            if (data == 'down')
                await page.evaluate(_ => {
                    window.scrollBy(0, 10);
                });
            else
                await page.evaluate(_ => {
                    window.scrollBy(0, -10);
                });
        });

        socket.on('uri', async function(data) {
            console.log(`Redirecting to ${data}`);
            try {
                await page.goto(data);
            } catch (e) {
                console.error(e);
            }
        });

    })();

});