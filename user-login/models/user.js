const mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost:27017/UserLogin')

//var db = mongoose.connection()

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    }
})

var User = module.exports = mongoose.model('User', UserSchema)
module.exports.createUser = (newUser, cb) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash
            newUser.save(cb)
        });
    });
}

module.exports.getUserById = (id, cb) => {
    User.findById(id, cb)
}

module.exports.getUserByUsername = (username, cb) => {
    var query = {username}
    User.findOne(query, cb)
}

module.exports.comparePassword = (candidatePassword, hash, cb) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        cb(null, isMatch)
    })
}