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
    if (tryCount === 4) {
      console.log('>>> skip profile');
      return;
    }
    await sleep(1000);
    tryCount += 1;
    await sendPost(page, tryCount);
  }
};

module.exports.typeHead = typeHead;
module.exports.typeHashTag = typeHashTag;
module.exports.uploadVideo = uploadVideo;
module.exports.sendPost = sendPost;
