const {Pool} = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

express() 
  .set('view engine','ejs')
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
  .post('/person', function (req, res) {
    var info = req.body;
    if (!info.name || !info.preference || !info.email || !info.phone) {
      res.render('show_message', {
        message: "Invalid input", type: "error" });
    } else {
      var newPerson = new Person ({
        name = info.name,
        email = info.email,
        phone = info.phone,
        preference = info.preference
      });
      newPerson.save(function(err, Person) {
        if (err)
          res.render('show_message', {message: "Database error", type: "error"});
        else 
          res.render('show_message', {
            message: "New person added", type: "success", person: info
          });
      })
    }
  })