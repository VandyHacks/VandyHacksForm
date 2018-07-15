const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const parser = require('body-parser');

const uri = process.env.PROD_MONGODB;
const { check } = require('express-validator/check');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(helmet());
app.use(express.static('VandyHacksForm'));
app.use(express.static(`${__dirname}/scripts`));


mongoose.connect(uri);
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database open');
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/form.html`);
  console.log('Page loaded');
});

const hackerSchema = new mongoose.Schema({
  firstName: { type: String, max: 20 },
  lastName: { type: String, max: 20 },
  school: { type: String, max: 50 },
  email: { type: String, max: 100 },
  phone: { type: String, max: 15 },
});
const Hacker = db.model('Hacker', hackerSchema);
module.exports = Hacker;

app.post('/success', [
  check('firstName', 'Enter valid name')
    .isAlpha(),
  check('lastName', 'Enter valid name')
    .isAlpha(),
  check('school', 'Enter valid school')
    .isAlpha(),
  check('email', 'Enter valid email')
    .isEmail()
    .normalizeEmail(),
  check('phone', 'Enter valid phone number')
    .isMobilePhone(),
], (req, res) => {
  const data = new Hacker(req.body);
  data.save()
    .then(
      res.sendFile(`${__dirname}/submitted.html`),
      console.log('Added one entry'),
    )
    .catch(
      res.send('Unable to save to database'),
    );
});

app.post('/', (req, res) => {
  res.sendFile(`${__dirname}/form.html`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
