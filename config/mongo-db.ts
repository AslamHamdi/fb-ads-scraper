var MongoClient = require('mongodb').MongoClient;

//const uri = "mongodb+srv://Wokle:Wokle@23@localhost:27017?retryWrites=true&writeConcern=majority";
//mongodb+srv://<username>:<password>@<clustername>.mongodb.net/

exports.connectToCluster = async(uri: string) => {
    let mongoClient;
 
    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
 
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
 }