const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT || 5000
const parser = require('body-parser');

express() 
  .set('view engine','ejs')
  .use('/', (req, res) => {
    res.sendFile(__dirname + "/form.html");
  })
  .get('/', (req, res) => res.render('pages/index'))
  .post("/add", (req, res) => {
      var data = new User(req.body);
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

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://kzhai:vandyhacks5@ds251819.mlab.com:51819/vh-walk-in-form");

var nameSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
})
var User = mongoose.model("User", nameSchema);
