var MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://Wokle:Wokle@23@localhost:27017?retryWrites=true&writeConcern=majority";

const client = new MongoClient(uri);

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);