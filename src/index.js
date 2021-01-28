const puppeteer = require('puppeteer');
const http = require('http');

const TIKTOK_URL = 'https://www.tiktok.com/upload';
const MLA_PORT = 35000;
const PROXY_URL =
  'http://me-pvt-97.airsocks.in/api/v3/changer_channels/channel_1?session=nv1db5d5ehu5gyd7oxq72h2dudj3f7fn';

const startProfile = async () => {
  const profileId = '0ff2b104-351b-4a24-bce8-a50129fd7776';
  const mlaUrl = `http://127.0.0.1:${MLA_PORT}/api/v1/profile/start?automation=true&puppeteer=true&profileId=${profileId}`;

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

const reloadProxy = async () => {
  http
    .get(PROXY_URL, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', async () => {
        // const answer = await data.text();
        console.log('data: ', data);
      });
    })
    .on('error', (err) => {
      console.log(err.message);
    });
};

const run = async (ws) => {
  await reloadProxy();
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: ws,
      defaultViewport: null,
      ignoreHTTPSErrors: true,
    });

    const [page] = await browser.pages();

    await page.goto(TIKTOK_URL);
    console.log('page loaded');
    await browser.close();
  } catch (err) {
    console.log('err: ', err);
  }
};

startProfile();
