//This is meant to test server connection 
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path: "./config.env"})
const uri = process.env.URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    const collect = await client.db("Capture").collections();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    collect.forEach((element) => console.log(element.collectionName));

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);