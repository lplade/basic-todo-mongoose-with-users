# basic-todo-mongoose-with-users

Two schemas, one for User and one for Task objects.  Task objects know who created them. 

Can create a nested design where a user has a list of Task objects, but since almost all of the DB interaction in this program is with Task objects, it's easier to be able to work with Task objects, rather than nested-inside-user-task-objects. [Nested arrays of objects seem to be a pain to deal with in MongoDB/Mongoose. Fetch only matching elements, updating one attribute of all matching elements... Please let me know if you know differently.]

