(function () {
  var KEY = 'paroparo-theme';
  var darkLink = document.getElementById('css-dark');
  var toggle = document.getElementById('css-toggle-btn');

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function current() {
    return stored() || 'dark';
  }

  function apply(mode, persist) {
    var dark = mode === 'dark';

    if (darkLink) {
      darkLink.media = 'all';
      darkLink.disabled = !dark;
    }

    document.body.setAttribute('data-color-scheme', dark ? 'dark' : 'light');

    if (toggle) {
      toggle.checked = dark;
    }

    if (persist) {
      try {
        localStorage.setItem(KEY, dark ? 'dark' : 'light');
      } catch (e) {}
    }
  }

  // Used by the ParoNatale page to force dark without changing the preference.
  window.toggleColorSchemeCss = function (mode) {
    apply(mode, false);
  };

  apply(current(), false);

  document.addEventListener('DOMContentLoaded', function () {
    apply(current(), false);

    if (toggle) {
      toggle.addEventListener('click', function () {
        apply(current() === 'dark' ? 'light' : 'dark', true);
      });
    }
  });
})();
