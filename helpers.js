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

const clearDB = async () => {
  await runDB( async (collection) => {
    await collection.deleteMany({});
  });
}

const findDocByTimeStamp = async (ts, user) => {
  try {
    await mongo.connect(); 
    const database = mongo.db('slack');
    const collection = database.collection('gatherbot');
  
    const doc = await collection.findOneAndUpdate({'ts': ts}, {$push: {guestList: `<@${user}>`}}, {upsert: true}, {new: true});
    console.log(doc)
    return doc 
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  runDB, 
  saveToDB,
  clearDB,
  findDocByTimeStamp
}