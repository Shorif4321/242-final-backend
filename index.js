const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const bookingCollection = database.collection("Appointments");

    // user route
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result)
    })
    //users get 
    app.get('/users', async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      res.send(users)
    })
    // make admin
    app.put('/users/admin/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const option = {upsert:true}
      const updatedDoc = {
        $set:{
          role:'admin'
        }
      }
      const result = await userCollection.updateOne(filter,updatedDoc,option);
      res.send(result)
    })


    // booking appointments
    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result)
    });

    // get my service base on email
    app.get('/bookings', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings)
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
