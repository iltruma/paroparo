function initDarkToggleButton() {
  $mode = 'light'; //default
  $upc = window.localStorage.getItem('user-prefers-color');
  if ($upc !== null) {
    $mode = $upc;
  }
  toggleColorSchemeCss($mode);
}

// Update the toggle button based on current color scheme
function updateDarkToggleButton() {
  $mode = 'light'; //default
  
  // if on user prefers color then update stored value
  $upc = window.localStorage.getItem('user-prefers-color');
  if ($upc !== null) {
    $mode = $upc;
  } else {
    if (typeof document.body.getAttribute("data-color-scheme") === 'undefined') {
      $dark = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
      $mode = $dark ? 'dark' : 'light';
    } else {
      $mode = document.body.getAttribute("data-color-scheme");
    }
  }
  toggleColorSchemeCss($mode);
  autoThemeToggle(); //toggle theme automatically if is night
}

// function to toggle the css
function toggleColorSchemeCss($mode) {
  $dark = ($mode == 'dark') ? true : false;
  if(document.querySelector("#css-toggle-btn")) {
    document.querySelector("#css-toggle-btn").checked = $dark;
    document.querySelector("#css-dark").disabled= !$dark;
    document.body.setAttribute("data-color-scheme", $mode);
  }
  window.localStorage.setItem('user-prefers-color', $mode);
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

initDarkToggleButton();

document.addEventListener("DOMContentLoaded", function() {
  
  // Update on first load.
  updateDarkToggleButton();
  // and every time it changes on the web browser preferences
  if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",  function() { updateDarkToggleButton() });
  
  // toggle button click code
  document.querySelector("#css-toggle-btn").addEventListener("click", function() {
    // get current mode
    // don't use `.data("color-scheme")`, it doesn't refresh
    $mode = document.body.getAttribute("data-color-scheme");
    // by here we have the current mode, so swap it
    $mode = ($mode == 'dark') ? 'light' : 'dark';
    toggleColorSchemeCss($mode);
  });

});

