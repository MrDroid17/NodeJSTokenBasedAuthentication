
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




/*
start the server
*/
app.listen(port);
console.log('Magic happens at  http://localhost:' +port);
