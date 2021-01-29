const puppeteer = require('puppeteer');
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');

const TIKTOK_URL = 'https://www.tiktok.com/upload/?lang=ru-RU';
const { MLA_PORT, PROXY_URL, PROXY_USERNAME, PROXY_PASSWORD } = process.env;

const configRaw = fs.readFileSync('./config.json');
const { startProfileId, startVideoId } = JSON.parse(configRaw);

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const runProfile = async (mlId, video) => {
  const mlaUrl = `http://127.0.0.1:${MLA_PORT}/api/v1/profile/start?automation=true&puppeteer=true&profileId=${mlId}`;

  try {
    console.log('>>> try start multilogin profile');
    const response = await axios(mlaUrl);
    console.log('>>> multilogin response: ', response.data);
    if (response.data.status === 'OK') {
      console.log(`>>> browser ws endpoint: ${response.data.value}`);
      await reloadProxy();
      await runPuppeteer(response.data.value, video);
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

const typeHead = async (page, head) => {
  try {
    console.log('>>> try type head');
    const nameInputSelector = '.public-DraftEditor-content';
    await page.waitForSelector(nameInputSelector);
    await page.hover(nameInputSelector);
    await page.focus(nameInputSelector);
    await page.keyboard.type(`${head} `);
    console.log('>>> head success');
  } catch (error) {
    console.log('error: ', error);
    await sleep(2000);
    await typeHead(page, head);
  }
};

const typeHashTag = async (page, tags) => {
  try {
    console.log('>>> try type hashtag');
    const nameInputSelector = '.public-DraftEditor-content';
    await page.waitForSelector(nameInputSelector);
    await page.hover(nameInputSelector);
    await page.focus(nameInputSelector);
    for (const hashtag of tags) {
      await page.keyboard.type(hashtag);
      await sleep(2500);
      await page.keyboard.down('Enter');
      console.log(`>>> hashtag ${hashtag} success`);
    }
    console.log(`>>> hashtags success`);
  } catch (error) {
    console.log('error: ', error);
    await sleep(2000);
    await typeHashTag(page, tags);
  }
};

const uploadVideo = async (page, videoPath) => {
  try {
    console.log('>>> try load video');
    const fileInputSelector = '.upload-btn-input';
    const fileInput = await page.$(fileInputSelector);
    await fileInput.uploadFile(videoPath);
    console.log('>>> load video in progress');
  } catch (error) {
    console.log('error: ', error);
    await sleep(1000);
    await uploadVideo(page, videoPath);
  }
};

const sendPost = async (page, tryCount = 1) => {
  try {
    const sendPostSelector = '.btn-post:not(.disabled)';
    await page.waitForSelector(sendPostSelector);
    console.log('>>> load video success');
    console.log('>>> try send post: ', tryCount);
    await page.hover(sendPostSelector);
    await page.$eval(sendPostSelector, (btn) => btn.click());
  } catch (error) {
    console.log('error: ', error);
    if (tryCount === 2) {
      console.log('>>> skip profile');
      return;
    }
    await sleep(1000);
    tryCount += 1;
    await sendPost(page, tryCount);
  }
};

const runPuppeteer = async (ws, video) => {
  const { head, tags, videoPath } = video;

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
    await uploadVideo(page, videoPath);
    await typeHead(page, head);
    await typeHashTag(page, tags);
    await sendPost(page);
    await sleep(5000);
    await browser.close();
    console.log('>>> post sended');
  } catch (err) {
    console.log('>>> puppeteer error: ', err);
  }
};

const getVideos = () => {
  const videosRaw = fs.readFileSync('./videos.json');
  return JSON.parse(videosRaw).videos;
};

const getProfiles = () => {
  const profilesRaw = fs.readFileSync('./profiles.json');
  return JSON.parse(profilesRaw).profiles;
};

const uploadVideoToAllProfiles = async (video) => {
  const profiles = getProfiles();
  for (const profile of profiles) {
    if (+profile.id < +startProfileId) continue;
    console.log('============================');
    console.log(`>>> run profile ${profile.id}`);
    await runProfile(profile.mlId, video);
  }
};

const main = async () => {
  const videos = getVideos();
  for (const video of videos) {
    if (+video.id < +startVideoId) continue;
    console.log('============================');
    console.log(`>>> run video ${video.id}`);
    await uploadVideoToAllProfiles(video);
    await sleep(15 * 1000 * 60);
    console.log('>>> await 30 minutes');
  }
  await main();
};

main();
