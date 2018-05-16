const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session=require('express-session');
const passport=require('passport');
const flash=require('connect-flash');
const mongo=require('mongodb');
const mongoose=require('mongoose');
const db=mongoose.connection;
const messages=require('express-messages');
const expressValidator=require('express-validator');
const bodyParser=require('body-parser')
const MongoStore = require('connect-mongo')(session);

mongoose.connect(process.env.MONGODB_URI);




const app = express();



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');



app.use(expressValidator());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
	res.locals.messages = messages(req, res);
	next();
});
app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(expressValidator({
	errorFormatter: function (param,msg,value) {
		var namespace=param.split('.')
			,root=namespace.shift()
			,formParam=root;

		while (namespace.length){
			formParam += '['+namespace.shift()+']';

		}
		return {
			param:formParam,
			msg:msg,
			value:value
		};

	}

}));




// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});




app.listen(process.env.PORT || 3000);

module.exports = app;
