var express = require('express');
const passport=require('passport');
var LocalStrategy=require('passport-local').Strategy
const multer=require('multer');
var upload=multer({dest:'./uploads'})

var User = require('../models/user');

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


router.post('/login',
    passport.authenticate('local', {failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
    function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        req.flash('success','You are logged in')
        res.redirect('/');
    });


passport.serializeUser(function(user, done) {
    console.log("serialize")
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log("deserialize")
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});
passport.use(new LocalStrategy(function(username,password,done){
    console.log("localstrategy")
    User.getUserByUsername(username,function(err,user){
        if(err) throw err
        if(!user){
            console.log("No user")
            return done(null, false, {message:'Unknown User'})
        }


        User.comparePassword(password,user.password,function (err,isMatch) {
            if(err) return done(err)
            if(isMatch){
                console.log("Valid passw")
                return done(null, user)

            } else {
                console.log("Invalid passw")
                return done(null, false,{message: 'Invalid Password'})
            }
        })
    })
}))








module.exports=router




