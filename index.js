const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwrp9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('travelTime');
        const servicesCollection = database.collection('services');
        const bookingsCollection = database.collection('bookings');

        console.log('database connented successfully');

        //Get API
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET API
        app.get('/bookings', async(req,res) =>{
            const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
         })
  
        //POST API
         app.post('/bookings', async(req, res) =>{
            const booking = req.body;
        console.log('hit the post api', booking);
  
         const result = await bookingsCollection.insertOne(booking);
        console.log(result);
        res.json(result)
  });

         // GET Single Service
         app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // delete data from cart delete api
    app.delete("/delete/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await bookingsCollection.deleteOne(query);
        res.json(result);
      });
      // confirmation
      app.put('/confirmation/:id',async (req, res) => {
        const id = req.params.id;

        const query = {_id:ObjectId(id)}
        const  options = {upsert: true}
        const service = {
            $set: {
                Status: "Confirm"
            },
        };
        const result = await bookingsCollection.updateOne(query, service, options);
        res.json(result)
        console.log(result);
      });
        // Post API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

          const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel time Server Is Running');
})
app.get('/hello', (req, res) => {
    res.send('ubdate here');
})

app.listen(port, () => {
    console.log('server runnig at port', port);
})