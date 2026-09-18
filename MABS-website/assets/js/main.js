// MABS site behaviour: header state, mobile nav, scroll reveal, contact form.
(function () {
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var scrim = document.querySelector('.nav-scrim');

  function setHeaderState() {
    if (!header) return;
    if (window.scrollY > 40 || header.dataset.alwaysSolid === 'true') {
      header.classList.add('is-solid');
    } else {
      header.classList.remove('is-solid');
    }
  }
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  function closeNav() {
    navToggle && navToggle.classList.remove('is-open');
    navLinks && navLinks.classList.remove('is-open');
    scrim && scrim.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var willOpen = !navLinks.classList.contains('is-open');
      navToggle.classList.toggle('is-open', willOpen);
      navLinks.classList.toggle('is-open', willOpen);
      scrim && scrim.classList.toggle('is-open', willOpen);
      document.body.style.overflow = willOpen ? 'hidden' : '';
    });
    scrim && scrim.addEventListener('click', closeNav);
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Contact form (static hosting — no backend yet; shows confirmation and
  // opens the visitor's email client with the enquiry pre-filled)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = data.get('name') || '';
      var company = data.get('company') || '';
      var phone = data.get('phone') || '';
      var email = data.get('email') || '';
      var service = data.get('service') || '';
      var message = data.get('message') || '';

      var body = [
        'Name: ' + name,
        'Company: ' + company,
        'Phone: ' + phone,
        'Email: ' + email,
        'Service required: ' + service,
        '',
        message
      ].join('\n');

      var mailLink = 'mailto:?subject=' + encodeURIComponent('Project enquiry — ' + name) +
        '&body=' + encodeURIComponent(body);

      var successBox = document.querySelector('.form-success');
      if (successBox) successBox.classList.add('is-visible');
      form.reset();
      window.location.href = mailLink;
    });
  }
})();
