const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const mongoDb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

let db;
const uri = 'mongodb+srv://admin:admin@online-store-gzuow.mongodb.net/test?retryWrites=true';

const client = new MongoClient(uri, {useNewUrlParser: true});

client.connect(err => {
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
    if (req.body.title === undefined || '') return res.status(400).send({message: 'Parameter title missing'});
    if (req.body.description === undefined || '') return res.status(400).send({message: 'Parameter description missing'});
    if (req.body.category === undefined || '') return res.status(400).send({message: 'Parameter category missing'});
    if (req.body.color === undefined || '') return res.status(400).send({message: 'Parameter color missing'});
    if (req.body.size === undefined || '') return res.status(400).send({message: 'Parameter size missing'});
    if (req.body.skuId === undefined || '') return res.status(400).send({message: 'Parameter skuId missing'});
    if (req.body.brand === undefined || '') return res.status(400).send({message: 'Parameter brand missing'});
    if (req.body.imageUrl === undefined || '') return res.status(400).send({message: 'Parameter imageUrl missing'});
    if (req.body.productType === undefined || '') return res.status(400).send({message: 'Parameter productType missing'});
    if (req.body.price === undefined || '') return res.status(400).send({message: 'Parameter price missing'});
    if (req.body.priceWithTax === undefined || '') return res.status(400).send({message: 'Parameter priceWithTax missing'});
    if (req.body.gst === undefined || '') return res.status(400).send({message: 'Parameter gst missing'});


    db.collection('products').insertOne(req.body, (err, result) => {
        if (err) return res.status(500).send({message: 'Something went wrong. Try again with valid data'});

        return res.status(201).send({
            message: 'saved product successfully!',
            product: result.ops[0]
        });
    });
});

app.get('/product/get/all', (req, res) => {
    db.collection('products').find().toArray((err, result) => {
        if (err) return res.status(500).send({message: 'error fetching products'});

        res.status(200).send(result);
    });
});

app.get('/product/get/:id', (req, res) => {
    if (req.params.id === '' || undefined) return res.status(400).send({message: 'Parameter id missing'});

    const id = mongoDb.ObjectID(req.params.id);

    db.collection('products').find({_id: id}).toArray((err, result) => {
        if (err) return res.status(500).send({message: 'error fetching product'});

        res.status(200).send(result);
    });
});

app.get('/product/getByTitle', (req, res) => {
    if (req.query.q === '' || undefined) return res.status(400).send({message: 'Parameter query missing'});

    const q = req.query.q;

    db.collection('products').find({title: new RegExp(`^${q}`)}).toArray((err, result) => {
        if (err) return res.status(500).send({message: 'error fetching product'});

        res.status(200).send(result);
    });
});

app.delete('/product/delete/:id', (req, res) => {
    if (req.params.id === '' || undefined) return res.status(400).send({message: 'Parameter id missing'});

    const id = mongoDb.ObjectID(req.params.id);

    db.collection('products').deleteOne({_id: id}, (err, result) => {
        if (err) return res.status(400).send({message: 'deletion failed'});

        res.status(200).send({message: 'success deleted'});
    });
});

app.put('/product/update', (req, res) => {
    if (req.body.id === undefined || '') return res.status(400).send({message: 'Parameter id missing'});

    const query = {_id: mongoDb.ObjectID(req.body.id)};
    const newValues = {
        $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            subCategory: req.body.subCategory,
            color: req.body.color,
            size: req.body.size,
            variants: req.body.variants,
            skuId: req.body.skuId,
            brand: req.body.brand,
            imageUrl: req.body.imageUrl,
            productType: req.body.productType,
            price: req.body.price,
            priceWithTax: req.body.priceWithTax,
            gst: req.body.gst
        }
    };

    db.collection("products").updateOne(query, newValues, (err, result) => {
        if (err) return res.status(400).send({message: "update failed"});

        return res.status(200).send({message: 'updated product successfully'});
    });
});