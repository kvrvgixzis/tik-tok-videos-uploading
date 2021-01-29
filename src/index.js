const puppeteer = require('puppeteer');
const axios = require('axios');
require('dotenv').config();

// TODO: loop in accounts
// TODO: loop in videos

const TIKTOK_URL = 'https://www.tiktok.com/upload/?lang=ru-RU';
const { MLA_PORT, PROXY_URL, PROXY_USERNAME, PROXY_PASSWORD } = process.env;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const startProfile = async () => {
  const profileId = '0ff2b104-351b-4a24-bce8-a50129fd7776';
  const mlaUrl = `http://127.0.0.1:${MLA_PORT}/api/v1/profile/start?automation=true&puppeteer=true&profileId=${profileId}`;

  try {
    console.log('>>> try start multilogin profile');
    const response = await axios(mlaUrl);
    console.log('>>> multilogin response: ', response.data);
    if (response.data.status === 'OK') {
      console.log(`>>> browser ws endpoint: ${response.data.value}`);
      await reloadProxy();
      runPuppeteer(response.data.value);
    }
  } catch (error) {
    console.log('>>> start multilogin profile error');
  }
};

const reloadProxy = async () => {
  try {
    console.log('>>> try reload proxy');
    const response = await axios(PROXY_URL);
    console.log('>>> proxy response: ', response.data);
  } catch (error) {
    console.log('>>> reload proxy error: ', error);
    await reloadProxy();
  }
};

const typeHead = async (page) => {
  try {
    console.log('>>> try type head');
    const head = 'Получай бонус по ссылке в описании';
    const nameInputSelector = '.public-DraftEditor-content';
    await page.waitForSelector(nameInputSelector);
    await page.focus(nameInputSelector);
    await page.keyboard.type(`${head} `);
    console.log('>>> head success');
  } catch (error) {
    console.log('error: ', error);
    await sleep(2000);
    await typeHead(page);
  }
};

const typeHashTag = async (page) => {
  try {
    console.log('>>> try type hashtag');
    const hashtags = [
      '#казино',
      '#казинох',
      '#деньги',
      '#выигрыш',
      '#удача',
      '#fy',
      '#fyp',
      '#gamble',
      '#casino',
    ];
    const nameInputSelector = '.public-DraftEditor-content';
    await page.waitForSelector(nameInputSelector);
    await page.focus(nameInputSelector);
    for (const hashtag of hashtags) {
      await page.keyboard.type(hashtag);
      await sleep(2500);
      await page.keyboard.down('Enter');
      console.log(`>>> hashtag ${hashtag} success`);
    }
    console.log(`>>> hashtags success`);
  } catch (error) {
    console.log('error: ', error);
    await sleep(2000);
    await typeHashTag(page);
  }
};

const uploadVideo = async (page) => {
  try {
    console.log('>>> try load video');
    const fileInputSelector = '.upload-btn-input';
    const fileInput = await page.$(fileInputSelector);
    await fileInput.uploadFile('./videos/id0.mp4');
    console.log('>>> load video in progress');
  } catch (error) {
    console.log('error: ', error);
    await sleep(1000);
    await uploadVideo(page);
  }
};

const sendPost = async (page) => {
  try {
    const sendPostSelector = '.btn-post:not(.disabled)';
    await page.waitForSelector(sendPostSelector);
    console.log('>>> load video success');
    await page.$eval(sendPostSelector, (btn) => btn.click());
  } catch (error) {
    console.log('error: ', error);
    await sleep(1000);
    await sendPost(page);
  }
};

const runPuppeteer = async (ws) => {
  try {
    console.log('>>> start puppeteer');
    const browser = await puppeteer.connect({
      browserWSEndpoint: ws,
      defaultViewport: null,
      ignoreHTTPSErrors: true,
      slowMo: 100,
    });
    const [page] = await browser.pages();
    console.log('>>> login to proxy');
    await page.authenticate({
      username: PROXY_USERNAME,
      password: PROXY_PASSWORD,
    });
    console.log('>>> try load page');
    await page.goto(TIKTOK_URL);
    console.log('>>> page loaded');
    await uploadVideo(page);
    await typeHead(page);
    await typeHashTag(page);
    await sendPost(page);
    console.log('>>> post sended');
  } catch (err) {
    console.log('>>> puppeteer error: ', err);
  }
};

startProfile();
