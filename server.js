
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
apiRoutes.post('/authenticate', function(req, res){
	//find the user
    User.findOne({
        name : req.body.name
    }, function(err, user){
        if(err) throw err;
        // if user is not valid one
        if(!user){
            res.json({ success : false, message : 'Authentication Failed, User Not Found !!'});

            //if user is valid
        }else if(user){

            //if password is invalid
            if(user.password != req.body.password){
                res.json({
                    success : false, message : 'Authentication Failed, Wrong Password !!'});
            }else{
                
                /*** if user is found and password is right
                     * create a token with only our given payload
                     *we don't want to pass in the entire user since that has the password
                    */
                const payload = {
                    admin : user.admin
                };

                var token = jwt.sign(payload, app.get('superSecret'), {
                    //expiresInMinutes is deprecated instead use expiresIn : '24h'
                    expiresIn : '24h' //expires in 24 hours
                });

                //return the info including token as json

                res.json({
                    success : true,
                    message : 'Enjoy Your Token !!, Valid for 24 hours',
                    token : token
                });

            }

        }
    });
});




/***
 * route middleware to verify token
 */


apiRoutes.use(function(req, res, next){
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //decode token
    if(token){
        //verify secret and checks exps
        jwt.verify(token, app.get('superSecret'), function(err, decoded){
            if(err){
                return res.json({
                    success : false, message : 'Failed to authenticate token'
                });
            }else{
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    }else{
        /***
        * if there is no token return error 
		* The 403 (Forbidden) status code
        */
        return res.status(403).send({
            success : false,
            message : 'No Token Provided'
        });
    }
});
	



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
