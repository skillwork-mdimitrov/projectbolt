$(document).ready(function(){
  $(".segmented label input[type=radio]").each(function(){
    $(this).on("change", function(){
      if($(this).is(":checked")){
        $(this).parent().siblings().each(function(){
          $(this).removeClass("checked");
        });
        $(this).parent().addClass("checked");
      }
    });
  });
});