require('dotenv').config()
const { App, LogLevel } = require('@slack/bolt');
const gatherBot = require('./gatherBot.js');

//Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.INFO,
});

app.command('/connect', async ({ ack, body, client }) => {
  // acknowledge the slash command
  await ack(); 

  try {
    const result = await client.views.open({
      // trigger_id required to open modal 
      trigger_id: body.trigger_id,
      view: gatherBot
    });
  }
  catch (error) {
    console.error(error);
  } 
});

app.view('gatherbot_modal', async ({ ack, body, view, client }) => {
  await ack();

  const radioSelection = Object.values(view['state']['values'])[0]['radio_buttons-action']['selected_option']['text']['text'];
  const date = Object.values(view['state']['values'])[1]['datepicker-action']['selected_date'];
  const msg = `Someone wants to *${radioSelection}* on *${date}*. Who would like to join them?`

  //Message the user
  try {
    await client.chat.postMessage({
      // channel ID for #general
      channel: 'C02AQHA2ULX',
      text: msg
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