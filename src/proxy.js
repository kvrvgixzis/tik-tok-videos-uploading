const axios = require('axios');

const reloadProxy = async () => {
  const { PROXY_URL } = process.env;

  try {
    console.log('>>> try reload proxy');
    const response = await axios(PROXY_URL);
    console.log('>>> proxy response: ', response.data);
  } catch (error) {
    console.log('>>> reload proxy error: ', error);
    await reloadProxy();
  }
};

module.exports.reloadProxy = reloadProxy;
