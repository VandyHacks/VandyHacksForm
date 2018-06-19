const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT || 5000
const parser = require('body-parser');
const uri = 'mongodb://heroku_9d4txdmb:ol8lo56i5qd1u3ro3ubi7e3tug@ds163650.mlab.com:63650/heroku_9d4txdmb';

mongoose.Promise = global.Promise;
mongoose.connect(uri);

let db = mongoose.connection;
var list = [];
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  var hackerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  })
  let Hacker = mongoose.model("Participants", hackerSchema);
  let newhacker = new Hacker({
    firstName: document.getElementById('first'),
    lastName: document.getElementById('last'),
    email: document.getElementById('emailid'),
    phone: document.getElementById('phoneid')
  })
  Hacker.insertOne(newhacker).then(() => {
    console.log("Saved to database");
  }).catch(err => {
    console.log("Unable to save to database");
  })
});

var app = express();
app.use('/', (req, res) => {
  res.sendFile(__dirname + "/form.html");
});
app.post('/add', (req, res) => {
  var data = new User(req.body);
  data.save()
    .then(item => {
      res.send("Saved to database");
    })
    .catch(err => {
      res.status(400).send("Unable to save to database");
    });
})
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

