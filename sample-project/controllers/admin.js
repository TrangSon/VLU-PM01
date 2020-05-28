var express = require('express');
var router = express.Router();
// config mongodb
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://sonkk:pwd@clustersgp-tj3gl.mongodb.net/sproject";
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
router.get('/listcategory', (req, res) => {
  if (req.session.admin) {
    //res.render('../views/admin/listcategory.ejs');
    MongoClient.connect(uri, (err, conn) => {
      if (err) throw err;
      var db = conn.db("sproject");
      var query = {};
      db.collection("categories").find(query).toArray((err, result) => {
        if (err) throw err;
        res.render('../views/admin/listcategory.ejs', { cates: result });
        conn.close();
      });
    });
  } else {
    res.redirect('login');
  }
});
router.get('/addcategory', (req, res) => {
  if (req.session.admin) {
    res.render('../views/admin/addcategory.ejs');
  } else {
    res.redirect('login');
  }
});
router.post('/addcategory', (req, res) => {
  var cname = req.body.catname;
  MongoClient.connect(uri, (err, conn) => {
    if (err) throw err;
    var db = conn.db("sproject");
    var category = { name: cname };
    db.collection("categories").insertOne(category, (err, result) => {
      if (err) throw err;
      if (result.insertedCount > 0) {
        res.redirect('listcategory');
      } else {
        res.redirect('addcategory');
      }
      conn.close();
    });
  });
});
router.get('/deletecategory', (req, res) => {
  var id = req.query.id;
  //console.log(id); // for DEBUG
  MongoClient.connect(uri, (err, conn) => {
    if (err) throw err;
    var db = conn.db("sproject");
    var ObjectId = require('mongodb').ObjectId;
    var query = { _id: ObjectId(id) };
    db.collection("categories").deleteOne(query, (err, result) => {
      if (err) throw err;
      res.redirect('listcategory');
      conn.close();
    });
  });
});
module.exports = router;