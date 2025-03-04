require('dotenv').config();
const dalService = require("./dal.service");

async function validate(proofOfTask) {

  try {
    const token = process.env.BITMINDKEY;
    const taskResult = await dalService.getIPfsTask(proofOfTask);

    console.log("received task result", taskResult);

    console.log("recievied image url", taskResult.image_url)

    var image_url = taskResult.image_url
    console.log(`image_url: ${image_url}`);
    //REPLACE IMAGE

    //verify the image is not deepfakle
    const response = await fetch(
      'https://api.bitmind.ai/oracle/v1/34/detect-image',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: image_url
        }),
      }
    );
    const res_me = await response.json();
    console.log("VALIDATOR ########")
    console.log(res_me);
    console.log("VALIDATOR ########")

    console.log(" validator testing results isAi?", res_me.isAI)
    console.log("miner results: ", taskResult.isAI)

    let isApproved = true

    if (res_me.isAI !== taskResult.isAI) {
      isApproved = false;
    }

    return isApproved;
  } catch (err) {
    console.error(err?.message);
    return false;
  }
}

module.exports = {
  validate,
}