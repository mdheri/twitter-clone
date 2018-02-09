var express = require('express');
var chatsModel = require('../models/chat');
var tweetsModel = require('../models/tweets');
var userModel = require('../models/user');
var auth = require('../utils/auth');

var router = express.Router();

var http = require('http').Server(router);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

router.use(auth.requireLogin)

router.get('/', function(req, res) {
    tweetsModel.find({}, function(err,alltweets){
        res.render('home', { title: 'home',tweets:alltweets, username:req.user.username, userid:req.user._id});
  });
});

router.get('/chat', function(req, res) {
    res.render('index', { title: 'Chat' });
});


router.post('/tweet', function(req, res) {
    var current_date = new Date();
	var newtweet = new tweetsModel({content: req.body.content, date:Date(), userid:req.user._id, username:req.user.username});
	newtweet.save(function (err, tweet) {
		res.send(tweet);
	});
});

router.patch('/tweet/:id', function(req, res) {
    tweetsModel.findById(req.params.id.trim(), function (err,tweet){
        tweetsModel.update({_id: req.params.id.trim()}, { $set: { likes:false }}, function (err, pages){
            if(err) return res.send(err);
        });


	});
});




module.exports = router;