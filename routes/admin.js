var express = require('express');
var chatsModel = require('../models/chat');
var tweetsModel = require('../models/tweets');
var userModel = require('../models/user');
var auth = require('../utils/auth');
var io = require('../io');

var router = express.Router();

router.use(auth.requireLogin)

router.get('/', function(req, res) {
    userModel.findById(req.user._id, function(err,user){
        var arrayfollowing = new Array();
        for(var i = 0; i < user.following.length; i++){
            arrayfollowing.push(user.following[i]);
        }
        arrayfollowing.push(String(req.user._id));
        tweetsModel.find({}, function(err,alltweets){
            res.render('home', { title: 'home',tweets:alltweets, username:req.user.username, userid:req.user._id, following: arrayfollowing});
  
        });
    });
});

router.get('/chat', function(req, res) {
    res.render('index', { title: 'Chat' });
});

router.get('/follow', function(req, res) {
    userModel.find({},function(err, allusers){
        res.render('following', { title: "following",users: allusers, selfid: req.user._id, following: req.user.following});
    });
});


router.patch('/:id', function(req, res) {
    userModel.findByIdAndUpdate(
        req.user._id, 
        {$push: {following: req.params.id.trim()} },
        function(err,user){}
    );
    res.send(req.params.id);
});


router.post('/tweet', function(req, res) {
    var current_date = new Date();
	var newtweet = new tweetsModel({content: req.body.content, date:Date(), userid:req.user._id, username:req.user.username});
	newtweet.save(function (err, tweet) {
        io.instance().emit("tweet", tweet);
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