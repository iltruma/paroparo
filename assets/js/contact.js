(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    var data = new FormData(form);
    var value = function (name) {
      return String(data.get(name) || '').trim();
    };

    var name = value('nome');
    var email = value('email');
    var company = value('azienda');
    var phone = value('telefono');
    var message = value('contact-message');

    var lines = [
      'Nome: ' + name,
      'Email: ' + email,
      company ? 'Azienda: ' + company : null,
      phone ? 'Telefono: ' + phone : null,
      '',
      message
    ].filter(function (line) {
      return line !== null;
    });

    var subject = 'Messaggio dal sito Paroparo' + (name ? ' - ' + name : '');
    var emailAddress = form.dataset.email;
    try {
      emailAddress = decodeURIComponent(emailAddress);
    } catch (e) {}
    var href = 'mailto:' + emailAddress +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));

    var fallback = document.getElementById('contact-mailto-fallback');
    if (fallback) fallback.href = href;

    var feedback = document.getElementById('contact-form-feedback');
    if (feedback) feedback.hidden = false;

    window.location.href = href;
  });
})();
