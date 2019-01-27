const express = require('express');
const {Nuxt, Builder} = require('nuxt-edge');
const app = express();
const port = process.env.PORT || 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const HeadlessBrowser = require('./server/headlessBrowser/HeadlessBrowser');
const logger = require('./server/logger');

/** Nuxt */
let nuxtConfig = require('./nuxt.config');
nuxtConfig.dev = !(process.env.NODE_ENV === 'production');
const nuxt = new Nuxt(nuxtConfig);

if (nuxtConfig.dev) {
  const builder = new Builder(nuxt);
  builder.build();
}

app.use(nuxt.render);

server.listen(port, {perMessageDeflate: false});
logger.info(`Listening on port ${port}`);

/** Socket Connection */
io.on('connection', function(socket) {

  socket.id = Math.random().toString().substr(2, 16);
  logger.info(`${socket.id} connected`);

  let browser = null;

  socket.on('hallo', (data) => {
    socket.emit('hallo', `${data} back!`);
  });

  (async () => {
    socket.on('initBrowser', async (data) => {
      logger.info(`${data} client opened session`);
      browser = new HeadlessBrowser('Puppeteer', socket);
      await browser.connect();
      socket.emit('requestScreen', true);

      setInterval(async () => {
        let frame = await browser.requestScreenshot();

        socket.emit('data', {data: frame});

      }, 1000 / 30);
    });

    socket.on('windowSize', async (data) => {
      await browser.setWindowSize(data);
    });

    socket.on('changeWindowSize', async (data) => {
      await browser.changeViewport(data);
    });

    socket.on('click', async (data) => {
      await browser.mouseClick(data);
      //logger.info(`mouse click at ${data.x * scale}|${data.y * scale}`);
    });

    socket.on('keypress', async (data) => {
      await browser.keypress(data);
      logger.info(`key ${data} pressed`);
    });

    socket.on('scroll', async (data) => {
      await browser.scrollPage(data);
    });

    socket.on('uri', async (data) => {
      logger.info(`Redirecting to ${data}`);
      await browser.urlChange(data);
    });

    socket.on('navigation', async (data) => {
      await browser.navigation(data);
    });

    socket.on('disconnect', async () => {
      logger.info(`${socket.id} disconnected`);
      await browser.disconnect();
    });

  })();

});
