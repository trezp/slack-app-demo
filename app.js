require('dotenv').config();
const { App, LogLevel } = require('@slack/bolt');
const { gatherBotModal, gatherBotMessage } = require('./blocks.js');

// id for #general
const channelID = 'C02AQHA2ULX';

//Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.INFO,
});

app.command('/gather', async ({ ack, body, client }) => {
  // acknowledge the slash command
  await ack(); 

  try {
    const result = await client.views.open({
      // trigger_id required to open modal 
      trigger_id: body.trigger_id,
      view: gatherBotModal()
    });
  }
  catch (error) {
    console.error(error);
  } 
});

app.view('gatherbot_modal', async ({ ack, body, view, client }) => {
  await ack();

  const user = body['user'].name;
  const data = view['state']['values'];
  const responses = [];
  let gatherMsg;

  // drill into the response to get the form selections
  for (const object in data) {
    for(item in data[object]){
      responses.push(data[object][item]['selected_option']['text']['text']);
    }
  }

  // Message the user
  try {
    const [activity, day, time] = responses;
    gatherMsg = `<@${user}> wants to *${activity} on ${day} at ${time}*. Would you like to join? :white_check_mark:`;

    const response = await client.chat.postMessage({
      // channel ID for #general
      channel: channelID,
      blocks: gatherBotMessage(gatherMsg),
      text: `<@${user}> wants to *${activity} on ${day} at ${time}*. Would you like to join? :white_check_mark:`
    });

    await client.reactions.add({
      channel: channelID,
      name: 'white_check_mark',
      timestamp: response.ts
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.command('/skipbo', async ({ ack, body, client }) => {
  await ack(); 

  try {
    await client.chat.postMessage({
      channel: body.channel_id,
      text: 'How to Play Skip-Bo: https://www.youtube.com/watch?v=Z-b_XTnMRck'
    });
  }
  catch (error) {
    console.error(error);
  } 
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();