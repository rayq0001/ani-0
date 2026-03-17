const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`PAGE ERROR LOG: ${msg.text()}`);
        } else if (msg.type() === 'warning') {
            console.log(`PAGE WARNING LOG: ${msg.text()}`);
        }
    });

    page.on('pageerror', error => {
        console.log(`PAGE ERROR EXCEPTION: ${error.message} \n ${error.stack}`);
    });

    await page.goto('http://localhost:43210/space');
    console.log(`CURRENT URL: ${page.url()}`);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'space_screenshot.png' });
    console.log('SCREENSHOT SAVED');
    await browser.close();
})();
