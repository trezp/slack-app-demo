require('dotenv').config();

const mongo = require('./db.js');

const { App, LogLevel } = require('@slack/bolt');
const { gatherBotModal, gatherBotMessage } = require('./blocks.js');
const { saveToDB, findDocByTimeStamp } = require('./helpers.js');
const { ConsoleLogger } = require('@slack/logger');

// Initialize app 
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.INFO,
});

app.command('/gather', async ({ ack, body, client }) => {
  await ack(); 

  try {
    // open the GatherBot modal view
    await client.views.open({
      trigger_id: body.trigger_id,
      view: gatherBotModal
    });
  } catch (error) {
    console.error(error);
  } 
});

// Define modal view
app.view('gatherbot_modal', async ({ ack, body, view, client }) => {
  await ack();

  // drill into the response to get the form selections
  const data = view['state']['values'];
  const responses = [];
  
  for (const object in data) {
    for(item in data[object]){
      responses.push(data[object][item]['selected_option']['text']['text']);
    }
  }

  // post a formatted gather message in channel 
  try {
    const [ activity, day, time ] = responses;
    const user = body['user'].name;
    const gatherMsg = `<@${user}> wants to *${activity} on ${day} at ${time}*. Would you like to join? :white_check_mark:`;
    // id for #general
    const channelID = 'C02G73QNTHD';

    const response = await client.chat.postMessage({
      // channel ID for #general
      channel: channelID,
      blocks: gatherBotMessage(gatherMsg),
      text: gatherMsg
    });

    await saveToDB({
      user,
      channelID,
      ts: response.ts,
      gatherMsg
    });
  } catch (error) {
    console.error(error);
  }
});

app.action('attendBtn', async ({ack, body, client}) => {
  await ack();

  const user = body['user'].name;
  const doc = await findDocByTimeStamp(body.message.ts, user);
  let userOrUsers = doc.value.guestList ? doc.value.guestList : `<@${user}>`;
  //await clearDB()

  await client.chat.update({
    channel: doc.value.channelID,
    ts: doc.value.ts,
    blocks: gatherBotMessage(`${doc.value.gatherMsg} ${userOrUsers} want(s) to join!`),
    text: `<@${user}> wants to join!`
  });

  // Using the timestamp from the response, automatically add the first emoji reaction
  const reaction = await client.reactions.add({
    channel: doc.value.channelID,
    name: 'white_check_mark',
    timestamp: doc.value.ts
  });
});

app.command('/skipbo', async ({ ack, body, client }) => {
  await ack(); 

  await client.chat.postMessage({
    channel: body.channel_id,
    text: 'How to Play Skip-Bo: https://www.youtube.com/watch?v=Z-b_XTnMRck'
  });
});

// surprise command for end of presentation 
app.command('/thanks', async ({ ack, body, client }) => {
  await ack(); 

  await client.chat.postMessage({
    channel: body.channel_id,
    text: 'http://gph.is/2pn6kTv'
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ GatherBot is running!');
})();