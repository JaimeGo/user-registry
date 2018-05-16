var mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const db=mongoose.connection;

const bcrypt=require('bcryptjs');


//User schema

var UserSchema=mongoose.Schema({
	username:{
		type:String,
		index:true
	},
	password:{
		type:String
	},
	email:{
		type:String
	},
	name:{
		type:String
	},
	profileimage:{
		type:String
	}
});

var User=module.exports=mongoose.model('User',UserSchema);

module.exports.createUser=function (newUser,callback) {
	bcrypt.genSalt(10,function (err,salt) {
		bcrypt.hash(newUser.password,salt,function(err,hash){
			newUser.password=hash;
			newUser.save(callback);
		});


	});


};

module.exports.getUserById=function (id, callback) {
    console.log("getUserById")
    User.findById(id,callback)
}

module.exports.getUserByUsername = function(username, callback){
    console.log("getUserByUsername")
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    console.log("comp", candidatePassword,hash)
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        callback(null, isMatch);
    });
}