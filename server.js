const { MongoClient } = require('mongodb');


const uri = `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASSWORD}@gatherbot.jeulp.mongodb.net/gatherbot?retryWrites=true&w=majority`;
const database = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = database; 