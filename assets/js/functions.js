jQuery( document ).ready(function() {
 
    $(window).scroll(function () {
      var $nav = $(".navbar");
      $nav.toggleClass('bg-primary', $(this).scrollTop() > $nav.height());
      $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    });

});

