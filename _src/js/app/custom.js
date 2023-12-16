$(document).ready(function () {
    //Fancybox Feed
    $('[data-fancybox="images"]').fancybox({
        caption : function( instance, item ) {
        var caption = $(this).data('caption') || '';
        var permalink = $(this).data('permalink') || '';
        if ( item.type === 'image' ) {
            caption = '<p class=\"h4 text-light\">' + (caption.length ? caption : '') + '</p><p><a href="' + permalink + '">Link Instagram</a></p>' ;
        }
        return caption;
        }
  });

  //Leaflet Map
  if($('#mapid').length) {
    var mymap = L.map('mapid').setView([43.598508, 11.468536], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 13,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'png',
      fillColor:  site.colors[0].primary
    }).addTo(mymap);

    var circle = L.circle([43.598508, 11.468536], {
        color: site.colors[0].primary,
        fillColor: site.colors[0].primary,
        fillOpacity: 0.3,
        radius: 2000
    }).addTo(mymap);
    circle.bindPopup('<div class="container"><div class="row"><div class="col-12"><h4>' + site.title + '</h4><p class="mt-0 mb-2">'
    + site.description + '</p><p class="h6 mb-0">Indirizzo</p><address>' + site.address + '<br>' + site.city + '</address><a target="_blank" href="/">Sito Web</a></div></div></div>').openPopup();
  }

  //Pageclip form
  if($('#pageclip-form').length) {
      var form = $('#pageclip-form');
      Pageclip.form(form, {
        successTemplate: '<span>Grazie della richiesta!<span class="mdi iconify" data-icon="mdi-heart"></span></span>'
      })
  }

  //Hightlight
  if(typeof hljs !== "undefined") {
    hljs.highlightAll();
  }

  $(window).scroll(function(){
    var btt_scroll_icon = $('.btt-scroll-icon');
    btt_scroll_icon.css('transform', "rotate(" + $(window).scrollTop()/4 + "deg)");
  });

  //Snowflakes
  if($('#paronatale2023').length) {
  particlesJS("particles-js", {"particles":{"number":{"value":246,"density":{"enable":true,"value_area":800}},"color":{"value":"#fff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5}},"opacity":{"value":0.5,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":6,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":500,"color":"#ffffff","opacity":0.4,"width":2},"move":{"enable":true,"speed":3,"direction":"bottom","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"bubble"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":4,"duration":0.3,"opacity":1,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});
  toggleColorSchemeCss("dark");
  }
});

