const PuppeteerStrategy = require('./strategies/PuppeteerStrategy');

/**
 * @class
 * actual Strategy for the headless browser.
 * For further implementation and explanation, please look at PuppeteerStrategy.
 */
class HeadlessBrowser {
    /**
     * @constructor
     * @param type
     * @param socket
     */
    constructor(type, socket) {
        switch (type) {
            case "Puppeteer":
                this.strategy = new PuppeteerStrategy(socket);
                break;
            default:
                this.strategy = new PuppeteerStrategy(socket);
        }
    }

    /**
     * @async
     * @returns {Promise<void>}
     */
    connect = async () => {
        await this.strategy.connect();
    };

    /**
     * @async
     * @returns {Promise<void>}
     */
    requestScreenshot = async () => {
        return await this.strategy.requestScreenshot();
    };

    /**
     * @async
     * @returns {Promise<void>}
     * @param data
     */
    changeViewport = async (data) => {
        await this.strategy.changeViewport(data);
    };

    /**
     * @async
     * @returns {Promise<void>
     * @param data
     */
    setWindowSize = async (data) => {
        await this.strategy.setWindowSize(data);
    };

    /**
     * @async
     * @returns {Promise<void>}
     * @param data
     */
    mouseClick = async (data) => {
        await this.strategy.mouseClick(data);
    };

    /**
     * @async
     * @returns {Promise<void>}
     * @param data
     */
    keypress = async (data) => {
        await this.strategy.keypress(data);
    };

    /**
     * @async
     * @returns {Promise<void>}
     * @param data
     */
    scrollPage = async (data) => {
        await this.strategy.scrollPage(data);
    };

    /**
     * @async
     * @returns {Promise<void>}
     * @param data
     */
    urlChange = async (data) => {
        await this.strategy.urlChange(data);
    };

    /**
     * @async
     * @returns {Promise<void>}
     * @param data
     */
    navigation = async (data) => {
        await this.strategy.navigation(data);
    };

    /**
     * @async
     * @returns {Promise<void>}
     */
    disconnect = async () => {
        await this.strategy.disconnect();
    };
}

module.exports = HeadlessBrowser;
