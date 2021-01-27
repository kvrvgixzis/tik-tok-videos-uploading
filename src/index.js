const puppeteer = require('puppeteer');
const http = require('http');

const startProfile = async () => {
  const profileId = '0ff2b104-351b-4a24-bce8-a50129fd7776';
  const mlaPort = 35000;
  const mlaUrl = `http://127.0.0.1:${mlaPort}/api/v1/profile/start?automation=true&puppeteer=true&profileId=${profileId}`;

  http
    .get(mlaUrl, (resp) => {
      let data = '';

      // Receive response data by chunks
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response data has been received.
      // Handling JSON Parse errors, verifying if ws
      // is an object and contains the 'value' parameter.
      resp.on('end', () => {
        let ws;
        try {
          ws = JSON.parse(data);
          console.log('ws: ', ws);
        } catch (err) {
          console.log(err);
        }
        if (typeof ws === 'object' && ws.hasOwnProperty('value')) {
          console.log(`Browser ws endpoint: ${ws.value}`);
          run(ws.value);
        }
      });
    })
    .on('error', (err) => {
      console.log(err.message);
    });
};

const run = async (ws) => {
  try {
    //Connecting Puppeteer with Mimic instance and performing simple automation.
    const browser = await puppeteer.connect({
      browserWSEndpoint: ws,
      defaultViewport: null,
    });

    const page = await browser.newPage();
    const temp = await page.goto('https://www.tiktok.com/upload/?lang=ru-RU');
    console.log('temp: ', temp);
    await browser.close();
  } catch (err) {
    console.log('err: ', err);
  }
};

startProfile();
