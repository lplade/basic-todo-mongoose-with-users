$(document).ready(function(){

  $('button.delete_task').click(function(){

    var taskID = $(this).attr("task_id");
    var deleteUrl = "/tasks/" + taskID ;

    //send ajax call to delete task
    $.ajax(
      { method:'delete',
        url : deleteUrl
      }
    ).done(function(){
      var selector = "#" + taskID;

      //Fade out, then remove item in callback.
      $(selector).fadeOut(function(){
        this.remove()
      });

    }).fail(function(){
      console.log("there was an error deleting " + taskID);
    });

  });

});
