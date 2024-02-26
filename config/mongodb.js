const { MongoClient } = require('mongodb');

const Mdb = 'stonescroll';

// Connection URI
const uri = 'mongodb://127.0.0.1:27017';

// Create a new MongoClient
const client = new MongoClient(uri);

// Connect to the MongoDB server
(async () => {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
  
      const database = client.db(Mdb);
      const collectionName = 'scroll_tracking_doc';
      const collection = database.collection(collectionName);
  
      // Your operations on the collection go here
  
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    } finally {
      // Close the connection after your operations
      await client.close();
      
    }
  })();



const MinsertOne = async (Mycollection,myobj)=>{
    return new Promise((reslove,reject)=>{            
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            const dbo = db.db(Mdb);
            dbo.collection(Mycollection).insertOne(myobj, function(err, res) {
              if (err){
                reject(err);
              }else{
                db.close();
                reslove(res);
              } 
            });
        });
    })


}


