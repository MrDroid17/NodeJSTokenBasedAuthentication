

// create an instance of mongoose and mongoose.Scheme

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//setting up mongoose model and pass it using module.exports

module.exports = mongoose.model('User', new Schema({
	name : String,
	password : String,
	admin : Boolean
}));
/*
module.exports = mongoose.model('User', new Schema({ 
    name: String, 
    password: String, 
    admin: Boolean 
}));

*/