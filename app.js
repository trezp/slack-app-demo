require('dotenv').config();

const mongo = require('./db.js');

const { App, LogLevel } = require('@slack/bolt');
const { gatherBotModal, gatherBotMessage } = require('./blocks.js');
const { ConsoleLogger } = require('@slack/logger');

// Initialize app 
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.INFO,
});

const runDB = async (callback) => {
  try {
    await mongo.connect(); 
    const database = mongo.db('slack');
    const collection = database.collection('gatherbot');
  
    callback(collection);

  } catch(err) {
    console.log(err);
  }
}

const saveToDB = async (document) => {
  await runDB( async (collection) => {
    await collection.insertOne(document);
  });
}

const findUserByTimestamp = async (ts) => {
  return await runDB( async (collection) => {
    await collection.findOne({'ts': ts});
  });
}

const setGuestList = async (ts, user) => {
  let updated; 

  await runDB( async (collection) => {
    const filter = { 'ts': ts };
    const options = { upsert: true };
    const updateDoc = {$set: {"message.text": "Update the $*#$#$# message please"}};

    await collection.findOneAndUpdate(filter, updateDoc);
  });
}
app.message('test', async ({ message, client }) => {
  try {
    const result = await client.chat.postMessage({
      channel: message.channel,
      text: "New Message new message new message",
      blocks: [
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Save this message to the DB!",
                "emoji": true
              },
              "value": "join",
              "action_id": "join-btn"
            }
          ]
        }
      ]
    });

    app.action('join-btn', async ({ack, body, client}) => {
      await ack();

      await saveToDB(result);
      const blah = await setGuestList(result.ts, body.user)
      
      const user = await findUserByTimestamp(result.ts)

      await client.chat.postMessage({
        // channel ID for #general
        channel: result.channel,
        text: `${blah}`
      });
    });
    

    
  }
  catch (error) {
    console.error(error);
  } finally {
    mongo.close(); 
  }
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

    // Using the timestamp from the response, automatically add the first emoji reaction
    const reaction = await client.reactions.add({
      channel: channelID,
      name: 'white_check_mark',
      timestamp: response.ts
    });
  } catch (error) {
    console.error(error);
  }
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