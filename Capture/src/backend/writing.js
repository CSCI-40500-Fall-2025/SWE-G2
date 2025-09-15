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
async function addUser() {
  const user = {
    Name: "Test Insert",
    Email: "test@gmail.com",
    // Format for Dates: YYYY-MM-DDTHH:mm:ss.sssZ
    DOB: new Date("2002-05-01T00:00:00.000+00:00"), // better to use Date object
    Password: "test123!"
  };

  try {
    await client.connect();
    const get_collection = client.db("Capture").collection("Users");

    const result = await get_collection.insertOne(user);
    console.log("✅ User has been added with _id:", result.insertedId);

  } finally {
    await client.close();
  }
}

addUser().catch(console.dir);