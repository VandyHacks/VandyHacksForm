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
  lastName: String
})
var User = mongoose.model("Participants", hackerSchema);


express() 
  .set('view engine','ejs')
  .use('/', (req, res) => {
    res.sendFile(__dirname + "/form.html");
  })
  .get('/', (req, res) => res.render('pages/index'))
  .post('/add', (req, res) => {
      var data = new User(req.body);
      console.log("posting");
      data.save()
        .then(item => {
          res.send("item saved to database");
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
        });
  })
  .use(parser.json())
  .use(parser.urlencoded({ extended: true }))
  .listen(PORT, () => {
    console.log("Server listening on port " + PORT);
  })
