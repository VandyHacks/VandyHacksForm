const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const parser = require('body-parser');
const uri = 'mongodb://heroku_9d4txdmb:ol8lo56i5qd1u3ro3ubi7e3tug@ds163650.mlab.com:63650/heroku_9d4txdmb';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())

mongoose.connect(uri);
mongoose.Promise = global.Promise;

var db = mongoose.connection;

app.use('/', (req, res) => {
  res.sendFile(__dirname + "/form.html");
})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  var hackerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  })
  var Hacker = mongoose.model("Hacker", hackerSchema);
  app.post('/add', (req, res) => {
    var data = new Hacker(req.body);
    data.save()
      .then(item => {
        res.send("Saved to database");
      })
      .catch(err => {
        res.send("Unable to save to database");
      })
  }) 
})

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
})


