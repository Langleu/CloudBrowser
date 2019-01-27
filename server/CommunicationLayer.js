const HeadlessBrowser = require('./headlessBrowser/HeadlessBrowser');
const logger = require('./Logger');

class CommunicationLayer {
    constructor(socket) {
        this.socket = socket;

        this.browser = null;
        this.screenshotId = null;
        this.fpsId = null;
    }

    startListener = async () => {
        this.socket.on('hallo', (data) => {
            this.socket.emit('hallo', `${data} back!`);
        });

        this.socket.on('initBrowser', async (data) => {
            logger.info(`${data} client opened session`);
            this.browser = new HeadlessBrowser('Puppeteer', this.socket);
            await this.browser.connect();
            this.socket.emit('requestScreen', true);

            let i = 0;

            this.screenshotId = setInterval(async () => {
                let frame = await this.browser.requestScreenshot();
                i++;
                this.socket.emit('data', {data: frame});

            }, 1000 / 30);

            this.fpsId = setInterval(() => {
                logger.info(`Current fps is ${i}`);
                i = 0;
            }, 1000);
        });

        this.socket.on('windowSize', async (data) => {
            await this.browser.setWindowSize(data);
        });

        this.socket.on('changeWindowSize', async (data) => {
            await this.browser.changeViewport(data);
        });

        this.socket.on('click', async (data) => {
            await this.browser.mouseClick(data);
            //logger.info(`mouse click at ${data.x * scale}|${data.y * scale}`);
        });

        this.socket.on('keypress', async (data) => {
            await this.browser.keypress(data);
            logger.info(`key ${data} pressed`);
        });

        this.socket.on('scroll', async (data) => {
            await this.browser.scrollPage(data);
        });

        this.socket.on('uri', async (data) => {
            logger.info(`Redirecting to ${data}`);
            await this.browser.urlChange(data);
        });

        this.socket.on('navigation', async (data) => {
            await this.browser.navigation(data);
        });

        this.socket.on('disconnectBrowser', async () => {
            clearInterval(this.screenshotId);
            clearInterval(this.fpsId);
            await this.browser.disconnect();
        });

        this.socket.on('disconnect', async () => {
            logger.info(`${this.socket.id} disconnected`);
            try {
                await this.browser.disconnect();
                clearInterval(this.screenshotId);
                clearInterval(this.fpsId);
            } catch (e) {
                //
            }
        });
    }

}

module.exports = CommunicationLayer;
