const fs = require('fs');

const getVideos = () => {
  const videosRaw = fs.readFileSync('./videos.json');
  return JSON.parse(videosRaw).videos;
};

const getProfiles = () => {
  const profilesRaw = fs.readFileSync('./profiles.json');
  return JSON.parse(profilesRaw).profiles;
};

const getConfig = () => {
  const configRaw = fs.readFileSync('./config.json');
  return JSON.parse(configRaw);
};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

module.exports.getVideos = getVideos;
module.exports.getProfiles = getProfiles;
module.exports.getConfig = getConfig;
module.exports.sleep = sleep;
