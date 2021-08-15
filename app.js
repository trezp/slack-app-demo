require('dotenv').config()
const { App, LogLevel } = require('@slack/bolt');
const { gatherBotModal, gatherBotMessage } = require('./blocks.js');

const channelID = 'C02ARLCQT1V';

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
  const radioSelection = Object.values(view['state']['values'])[0]['radio_buttons-action']['selected_option']['text']['text'];
  const date = Object.values(view['state']['values'])[1]['datepicker-action']['selected_date'];
 
  // Message the user
  try {
    const response = await client.chat.postMessage({
      // channel ID for #general
      channel: channelID,
      blocks: gatherBotMessage(user, radioSelection, date),
      text: `<@${user}> wants to *${radioSelection}* on *${date}*. Would you like to join? :white_check_mark:`
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

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();