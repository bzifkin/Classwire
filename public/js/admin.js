/**
 * Created by nickdelfino on 12/5/15.
 */

$(document).ready(function(){

   $('.delete_content_btn').click(function(){
      var id = $(this).closest("tr").attr("id");

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

    $('.allow_content_btn').click(function(){
        var id = $(this).closest("tr").attr("id");

        $.ajax({
            type: "POST",
            url: '/allowreportedcontent',
            data: {messageId: id},
            success: function(data){
                if(data['success']){
                    $('#' + id).remove();
                }
            }
        });
    });


});