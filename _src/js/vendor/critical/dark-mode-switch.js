// (function() {
//   var darkSwitch = document.getElementById("darkSwitch");
//   if (darkSwitch) {
//     initTheme();
//     darkSwitch.addEventListener("change", function(event) {
//       resetTheme();
//     });
//     function initTheme() {
//       var darkThemeSelected =
//         localStorage.getItem("darkSwitch") !== null &&
//         localStorage.getItem("darkSwitch") === "dark";
//       darkSwitch.checked = darkThemeSelected;
//       darkThemeSelected
//         ? document.body.setAttribute("data-theme", "dark")
//         : document.body.removeAttribute("data-theme");
//     }
//     function resetTheme() {
//       if (darkSwitch.checked) {
//         document.body.setAttribute("data-theme", "dark");
//         localStorage.setItem("darkSwitch", "dark");
//       } else {
//         document.body.removeAttribute("data-theme");
//         localStorage.removeItem("darkSwitch");
//       }
//     }
//   }
// })();


$(document).ready(function(){


  // Color Scheme toggle botton

  // function to toggle the css
  function toggle_color_scheme_css($id, $mode) {
    $dark = ($mode == 'dark') ? true : false;
    $("#"+$id+"-dark").attr( "disabled", !$dark );
    $("body").attr( "data-color-scheme", ($dark ? "dark" : "light" ) );
  }

  // function to initialise the css
  function init_color_scheme_css($id, $mode) {
    $dark = ($mode == 'dark') ? true : false;
    toggle_color_scheme_css($id, $mode);
    setTimeout(function(){  // let the browser catch up
      $("#"+$id+"-dark").removeAttr("media");
    }, 100);
  }

  // toggle button click code
  $("#css-toggle-btn").bind("click", function() {
    // get current mode
    // don't use `.data("color-scheme")`, it doesn't refresh
    $mode = $("body").attr("data-color-scheme");
    // test if this is a first time click event, if so initialise the code
    if (typeof $mode === 'undefined') {
      // not defined yet - set pref. & ask the browser if alt. is active
      $mode = 'light';
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) $mode = 'dark';
      init_color_scheme_css("css", $mode);
    }
    // by here we have the current mode, so swap it
    $mode = ($mode == 'dark') ? 'light' : 'dark';
    toggle_color_scheme_css("css", $mode);
  });

});

