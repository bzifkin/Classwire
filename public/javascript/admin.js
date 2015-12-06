/**
 * Created by nickdelfino on 12/5/15.
 */

$(document).ready(function(){

   $('.delete_content_btn').click(function(){
      var id = $(this).closest("tr").attr("id");
      console.log(id);
       $.ajax({
           type: "POST",
           url: '/deletereportedcontent',
           data: {messageId: id},
           success: function(data){
               if(data['success']){
                   $('#' + id).remove();
               }
           }
       });
   });


});