const express = require('express');
//const mongoose = require('mongoose');
const mongoclient = require('mongodb').MongoClient
const path = require('path');
const PORT = process.env.PORT || 5000
const parser = require('body-parser');
const uri = 'mongodb://heroku_9d4txdmb:ol8lo56i5qd1u3ro3ubi7e3tug@ds163650.mlab.com:63650/heroku_9d4txdmb';
const app = express();

var db;

/*mongoose.Promise = global.Promise;
mongoose.connect(uri);*/

mongoclient.connect(uri, (err, client) => {
  if (err) return console.log("Unable to connect")
  db = client.db('heroku_9d4txdmb')
  app.listen(PORT, () => {
    console.log('Server listening on port: ' + PORT)
  })
})

/*var hackerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String
})
var Hacker = mongoose.model("Participants", hackerSchema);*/

app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())
app.use('/', (req, res) => {
  res.sendFile(__dirname + "/form.html");
})
app.post('/add', (req, res) => {
  db.collection('Hackers').save(req.body, (err, result) => {
    if (err) return console.log("Unable to save to database")
    console.log("Saved to database")
    res.render('/')
  })
})
