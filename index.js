require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cuid = require('cuid')

const PORT = process.env.PORT || 3000

const NAME_SCHEMA = new mongoose.Schema({
    id: { type: String, auto: true },
    name: String,
})

const Name = mongoose.model('name', NAME_SCHEMA)
const app = express()
const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}

mongoose
    .connect(process.env.CONNECTION_STRING, connectionParams)
    .then(() => {
        console.log('Connected to database')
    })
    .catch(err => {
        console.error(`Error connecting to the database. \n${err}`)
    })
app.use(bodyParser.json())

app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

const nameResponseTrasformer = name => {
    return { name: name.name, id: name.id }
}

// Retrive the name
app.get('/name/:name', async (req, res) => {
    const name = await Name.findOne({ name: req.params.name })
    if (!name) res.send('Did not find name')

    const transformName = nameResponseTrasformer(name)
    res.send(transformName)
})

// Create a record on the database to store that name
app.post('/name', async (req, res) => {
    const name = await Name.create({ name: req.body.name, id: cuid() })
    res.send(name)
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})

// Retrive a list of all current names in the database
// Edit the name
