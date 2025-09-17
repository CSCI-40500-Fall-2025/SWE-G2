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

async function log_in_test(){
    try{
        await client.connect();
        const collection = client.db("Capture").collection("Users");
        
        const user_email = {Email: "test@gmail.com"}

        const get_result = await collection.findOne(user_email);
        if(!get_result){
            console.log("Could not find email");
        }
        const pass = "test123!";
        if(get_result.Password === pass){
            console.log("Log in was successful!");
        }
        else{
            console.log("wrong password")
        }
        
    }finally{
        client.close();
    }
}
log_in_test().catch(console.dir);
