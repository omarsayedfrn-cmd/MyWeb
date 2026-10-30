/* ── سولفر — أنيميشن كتابة العنوان الرئيسي بالكيبورد ─────────────────── */
(function () {
  'use strict';

  var title = document.querySelector('[data-type]');
  if (!title) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    title.classList.add('type-done');
    return;
  }

  var segments = [];
  var order = [];

  Array.prototype.forEach.call(title.childNodes, function (node) {
    var cls;
    if (node.nodeType === 3) {
      cls = null;
    } else if (node.nodeType === 1 && node.classList && node.classList.contains('lat')) {
      cls = 'lat';
    } else {
      return;
    }
    var text = node.textContent;
    if (!text.length) return;
    var seg = { cls: cls, full: text, shown: 0, node: document.createTextNode('') };
    var si = segments.push(seg) - 1;
    for (var i = 0; i < text.length; i++) order.push(si);
  });

  if (!segments.length) return;

  var caret = document.createElement('span');
  caret.className = 'type-caret';
  caret.setAttribute('aria-hidden', 'true');

  while (title.firstChild) title.removeChild(title.firstChild);
  segments.forEach(function (seg) {
    if (seg.cls) {
      var wrap = document.createElement('span');
      wrap.className = seg.cls;
      wrap.appendChild(seg.node);
      title.appendChild(wrap);
    } else {
      title.appendChild(seg.node);
    }
  });
  title.appendChild(caret);
  title.classList.add('type-live');

  var CHAR_MS = 45;
  var SPACE_MS = 90;
  var START_MS = 250;
  var idx = 0;

  function reveal() {
    if (idx >= order.length) {
      title.classList.add('type-done');
      caret.remove();
      return;
    }
    var seg = segments[order[idx]];
    seg.shown += 1;
    seg.node.textContent = seg.full.slice(0, seg.shown);
    var ch = seg.full.charAt(seg.shown - 1);
    idx += 1;
    window.setTimeout(reveal, ch === ' ' ? SPACE_MS : CHAR_MS);
  }

  window.setTimeout(reveal, START_MS);
})();
