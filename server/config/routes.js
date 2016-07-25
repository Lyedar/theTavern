/**
 * Routes for express app
 */
 var express = require('express');
 var _ = require('lodash');
 var path = require('path');
 var authController = require("../controllers/authController")
 var App = require(path.resolve(__dirname, '../../', 'public', 'assets', 'server.js'))['default'];
 var User=require("../models/userModel")
 var profileController = require('../controllers/profileController')

 module.exports = function(app, passport) {
  
  var multer  =   require('multer');
  
  var suffix = {
    'image/jpeg' : 'jpg',
    'image/png'  : 'png'
  }
  var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      console.log('file!', file)
      callback(null, __dirname +'/../../public');
    },
    filename: function (req, file, callback) {
      callback(null, `${file.fieldname}-${Date.now()}.${suffix[file.mimetype]}`);
    }
  });
  var upload = multer({ storage : storage}).single('userPhoto');
  app.get('/api/v1/photo', function(req,res){
    return res.json(req.file);
  });

  app.post('/api/v1/signup', passport.authenticate('local-signup', {
        successRedirect : '/api/v1/signup/true', // redirect to the secure profile section
        failureRedirect : '/api/v1/signup/false', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
      }));

  app.get('/api/v1/signup/:result',function(req, res){
    res.json({success: req.params.result})
  } )//write function her 

  app.post('/api/v1/login', passport.authenticate('local-login', {
        successRedirect : '/api/v1/login/true', // redirect to the secure profile section
        failureRedirect : '/api/v1/login/false', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
      }));

  app.get('/api/v1/login/:result',function(req, res){
    console.log("Login attempt Res: ", req.user)
    if(req.params.result=== 'true'){
    res.json({success: true, user: req.user.local})
    }else{
      res.json({success: false})
    }
  } )//write function her 

  app.get('/api/v1/user',function(req,res){
    res.json({user : _.get(req, 'user.username','none')});
  });

  app.get('/api/v1/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/api/v1/getuser', function(req,res){
    res.json(req.user)
  })

  app.get('/api/v1/getallusers', function(req,res){
    User.find({}, function(err, user){
      if(err) return console.error(err);
      res.writeHead(200 , {"Content-Type" : "text/JSON"})
      res.end(JSON.stringify(user));
    })
  })

  app.get('/api/v1/loggedin',function(req,res){
    if(req.isAuthenticated()){
      res.json({loggedIn : true})
    }else{
      res.json({loggedIn : false})
    }
  })

  
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.writeHead(403, {"Content-Type" : "text/JSON"});
    res.end(JSON.stringify({message : "You are not authorized for this action"}))
  }

  app.put('/api/v1/updateprofile', profileController.updateOne);
  app.post('/api/v1/createprofile', profileController.createOne);
  app.get('/api/v1/getprofile/:slug', profileController.retrieveOne);

  app.get('*', function (req, res, next) {
    App(req, res);
  });

};