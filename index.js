const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const uri = 'mongodb://vhdev:vandyhacks5@ds163650.mlab.com:63650/heroku_9d4txdmb';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(parser.urlencoded({ extended: true }))
app.use(parser.json())

mongoose.connect(uri);
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log("Database open");
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/form.html");
  console.log("Page loaded");
})

var hackerSchema = new mongoose.Schema({
  firstName: {type: String, max: 20},
  lastName: {type: String, max: 20},
  email: {type: String, max: 100},
  phone: {type: String, max: 15}
})
var Hacker = db.model("Hacker", hackerSchema);

app.post('/', (req, res) => {
  var data = new Hacker(req.body);
  data.save()
    .then(item => {
      res.send("Saved to database");
      console.log("Added one entry");
    })
    .catch(err => {
      res.send("Unable to save to database");
    })
})

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
})


