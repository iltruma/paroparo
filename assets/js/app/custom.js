$(document).ready(function () {
    //Fancybox Feed
    $('[data-fancybox="images"]').fancybox({
        caption : function( instance, item ) {
        var caption = $(this).data('caption') || '';
        var permalink = $(this).data('permalink') || '';
        if ( item.type === 'image' ) {
            caption = '<h4 class=\"text-light\">' + (caption.length ? caption : '') + '</h6><p><a href="' + permalink + '">Link Instagram</a></p>' ;
        }
        return caption;
        }
  });

  //Leaflet Map
  if($('#mapid').length) {
    var mymap = L.map('mapid').setView([43.598508, 11.468536], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 13,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(mymap);

    var circle = L.circle([43.598508, 11.468536], {
        color: '#186e64',
        fillColor: '#186e64',
        fillOpacity: 0.3,
        radius: 2000
    }).addTo(mymap);
    circle.bindPopup('<div class="container"><div class="row"><div class="col-12"><h4>{{site.title}}</h4><p class="mt-0 mb-2">{{site.description | escape}}</p><h6 class="mb-0">Indirizzo</h6><address>{{site.address}}<br>{{site.city}}</address><a target="_blank" href="{{site.url}}">Sito Web</a></div></div></div>').openPopup();
  }

  //Pageclip form
  if($('#pageclip-form').length) {
      var form = $('#pageclip-form');
      Pageclip.form(form, {
        successTemplate: '<span>Grazie della richiesta!<span class="mdi mdi-heart"></span></span>'
      })
  }

  //Hightlight
  hljs.highlightAll();
});

