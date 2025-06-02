const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()

// middlewares
const app = express();
app.use(express.json());
app.use(cors())
const port = 3000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ftktcj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function bootstrap() {
  try {
    await client.connect();
    const database = client.db("Relive");
    const userCollection = database.collection("Users");

    // user route
    app.post('/users',async(req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result)
    })





  } finally {
    // await client.close();
  }
}
bootstrap().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello Relive!')
})

app.listen(port, () => {
  console.log(`Relive app listening on port ${port}`)
})
