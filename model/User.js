var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const debug = require('debug');
var SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({
    username : { type: String, require: true},
    email: { type: String, unique: true, lowercase: true },
    password: String,
    phone: { type: String, sparse: true, required: false },
},{timestamps: true});

userSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            user.password = hash;
            next();
        });
    });
});




var User = mongoose.model('User', userSchema );


module.exports = User;
