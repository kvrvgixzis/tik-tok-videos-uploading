const puppeteer = require('puppeteer');
const axios = require('axios');
require('dotenv').config();

const TIKTOK_URL = 'https://www.tiktok.com/upload/?lang=ru-RU';
const { MLA_PORT, PROXY_URL, PROXY_USERNAME, PROXY_PASSWORD } = process.env;

const startProfile = async () => {
  const profileId = '0ff2b104-351b-4a24-bce8-a50129fd7776';
  const mlaUrl = `http://127.0.0.1:${MLA_PORT}/api/v1/profile/start?automation=true&puppeteer=true&profileId=${profileId}`;

  // starting multilogin profile
  try {
    console.log('>>> try start multilogin profile');
    const response = await axios(mlaUrl);
    console.log('>>> multilogin response: ', response.data);
    if (response.data.status === 'OK') {
      console.log(`>>> browser ws endpoint: ${response.data.value}`);
      run(response.data.value);
    }
  } catch (error) {
    console.log(error.response.body);
  }
};

const reloadProxy = async () => {
  try {
    console.log('>>> try reload proxy');
    const response = await axios(PROXY_URL);
    console.log('>>> proxy response: ', response.data);
  } catch (error) {
    console.log(error.response.body);
    await reloadProxy();
  }
};

const run = async (ws) => {
  // await while proxy reloaded
  await reloadProxy();

  try {
    console.log('>>> start puppeteer');
    const browser = await puppeteer.connect({
      browserWSEndpoint: ws,
      defaultViewport: null,
      ignoreHTTPSErrors: true,
    });

    const [page] = await browser.pages();
    // login to proxy
    await page.authenticate({
      username: PROXY_USERNAME,
      password: PROXY_PASSWORD,
    });

    await page.goto(TIKTOK_URL);
    console.log('page loaded');
    await browser.close();
  } catch (err) {
    console.log('puppeteer error: ', err);
  }
};

startProfile();
