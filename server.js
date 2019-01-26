const express = require('express');
const {Nuxt, Builder} = require('nuxt-edge');
const app = express();
const port = process.env.PORT || 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const winston = require('winston');
const HeadlessBrowser = require('./server/headlessBrowser/HeadlessBrowser');

/** Winston  */
const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
    custom: 7,
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'yellow',
  },
};

winston.addColors(config.colors);

const logger = module.exports = winston.createLogger({
  levels: config.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
  level: 'custom',
});

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

  const browser = new HeadlessBrowser('Puppeteer', socket);

  socket.emit('requestScreen', true);

  (async () => {

    await browser.connect();

    socket.on('windowSize', async (data) => {
      await browser.setWindowSize(data);
    });

    setInterval(async () => {
      let frame = await browser.requestScreenshot();

      socket.emit('data', {data: frame});

    }, 1000 / 30);

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
