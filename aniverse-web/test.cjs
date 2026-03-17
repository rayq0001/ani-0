const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
      if (msg.type() === 'error') {
          console.log('PAGE ERROR LOG:', msg.text());
      } else if (msg.type() === 'warning') {
          console.log('PAGE WARNING LOG:', msg.text());
      }
  });

  page.on('pageerror', error => {
      console.log('PAGE ERROR EXCEPTION:', error.message, '\n', error.stack);
  });
  
  await page.goto('http://localhost:43210/space');
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
