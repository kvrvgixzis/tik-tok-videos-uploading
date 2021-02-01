const puppeteer = require('puppeteer');
const axios = require('axios');
const {
  typeHead,
  typeHashTag,
  uploadVideo,
  sendPost,
} = require('./tiktokActions');
const { reloadProxy } = require('./proxy');
require('dotenv').config();
const fs = require('fs');

const TIKTOK_URL = 'https://www.tiktok.com/upload/?lang=ru-RU';
const { MLA_PORT, PROXY_USERNAME, PROXY_PASSWORD } = process.env;

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
  const newConfig = { startProfileId: 0, startVideoId };
  const data = JSON.stringify(newConfig);
  fs.writeFileSync('config.json', data);
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
