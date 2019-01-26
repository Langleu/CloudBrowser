const PuppeteerStrategy = require('./strategies/PuppeteerStrategy');

class HeadlessBrowser {
    constructor(type, socket) {
        switch (type) {
            case "Puppeteer":
                this.strategy = new PuppeteerStrategy(socket);
                break;
            default:
                this.strategy = new PuppeteerStrategy(socket);
        }
    }

    connect = async () => {
        await this.strategy.connect();
    };

    requestScreenshot = async () => {
        return await this.strategy.requestScreenshot();
    };

    changeViewport = async (data) => {
        await this.strategy.changeViewport(data);
    };

    setWindowSize = async (data) => {
        await this.strategy.setWindowSize(data);
    };

    mouseClick = async (data) => {
        await this.strategy.mouseClick(data);
    };

    keypress = async (data) => {
        await this.strategy.keypress(data);
    };

    scrollPage = async (data) => {
        await this.strategy.scrollPage(data);
    };

    urlChange = async (data) => {
        await this.strategy.urlChange(data);
    };

    navigation = async (data) => {
        await this.strategy.navigation(data);
    };

    disconnect = async () => {
        await this.strategy.disconnect();
    };
}

module.exports = HeadlessBrowser;
