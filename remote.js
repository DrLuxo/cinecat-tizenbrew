/* Personal TizenBrew module. Uses Cinecat's own TV navigation and player. */
(function () {
  'use strict';
  if (window.__cinecatRemoteInstalled) return;
  window.__cinecatRemoteInstalled = true;

  function samsungBack(event) {
    if (event.keyCode !== 10009 && event.key !== 'XF86Back') return;
    // Capture the Samsung Return key before it navigates out of the website.
    // Forward Escape to the site's existing TV-mode Back handler instead.
    event.preventDefault();
    event.stopImmediatePropagation();
    var mapped;
    try {
      mapped = new KeyboardEvent(event.type, {
        key: 'Escape', code: 'Escape', keyCode: 27, which: 27,
        bubbles: true, cancelable: true, repeat: !!event.repeat
      });
    } catch (error) {
      mapped = document.createEvent('Event');
      mapped.initEvent(event.type, true, true);
    }
    ['key', 'code', 'keyCode', 'which'].forEach(function (name) {
      var value = name === 'key' || name === 'code' ? 'Escape' : 27;
      if (mapped[name] !== value) {
        try { Object.defineProperty(mapped, name, { value: value }); } catch (error) {}
      }
    });
    (document.activeElement || document.body || document).dispatchEvent(mapped);
  }

  window.addEventListener('keydown', samsungBack, true);
  window.addEventListener('keyup', samsungBack, true);
}());
