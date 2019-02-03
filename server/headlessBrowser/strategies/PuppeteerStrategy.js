const GenericStrategy = require('./GenericStrategy');
const puppeteer = require('puppeteer');
const os = require('os');
const HistoryService = require('./../../services/HistoryService');

/** Chrome Options */
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

/** MacOS adjustment due to fake screen size */
let scale = 1;
if (os.type() === 'Darwin')
  scale = 0.5;

let width = 1280;
let height = 800;

/**
 * @class
 * Implements the GenericStrategy and is the implementation of the Puppeteer API
 */
class PuppeteerStrategy extends GenericStrategy {
  /**
   * @constructor
   * @param socket, socket Object of the user.
   */
  constructor(socket) {
    super();
    this.socket = socket;
    this.browser = null;
    this.page = null;
    this.mouse = null;
    this.keyboard = null;
  }

  /**
   * @async
   * @returns {Promise<void>}
   * @description creates a new browser instance and assigns it to the constructor vars to be able to access it in other functions.
   * Further on it creates a new page and loads google.com.
   */
  connect = async () => {
    this.browser = await puppeteer.launch(options);
    this.page = await this.browser.newPage();
    this.mouse = this.page.mouse;
    this.keyboard = this.page.keyboard;
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await this.page.goto('https://google.com/', {waitUntil: 'domcontentloaded'});
    await this.page.setBypassCSP(true);

    await this.page.setViewport({
      width: width,
      height: height,
      hasTouch: false,
      isLandscape: false,
    });

    this.page.on('domcontentloaded', async () => {
      let url = await this.page.evaluate(() => {
        return window.location.href;
      });
      HistoryService.create({
        url,
        userId: this.socket.userId
      });
      this.socket.emit('urlChange', {url});
    });
  };

  /**
   * @async
   * @returns returns a buffer, which is the requested screenshot
   * @description requests a screenshot of the current page.
   */
  requestScreenshot = async () => {
    try {
      return await this.page.screenshot({
        type: 'jpeg',
        quality: 75
      });
    } catch(e) {
      //
    }
  };

  /**
   * @async
   * @param data, contains width and height value of the current browser page.
   * @returns {Promise<void>}
   * @description allows the user to set the viewport (actual size) of the page.
   */
  changeViewport = async (data) => {
    await this.page.setViewport({
      width: data.w,
      height: data.h,
      hasTouch: false,
      isLandscape: false
    })
  };

  /**
   * @async
   * @param data, contains width and height value of the current browser page.
   * @returns {Promise<void>}
   * @description sets the initial width and height of the to be created browser.
   */
  setWindowSize = async (data) => {
    width = data.w;
    height = data.h;
  };

  /**
   * @description emulates a mouse click (left).
   * @async
   * @param data, contains x and y value of where the user clicked.
   * @returns {Promise<void>}
   */
  mouseClick = async (data) => {
    await this.mouse.click(Math.round(data.x * scale), Math.round(data.y * scale), {delay: 200});
  };

  /**
   * @description emulates a keystroke.
   * @async
   * @param data, which is the key value.
   * @returns {Promise<void>}
   */
  keypress = async (data) => {
    await this.keyboard.press(data);
  };

  /**
   * @description emulates a scroll in either direction (Up/Down).
   * @async
   * @param data, which is either up or down.
   * @returns {Promise<void>}
   */
  scrollPage = async (data) => {
    (data === 'down') ?
        await this.page.evaluate(() => {
          window.scrollBy(0, 10);
        }) :
        await this.page.evaluate(() => {
          window.scrollBy(0, -10);
        });
  };

  /**
   * @description changes the url of the current page.
   * @async
   * @param data, requires a string which is the url.
   * @returns {Promise<void>}
   */
  urlChange = async (data) => {
    await this.page.goto(data, {waitUntil: 'domcontentloaded'});
  };

  /**
   * @description emulates either back, forward or refresh of the current page.
   * @async
   * @param data, string which is either back, forward or refresh.
   * @returns {Promise<void>}
   */
  navigation = async (data) => {
    switch (data) {
      case 'back':
        await this.page.goBack({waitUntil: 'domcontentloaded'});
        break;
      case 'forward':
        await this.page.goForward({waitUntil: 'domcontentloaded'});
        break;
      case 'refresh':
        await this.page.reload({waitUntil: 'domcontentloaded'});
        break;
      default:
        // nothing
    }
  };

  /**
   * @description closes the current browser.
   * @async
   * @returns {Promise<void>}
   */
  disconnect = async () => {
    await this.browser.close();
  };
}

module.exports = PuppeteerStrategy;
