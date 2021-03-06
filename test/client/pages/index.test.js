import { Nuxt, Builder } from 'nuxt-edge';
import { JSDOM } from 'jsdom';
import test from 'ava';
let nuxtConfig = require('./../../../nuxt.config');

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null;

// Init Nuxt.js and create a server listening on localhost:4000
test.before(async () => {
    nuxt = new Nuxt(nuxtConfig);
    await new Builder(nuxt).build();
    await nuxt.server.listen(4000, 'localhost');
}, 35000);

// Example of testing only generated html
test('Route / exits and render HTML', async (t) => {
    const context = {};
    const { html } = await nuxt.server.renderRoute('/', context);
    t.true(html.includes('<h2 class="ui teal header"><div class="content">CloudBrowser</div></h2>'))
});

// Example of testing via dom checking
test('Route / exits and render HTML with CSS applied', async (t) => {
    const context = {};
    const { html } = await nuxt.server.renderRoute('/', context);
    const { window } = new JSDOM(html).window;
    const element = window.document.querySelector('h2');
    t.not(element, null);
    t.is(element.textContent, 'CloudBrowser');
});

// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and nuxt.js', (t) => {
    nuxt.close()
});
