const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000


express() 
  .set('view engine','ejs')
  .use('/', (req, res) => {
    res.sendFile(__dirname + "/form.html");
  })
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM table');
      res.render('pages/db', result);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })