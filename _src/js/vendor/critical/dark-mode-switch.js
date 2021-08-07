$(document).ready(function(){

  // Update the toggle button based on current color scheme
  function updateDarkToggleButton() {
    $mode = 'light'; //default
    if (typeof $("body").attr("data-color-scheme") === 'undefined') {
      $dark = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
      $mode = $dark ? 'dark' : 'light';
    } else {
      $mode = $("body").attr("data-color-scheme");
    }
    alert($mode);
    toggleColorSchemeCss($mode);
    autoThemeToggle(); //toggle theme automatically if is night
  }

  // Update on first load.
  updateDarkToggleButton();
  // and every time it changes on the web browser preferences
  if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",  function() { updateDarkToggleButton() });

  // function to toggle the css
  function toggleColorSchemeCss($mode) {
    $dark = ($mode == 'dark') ? true : false;
    $("#css-toggle-btn").prop( "checked", $dark );
    $("#css-dark").attr( "disabled", !$dark );
    $("body").attr("data-color-scheme", $mode);
  }

  function autoThemeToggle() {
    // Next time point of theme toggle
    var now = new Date();
    var toggleAt = new Date();
    var hours = now.getHours();
    var nightShift = hours >= 19 || hours <=7;

    if (nightShift) {
      if (hours > 7) {
        toggleAt.setDate(toggleAt.getDate() + 1);
      }
      toggleAt.setHours(7);
    } else {
      toggleAt.setHours(19);
    }

    toggleAt.setMinutes(0);
    toggleAt.setSeconds(0);
    toggleAt.setMilliseconds(0)

    var delay = toggleAt.getTime() - now.getTime();

    // auto toggle theme mode
    setTimeout(function() {
      toggleColorSchemeCss(nightShift ? 'dark' : 'light');
    }, delay);
  }

  // toggle button click code
  $("#css-toggle-btn").bind("click", function() {
    // get current mode
    // don't use `.data("color-scheme")`, it doesn't refresh
    $mode = $("body").attr("data-color-scheme");
    // by here we have the current mode, so swap it
    $mode = ($mode == 'dark') ? 'light' : 'dark';
    toggleColorSchemeCss($mode);
  });

});

