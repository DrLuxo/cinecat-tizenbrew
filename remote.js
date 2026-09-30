/* Personal TizenBrew module. Uses Cinecat's own TV navigation and player. */
(function () {
  'use strict';
  if (window.__cinecatRemoteInstalled) return;
  window.__cinecatRemoteInstalled = true;

  // The first-run chooser sits outside Cinecat's TV navigation system.
  // Handle only its two visible choices, leaving the TV page's keys alone.
  var selected = null;
  var heldKeys = {};
  var fresh = null;
  var classic = null;
  function connected(button) {
    return button && document.documentElement.contains(button);
  }
  function inspectButton(button) {
    var label = (button.textContent || '').replace(/\s+/g, ' ').trim();
    // Most buttons are catalogue cards: do not ask the layout engine about them.
    if (/^New\b/.test(label) && /refreshed/i.test(label)) fresh = button;
    if (/^Classic\b/.test(label) && /original layout/i.test(label)) classic = button;
  }
  function inspectTree(root) {
    if (root.nodeType === 3) root = root.parentElement;
    if (!root || root.nodeType !== 1) return;
    // Labels can arrive after their button, nested inside spans.
    var parent = root;
    while (parent && parent.nodeType === 1 && parent.tagName !== 'BUTTON') parent = parent.parentElement;
    if (parent) inspectButton(parent);
    if (root.tagName !== 'BUTTON') {
      var buttons = root.querySelectorAll('button');
      for (var i = 0; i < buttons.length; i++) inspectButton(buttons[i]);
    }
  }
  function choices() {
    if (!connected(fresh) || !connected(classic)) return [];
    if (fresh.disabled || classic.disabled) return [];
    return fresh.getClientRects().length && classic.getClientRects().length ? [fresh, classic] : [];
  }
  function installStyles() {
    if (!document.getElementById('cinecat-remote-style')) {
      var style = document.createElement('style');
      style.id = 'cinecat-remote-style';
      style.textContent = '[data-cinecat-remote-focus="true"] { outline: 5px solid #ffdc55 !important; outline-offset: 5px !important; }' +
        '.tv button { transition-duration: 0s !important; transition-delay: 0s !important; }';
      (document.head || document.documentElement).appendChild(style);
    }
  }
  function focusChoice(buttons, index) {
    installStyles();
    if (selected === buttons[index] && document.activeElement === selected) return;
    for (var i = 0; i < buttons.length; i++) {
      if (i === index) buttons[i].setAttribute('data-cinecat-remote-focus', 'true');
      else buttons[i].removeAttribute('data-cinecat-remote-focus');
    }
    selected = buttons[index];
    selected.focus();
  }
  function ensureChoiceFocus() {
    var buttons = choices();
    if (!buttons.length) { selected = null; return; }
    if (buttons.indexOf(document.activeElement) !== -1) {
      if (selected !== document.activeElement) focusChoice(buttons, buttons.indexOf(document.activeElement));
    } else focusChoice(buttons, Math.max(0, buttons.indexOf(selected)));
  }
  function chooserKey(event) {
    var key = event.keyCode || {ArrowLeft:37, ArrowUp:38, ArrowRight:39, ArrowDown:40, Enter:13}[event.key];
    if (event.type === 'keyup') {
      if (heldKeys[key]) {
        delete heldKeys[key];
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      return;
    }
    if ([13,37,38,39,40].indexOf(key) === -1) return;
    // An OK hold must not spill into the underlying TV page after choosing.
    if (key === 13 && heldKeys[key]) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    var buttons = choices();
    if (!buttons.length) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    heldKeys[key] = true;
    var index = buttons.indexOf(document.activeElement);
    if (index === -1) index = Math.max(0, buttons.indexOf(selected));
    if (key === 13) {
      if (!event.repeat) buttons[index].click();
    } else {
      focusChoice(buttons, key === 37 || key === 38 ? 0 : 1);
    }
  }
  window.addEventListener('keydown', chooserKey, true);
  window.addEventListener('keyup', chooserKey, true);
  window.addEventListener('blur', function () { heldKeys = {}; });
  // Discover once, then only examine newly inserted subtrees. No polling and
  // no full-page scans on keypresses or while a video is playing.
  function startDiscovery() {
    installStyles();
    inspectTree(document.documentElement);
    ensureChoiceFocus();
    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function (records) {
        if (!connected(fresh)) fresh = null;
        if (!connected(classic)) classic = null;
        if (fresh && classic) return;
        for (var i = 0; i < records.length; i++) {
          var nodes = records[i].addedNodes;
          for (var j = 0; j < nodes.length; j++) inspectTree(nodes[j]);
        }
        if (fresh && classic) ensureChoiceFocus();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }
  // TizenBrew can also inject into embedded players; the chooser is top-level.
  if (window.top === window.self) {
    if (document.documentElement) startDiscovery();
    else document.addEventListener('DOMContentLoaded', startDiscovery, { once: true });
  }

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
