const GenericStrategy = require('./GenericStrategy');
const puppeteer = require('puppeteer');
const os = require('os');

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

class PuppeteerStrategy extends GenericStrategy {
  constructor(socket) {
    super();
    this.socket = socket;
    this.browser = null;
    this.page = null;
    this.mouse = null;
    this.keyboard = null;
  }

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
      this.socket.emit('urlChange', {url});
    });
  };

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

  changeViewport = async (data) => {
    await this.page.setViewport({
      width: data.w,
      height: data.h,
      hasTouch: false,
      isLandscape: false
    })
  };

  setWindowSize = async (data) => {
    width = data.w;
    height = data.h;
  };

  mouseClick = async (data) => {
    await this.mouse.click(Math.round(data.x * scale), Math.round(data.y * scale), {delay: 200});
  };

  keypress = async (data) => {
    await this.keyboard.press(data);
  };

  scrollPage = async (data) => {
    (data === 'down') ?
        await this.page.evaluate(() => {
          window.scrollBy(0, 10);
        }) :
        await this.page.evaluate(() => {
          window.scrollBy(0, -10);
        });
  };

  urlChange = async (data) => {
    await this.page.goto(data, {waitUntil: 'domcontentloaded'});
  };

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

  disconnect = async () => {
    await this.browser.close();
  };
}

module.exports = PuppeteerStrategy;
