const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const MongoClient = require('mongodb').MongoClient;

let db;

MongoClient.connect('your-mongodb-url', (err, client) => {
    if (err) return console.log(err);
    db = client.db('online-store');

    app.listen(port, () => console.log(`Server is running listening on port ${port}!`));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.status(200).send("Hello world!");
});

app.post('/product/create', (req, res) => {
    res.status(201).send(req.body);
});