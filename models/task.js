var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var taskSchema = new Schema ({

  name: String,
  completed : Boolean,

  /* A reference to the User object who created this task
   It is possible to populate this field with all of the
   details of the User object: look up the populate() function */

  _creator : { type : ObjectId, ref : 'User' }

});


var Task = mongoose.model('Task', taskSchema);

module.exports = Task;


