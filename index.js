const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT || 5000
const parser = require('body-parser');
const uri = 'mongodb://heroku_9d4txdmb:ol8lo56i5qd1u3ro3ubi7e3tug@ds163650.mlab.com:63650/heroku_9d4txdmb';

mongoose.Promise = global.Promise;
mongoose.connect(uri);

var hackerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String
})
var Hacker = mongoose.model("Participants", hackerSchema);

express()
  .use(parser.urlencoded({ extended: true}))
  .use(parser.json())
  .use('/', (req, res) => {
    res.sendFile(__dirname + "/form.html");
  })
  .post('/add', (req, res) => {
    console.log(req.body);
    var data = new User(req.body);
    data.save()
      .then(item => {
        res.send("Saved to database");
      })
      .catch(err => {
        res.status(400).send("Unable to save to database");
      });
  })
  .listen(PORT, () => {
    console.log("Server listening on port " + PORT);
  });

