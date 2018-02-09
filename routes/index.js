var express = require('express');
var User = require('../models/user');

var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('auth', { title: 'Log In' });
});


router.post('/auth/login', function(req, res) { 
  User.findOne({email:req.body.email},function (err, user) {
    if(err) return res.redirect('/auth');
    if(user == null) return res.render("auth", { title: 'auth',incorrectpass: false,
                          notfound: true, emailtaken: false});
    if(user.password != req.body.password) return res.render("auth", { title: 'auth',incorrectpass: true,
                                    notfound: false, emailtaken: false});
      if(user != null && user.password == req.body.password){
        req.session.user = user;
        return res.redirect("/admin");
    }
  });
});

router.post('/auth/register', function(req, res, next) {
	User.findOne({email:req.body.email},function (err, user) {
		if(user!=null)return res.render("auth", { title: 'auth',incorrectpass: false,
												notfound: false, emailtaken: true});
		var newuser = new User({ email: req.body.email , password:req.body.password, username:req.body.username });
		newuser.save(function (err, user) {
			if (err) return console.error(err);
    });
    req.session.user = user;
		res.redirect("/admin");
	});
});

router.get('/logout', function(req, res) {
	req.session.reset();
	res.redirect('/');
});

module.exports = router;
