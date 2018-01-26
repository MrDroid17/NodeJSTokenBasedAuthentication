
/***
* get the packages you need
*/

var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');
var morgan 		= require('morgan');
var mongoose 	= require('mongoose');


//require to create sign and verify token
var jwt = require('jsonwebtoken');

//get config file
var config = require('./config');

//get mongoose model
var User = require('./app/models/user');


//==============================
//configuration=================
//==============================

var port = process.env.PORT || 8080; // use to create sign and verify token
mongoose.connect(config.database); // use to connect database
app.set('superSecret', config.secret); //use secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

/*
Routes
*/
//basic routes

app.get('/setup', function(req, res){

	// create a sample user
	var kumar = new User({
		name : 'Sobhit Kumar',
		password : 'password',
		admin : true
		});

	//save the sample user

	kumar.save(function(err){
		if(err) throw err;

		console.log('User saved successfully');
		res.json({ success : true });
	});

});


//API Routes
	// get instance of router for api routes
	var apiRoutes = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)

	//route middleware to verify token

	// route to show a random message (GET http://localhost:8080/api/)

	apiRoutes.get('/', function(req, res){
		res.json({ message : "this is coolest API on the earth"});
	});

	// route to return all users (GET http://localhost:8080/api/users)
	apiRoutes.get('/users', function(req, res){
		User.find({}, function(err, users){
			res.json(users);
		});
	});

	// apply the routes to our application with the prefix /api
	app.use('/api', apiRoutes);






/*
start the server
*/
app.listen(port);
console.log('Magic happens at  http://localhost:' + port);
