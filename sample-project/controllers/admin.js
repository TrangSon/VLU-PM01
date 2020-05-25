var express = require('express');
var router = express.Router();
// routes
router.get('/', (req, res) => {
  if (req.session.admin) {
    res.redirect('home');
  } else {
    res.redirect('login');
  }
});
router.get('/login', (req, res) => {
  res.render('../views/admin/login.ejs');
});
router.post('/login', (req, res) => {
  var uname = req.body.username;
  var pwd = req.body.password;
  var crypto = require('crypto');
  var pwdHashed = crypto.createHash('md5').update(pwd).digest('hex');
  // connect to mongodb
  var MongoClient = require('mongodb').MongoClient;
  var uri = "mongodb+srv://sonkk:pwd@clustersgp-tj3gl.mongodb.net/sproject";
  MongoClient.connect(uri, (err, conn) => {
    if (err) throw err;
    var db = conn.db("sproject");
    var query = { username: uname, password: pwdHashed };
    db.collection("admins").findOne(query, (err, result) => {
      if (err) throw err;
      if (result) {
        req.session.admin = result;
        res.redirect('home');
      } else {
        res.redirect('login');
      }
      conn.close();
    });
  });
});
router.get('/home', (req, res) => {
  if (req.session.admin) {
    res.render('../views/admin/home.ejs');
  } else {
    res.redirect('login');
  }
});
router.get('/logout', (req, res) => {
  delete req.session.admin;
  res.redirect('login');
});
module.exports = router;