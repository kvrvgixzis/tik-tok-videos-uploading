const puppeteer = require('puppeteer');
const http = require('http');

async function startProfile() {
  const profileId = '0ff2b104-351b-4a24-bce8-a50129fd7776';
  const mlaPort = 35000;
  const mlaUrl = `http://127.0.0.1:${mlaPort}/api/v1/profile/start?automation=true&puppeteer=true&profileId=${profileId}`;

  http
    .get(mlaUrl, (resp) => {
      let data = '';

      //Receive response data by chunks
      resp.on('data', (chunk) => {
        data += chunk;
      });

      /*The whole response data has been received. Handling JSON Parse errors,
  verifying if ws is an object and contains the 'value' parameter.*/
      resp.on('end', () => {
        let ws;
        try {
          ws = JSON.parse(data);
          console.log('ws: ', ws);
        } catch (err) {
          console.log(err);
        }
        if (typeof ws === 'object' && ws.hasOwnProperty('value')) {
          console.log(`Browser websocket endpoint: ${ws.value}`);
          run(ws.value);
        }
      });
    })
    .on('error', (err) => {
      console.log(err.message);
    });
}

async function run(ws) {
  try {
    //Connecting Puppeteer with Mimic instance and performing simple automation.
    const browser = await puppeteer.connect({
      browserWSEndpoint: ws,
      defaultViewport: null,
      headless: false,
    });

    const page = await browser.newPage();
    console.log('page: ', page);
    // await page.setUserAgent(
    //   'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
    // );
    await page.goto('https://www.tiktok.com/upload/?lang=ru-RU');
    console.log('page opened');
    await browser.close();
  } catch (err) {
    console.log(err.message);
  }
}

startProfile();
