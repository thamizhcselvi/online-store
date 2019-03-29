const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.status(200).send("Hello world!");
});

app.post('/product/create', (req, res) => {
    res.status(201).send(req.body);
});

app.listen(port, () => console.log(`Server is running listening on port ${port}!`));