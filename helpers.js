const mongo = require('./db.js');

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

module.exports = {
  runDB, 
  saveToDB,
  findUserByTimestamp,
  setGuestList
}