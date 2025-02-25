const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;



app.use(express.json())
app.use(cors())


const uri = process.env.MONGODB_URI; 

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        // await client.connect();

        const tasklyDB = client.db("tasklyDB")

        const tasksCollection = tasklyDB.collection("tasks");

        app.get('/tasks/:uid', async (req, res) => {
            let category;

            if (req.query.category) {
                category = req.query.category
                const result = await tasksCollection.find({ user_id: req.params.uid, category: category }).sort({ timestamp: -1 }).toArray()
                res.send(result)
            }
            else {
                const result = await tasksCollection.find({ user_id: req.params.uid }).sort({ timestamp: -1 }).toArray()
                res.send(result)
            }
        })
        app.get('/task/:id', async (req, res) => {
            const result = await tasksCollection.findOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })
        app.patch('/task/title/:id', async (req, res) => {
            const find = { _id: new ObjectId(req.params.id) }
            const updateTask = {
                $set: {
                    title: req.body.title,
                    timestamp: req.body.timestamp
                }
            }
            const result = await tasksCollection.updateOne(find, updateTask)
            res.send(result)
        })
        app.patch('/task-category', async (req, res) => {
            const id = req.body.id
            const find = { _id: new ObjectId(id) }
            const updateTask = {
                $set: {
                    timestamp: new Date().toISOString(),
                    category : req.body.category
                }
            }
            const result = await tasksCollection.updateOne(find, updateTask)
            res.send(result)
        })
        app.patch('/task/description/:id', async (req, res) => {
            const find = { _id: new ObjectId(req.params.id) }
            const updateTask = {
                $set: {
                    description: req.body.description,
                    timestamp: req.body.timestamp
                }
            }
            const result = await tasksCollection.updateOne(find, updateTask)
            res.send(result)
        })
        app.delete('/task/:id', async (req, res) => {
            const result = await tasksCollection.deleteOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })
        app.post('/tasks', async (req, res) => {
            const result = await tasksCollection.insertOne(req.body)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Welcome To Taskly Appliation Server")
})

app.listen(port, () => {
    console.log("Server is running on port :", port)
})