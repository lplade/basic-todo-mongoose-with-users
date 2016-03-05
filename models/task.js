var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

//var User = require('./user');

var taskSchema = new Schema ({

  _creator : { type : ObjectId, ref : 'UserSchema'  },
  name: String,
  completed : Boolean
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;


