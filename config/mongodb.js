require('dotenv').config();
const { MongoClient } = require('mongodb');

const Mdb = 'stonescroll';

// Connection URI

const uri = (process.env.MONGO_HOST).toString();

// Create a new MongoClient
const client = new MongoClient(uri);

// Connect to the MongoDB server
const connectToMongo = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const MinsertOne = async (Mycollection, myobj) => {
  try {
    const database = client.db(Mdb);
    const collection = database.collection(Mycollection);
    const result = await collection.insertOne(myobj);
    return result;
  } catch (error) {
    console.error('Error inserting document:', error);
    throw error;
  }
};

const Mfind = async (Mycollection) => {
  try {
    const database = client.db(Mdb);
    const collection = database.collection(Mycollection);
    const result = await collection.findOne({});
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error finding document:', error);
    throw error;
  }
};

const Mupdate = async (Mycollection, query, update) => {
  try {
    const database = client.db(Mdb);
    const collection = database.collection(Mycollection);
    const result = await collection.updateMany(query, update);
    console.log(`${result.modifiedCount} document(s) updated`);
    return result;
  } catch (error) {
    console.error('Error updating documents:', error);
    throw error;
  }
};
const Mupsert = async (Mycollection, query, update) => {
  try {
    const database = client.db(Mdb);
    const collection = database.collection(Mycollection);
    const result = await collection.updateMany(query,update, { upsert: true });
    console.log(`${result.modifiedCount} document(s) updated`);
    return result;
  } catch (error) {
    console.error('Error updating documents:', error);
    throw error;
  }
};

const MfindWithCondition = async (Mycollection, query,limitValue = 1) => {
  try {
    
    const database = client.db(Mdb);
    const collection = database.collection(Mycollection);
    const result = await collection.find(query,{ projection: { basicdoc: { $slice: limitValue } } }).toArray();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error finding documents with condition:', error);
    throw error;
  }
};

module.exports = {
  connectToMongo: connectToMongo,
  MinsertOne: MinsertOne,
  Mfind: Mfind,
  Mupdate: Mupdate,
  Mupsert:Mupsert,
  MfindWithCondition: MfindWithCondition,
};
