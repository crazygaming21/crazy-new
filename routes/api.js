var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/book");


router.post('/fourhorseman', function(req, res) {
  const MongoClient = require('mongodb').MongoClient;
  const uri = "mongodb+srv://trayskyes8900:golu9079meena@gamechangers-8ifng.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true });
  const myquery = {username : req.body.username};
   client.connect(err => {
    const collection = client.db("test").collection("users");
    collection.deleteOne(myquery, function(err, obj) {
      if (err) throw err;
     res.send("User Key Deleted Successfully");
    client.close();
  });
});
});


router.post('/makekeynabeel', function(req, res) {
  if (!req.body.username || !req.body.password || !req.body.expireAt) {
    res.send("Please Pass All Required Fileds");
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      device_id :req.body.device_id,
      expireAt: req.body.expireAt
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: err});
      }
      res.send( "Successful Created New Key");
    });
  }
});

router.post('/signi23n', function(req, res) {
 User.findOne({
   username : req.body.username,
   device_id : req.body.device_id
  }, function(err, user) {

    if (err) throw err;
    
    if (!user) { res.status(401).send({success: false, msg: 'Authentication failed. User not found.'}); } 
  
    else 
    // check if password matches

    { user.comparePassword(req.body.password, function (err, isMatch) { if (isMatch && !err) {
        
      // if user is found and password is right create a token
     var token = jwt.sign(user.toJSON(), config.secret, { expiresIn: 604800 });
       // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.get('/signout', passport.authenticate('jwt', { session: false}), function(req, res) {
  req.logout();
  res.json({msg: 'Hello We are from Crazy Gaming Thanks for Purchasing our Antiban Application subscription'});
});

router.post('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    console.log(req.body);
    var newBook = new Book({
      isbn: req.body.isbn,
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher
    });

    newBook.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Save book failed.'});
      }
      res.json({success: true, msg: 'Successful created new book.'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Book.find(function (err, books) {
      if (err) return next(err);
      res.json({msg: 'https://crazy.sgp1.cdn.digitaloceanspaces.com/CGaming.zip'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/news', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Book.find(function (err, books) {
      if (err) return next(err);
      res.json({msg: 'hello user'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

 

 router.post('/getexpiretime', function(req,res){
 const MongoClient = require('mongodb').MongoClient;
  const uri = "mongodb+srv://trayskyes8900:golu9079meena@gamechangers-8ifng.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true });
 const myquery = {username: req.body.username};   
    client.connect(err => {
      const collection = client.db("test").collection("users");
      collection.findOne(myquery, function(err, doc) {
        if (err) throw err;
        var exp = JSON.stringify(doc);
        var strJSON = exp;
        var objJSON = eval("(function(){return " + strJSON + ";})()");
        res.json({ expTime : objJSON.expireAt});
        client.close();
 });  
 }); 
});


getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
