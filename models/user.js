var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var TaskSchema = require('./task').schema;

var userSchema = new Schema({
  auth : {
    username: String,
    password: String
  },
  tasks : [ TaskSchema ]

});


userSchema.methods.generateHash = function(password) {
  //Create salted hash of password by hashing plaintext password
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function(password) {
  //Hash entered password, compare with stored hash
  return bcrypt.compareSync(password, this.auth.password);
};

var User = mongoose.model('User', userSchema);


module.exports = User;