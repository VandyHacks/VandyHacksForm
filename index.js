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

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
})

app.use('/', (req, res, next) => {
  res.sendFile(__dirname + "/form.html");
  next();
})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  var hackerSchema = new mongoose.Schema({
    firstName: {type: String, max: 20},
    lastName: {type: String, max: 20},
    email: {type: String, max: 50},
    phone: {type: String, max: 15}
  })
  var Hacker = db.model("Hacker", hackerSchema);
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




