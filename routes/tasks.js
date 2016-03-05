var express = require('express');
var router = express.Router();

var Task = require('./../models/task.js');  //Specify models used
var User = require('./../models/user.js');


/** Create a middleware function. Check if user is logged in
or not. If so, continue, if not redirect back to home page. */
function isLoggedIn(req, res, next){

  if (req.isAuthenticated()) {
    return next();
  }

  //Not logged in? Redirect back to home page.
  res.redirect('/');
}

/** Oblige all routes in this file to use the isLoggedIn middleware. */
router.use(isLoggedIn);


/*** All incomplete tasks
 * Creates a list of all tasks which are not completed for THIS user*/
router.get('/', function(req, res, next){

  Task.find( { _creator : req.user._id , completed : false} , function(err, incomplete) {
    res.render('tasks', {
      title: 'Tasks to do',
      username: req.user.auth.username.toUpperCase(),
      tasks: incomplete || []
    });
  });
});


/*** Adds a new task.
 * Creates a new Task object, saves it to the database, then redirects to task list */
router.post('/addtask', function(req, res, next) {

  if (!req.body || !req.body.task_name) {
    return next(new Error('no data provided'));
  }

  //Create a new task by instantiating a Task object...
  var newTask = Task( {
    _creator : req.user._id,
    name : req.body.task_name,
    completed: false } );

  //Then call the save method to save it to the database. Note callback.
  newTask.save(function(err){
    if (err) {
      return next(err);
    }
    else {
      res.redirect('/tasks');
    }
  });
});


/**  Get all of the completed tasks for this user. */
router.get('/completed', function(req, res, next){

  Task.find({ '_creator' : req.user._id, completed : true}, function(err, completed) {
    if (err) {
      return next(err);
    }

    res.render('tasks_completed', {
      title: 'Completed',
      username: req.user.auth.username.toUpperCase(),
      tasks: completed || []
    });
  });
});


/**Set all tasks to completed, display empty tasklist */
router.post('/alldone', function(req, res, next) {

  Task.update({  '_creator' : req.user._id, 'completed' : false}, { $set: { 'completed' : true }}, { 'multi' : true }, function (err, result) {

    if (err) {
      return next(err);
    }

    req.user.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/tasks');
    })
  });
});


/**This gets called for any routes with url parameters e.g. DELETE and POST tasks/taskID
 This is really helpful because it provides a task object id as req.taskid
 Order matters here. This is beneath the other routes, but above routes which need the parameter.
 Otherwise it would be called for /tasks/completed which we don't want to do, since '/completed' isn't an id.
 */
router.param('task_id', function(req, res, next, taskId) {

  console.log("params being extracted from URL for " + taskId);

  req.taskid = taskId;
  return next();

  /* Alternatively, could fetch a task from the database
  and attach it to the req object. In the complete task method,
  would set req.task.completed = true and
  call the req.task.save method to update the db.
   */

});


/** Complete a task. POST to /tasks/task_id
 Set task with specific ID to completed = true  */
router.post('/:task_id', function(req, res, next) {

  if (!req.body.completed) {
    return next(new Error('body missing parameter?'))
  }

  Task.findByIdAndUpdate(req.taskid, {$set : {completed : true }}, function(err) {
     if (err) {
        return next(err);
     }
     res.redirect('/tasks')
  });

});


/** deleteTask
 Delete task with particular ID from database. This is called with AJAX */
router.delete('/:task_id', function(req, res, next) {

  Task.remove({ '_id' : req.taskid },  function(err) {
    if (err) {
      return next(error);
    }
    res.sendStatus(200); //send success to AJAX call.
  });
});



module.exports = router;
