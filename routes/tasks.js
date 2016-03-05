var express = require('express');
var router = express.Router();
//var isAuth = require('')   //module exports isLoggedIn?

var ObjectId = require('mongoose').Schema.Types.ObjectId;

var Task = require('./../models/task.js');  //Specify model used
var User = require('./../models/user.js')

/** Create a middleware function. Check if user is logged in
or not. If so, continue, if not redirect back to home page. */
function isLoggedIn(req, res, next){

  if (req.isAuthenticated()) {
    return next();
  }

  //Not logged in? Redirect back to home page.
  res.redirect('/');
}

//Oblige all task routes to use this middleware function and check if user is logged in.
router.use(isLoggedIn);


/*** All incomplete tasks
 * Creates a list of all tasks which are not completed FOR THIS USER*/
router.get('/', function(req, res, next){

  var incomplete = req.user.tasks.filter(function(task){
    return !task.completed;
  });

  console.log(incomplete);
  res.render('tasks', {
    title : 'Tasks to do',
    username : req.user.auth.username.toUpperCase(),
    tasks : incomplete || [] });

});


/***
 * Adds a new task to the database then redirects to task list */
router.post('/addtask', function(req, res, next) {

  if (!req.body || !req.body.task_name) {
    return next(new Error('no data provided'));
  }

  //Create a new task by instantiating a Task object...
  var newTask = Task( {
    _creator : new ObjectId(req.user._id),
    name : req.body.task_name,
    completed: false } );

  //Add it to this user's list of tasks...
  req.user.tasks.push(newTask);

  //Then call the save method to save it to the database. Note callback.
  req.user.save(function(err){
    if (err) {
      return next(err);
    } else {
      res.redirect('/tasks');
    }
  });
});


/**  Get all of the completed tasks for this user. */
router.get('/completed', function(req, res, next){

  var complete = req.user.tasks.filter(function(task){
    return task.completed;
  });

  res.render('tasks_completed', {
    title:'Completed',
    username : req.user.auth.username.toUpperCase(),
    tasks: complete || [] });

});


/**Set all tasks to completed, display empty tasklist */
router.post('/alldone', function(req, res, next){

  req.user.tasks.forEach(function(task){
    task.completed = true;
  });

  req.user.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/tasks');
  })

});


/**This gets called for any routes with url parameters e.g. DELETE and POST tasks/taskID
 This is really helpful because it provides a task object (_id, name, completed) as req.task
 Order matters here. This is beneath the other routes, but above routes which need the parameter.
 Otherwise it would be called for /tasks/completed which we don't want to do '/completed' isn't an id.
 */
router.param('task_id', function(req, res, next, taskId) {

  console.log("params being extracted from URL for " + taskId);

  req.taskid = taskId;

  User.find( { 'task._id' : taskId} , function (err, task) {
    if (err) {
      return next(err);
    }
    console.log('The task found is  ' + task);
    req.task = task;
    return next();

  });
});


/** Complete a task. POST to /tasks/task_id
 Set task with specific ID to completed = true  */
router.post('/:task_id', function(req, res, next) {

  if (!req.body.completed) {
    return next(new Error('body missing parameter?'))
  }

  console.log("complete task " + req.taskid);

  var taskToMarkComplete = req.user.tasks.find(function(task) {
    return task._id == req.taskid
  });

  taskToMarkComplete.completed = true;

  req.user.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/tasks');
  })
});


/** deleteTask
 Delete task with particular ID from database. This is called with AJAX */
router.delete('/:task_id', function(req, res, next) {

  req.user.tasks.id(req.taskid).remove();

  req.user.save(function(err) {
    if (err) {
      return next(error);
    }
    res.sendStatus(200); //send success to AJAX call.
  });
});



module.exports = router;
