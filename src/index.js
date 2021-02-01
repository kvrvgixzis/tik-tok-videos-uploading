const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const {
  typeHead,
  typeHashTag,
  uploadVideo,
  sendPost,
} = require('./tiktokActions');
const { reloadProxy } = require('./proxy');
require('dotenv').config();
const { getConfig, getProfiles, getVideos, sleep } = require('./utils');

const TIKTOK_URL = 'https://www.tiktok.com/upload/?lang=ru-RU';
const { MLA_PORT, PROXY_USERNAME, PROXY_PASSWORD } = process.env;

const runProfile = async (mlId, video) => {
  const mlaUrl = `http://127.0.0.1:${MLA_PORT}/api/v1/profile/start?automation=true&puppeteer=true&profileId=${mlId}`;

  try {
    console.log('>>> try start multilogin profile');
    const response = await axios(mlaUrl);
    if (response.data.status === 'OK') {
      console.log(`>>> browser ws endpoint: ${response.data.value}`);
      await reloadProxy();
      await runPuppeteer(response.data.value, video);
    }
  } catch (error) {
    console.log('>>> start multilogin profile error');
  }
};

const runPuppeteer = async (ws, video) => {
  const { head, tags, videoPath } = video;
  const browser = await puppeteer.connect({
    browserWSEndpoint: ws,
    defaultViewport: null,
    ignoreHTTPSErrors: true,
    slowMo: 100,
  });
  try {
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
  } finally {
    await browser.close();
  }
};

const uploadVideoToAllProfiles = async (video) => {
  const profiles = getProfiles();
  const { startProfileId, startVideoId } = getConfig();
  for (const profile of profiles) {
    if (+profile.id < +startProfileId) continue;
    console.log('============================');
    console.log(`>>> run profile ${profile.id} with video ${video.id}`);
    await runProfile(profile.mlId, video);
  }
  const newConfig = { startProfileId: 0, startVideoId };
  const data = JSON.stringify(newConfig);
  fs.writeFileSync('config.json', data);
};

const uploadAllVideos = async () => {
  const videos = getVideos();
  const { startVideoId } = getConfig();
  for (const video of videos) {
    if (+video.id < +startVideoId) continue;
    await uploadVideoToAllProfiles(video);
    const sleepTimeout = 15 * 1000 * 60;
    console.log(`>>> await ${sleepTimeout / 60 / 1000} minutes`);
    await sleep(sleepTimeout);
  }
  await uploadAllVideos();
};

uploadAllVideos();
