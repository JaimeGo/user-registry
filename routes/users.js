var express = require('express');

var User = require('../models/user');

module.exports = function (upload) {
	var router = express.Router();

	/* GET users listing. */
	router.get('/register', function (req, res, next) {
		res.render('register', {title: 'Register'});
	});

	router.get('/login', function (req, res, next) {
		res.render('login', {title: 'Login'});
	});


	router.post('/register', upload.single('profileimage'), function (req, res, next) {
		var name = req.body.name;
		var email = req.body.email;
		var username = req.body.email;
		var password = req.body.password;
		var confirm_password = req.body.confirm_password;

		var profileimage;
		if (req.file) {
			console.log('Uploading file...');
			profileimage = req.file.filename;
		} else {
			console.log('No File Uploaded...');
			profileimage = 'noimage.jpg';
		}

		//Validator
		req.checkBody('name', 'Name field is required').notEmpty();
		req.checkBody('email', 'Email field is required').notEmpty();
		req.checkBody('email', 'Email is valid').isEmail();
		req.checkBody('password', 'Passwordfield is required').notEmpty();
		req.checkBody('confirm_password', 'Passwords do not match').equals(req.body.password);

		//Check Errors
		var errors = req.validationErrors();

		if (errors) {
			res.render('register', {errors});

		} else {
			var newUser = new User({
				name,
				email,
				username,
				password,
				profileimage
			});

			User.createUser(newUser, function (err, user) {
				if (err) throw err;
				console.log(user);

			});

			req.flash('success', 'You are now registered');
			res.location('/');
			res.redirect('/');
		}

	});


	router.post('/login', function (req, res, next) {

		var username = req.body.username;
		var password = req.body.password;


		//Validator

		req.checkBody('username', 'Username field is required').notEmpty();
		req.checkBody('password', 'Passwordfield is required').notEmpty();

		//Check Errors
		var errors = req.validationErrors();

		if (errors) {
			console.log('Errors', errors);

		} else {
			console.log('No errors');
		}

	});

	return router;
};




