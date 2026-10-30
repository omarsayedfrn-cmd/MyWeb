/* ── سولفر — أنيميشن كتابة العنوان الرئيسي ───────────────────────────
   الكشف بالـ opacity فقط (مفيش تغيير في المحتوى) عشان مانسببش Layout Shift. */
(function () {
  'use strict';

  var title = document.querySelector('[data-type]');
  if (!title) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var segments = [];
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
    segments.push({ cls: cls, text: text });
  });

  if (!segments.length) return;

  var caret = document.createElement('span');
  caret.className = 'type-caret';
  caret.setAttribute('aria-hidden', 'true');

  var spans = [];
  while (title.firstChild) title.removeChild(title.firstChild);

  segments.forEach(function (seg) {
    var parent = title;
    if (seg.cls) {
      parent = document.createElement('span');
      parent.className = seg.cls;
      title.appendChild(parent);
    }
    for (var i = 0; i < seg.text.length; i++) {
      var ch = seg.text.charAt(i);
      if (ch === ' ') {
        parent.appendChild(document.createTextNode(' '));
        continue;
      }
      var span = document.createElement('span');
      span.className = 'tw';
      span.textContent = ch;
      parent.appendChild(span);
      spans.push(span);
    }
  });

  if (reduce) {
    title.classList.add('type-done');
    return;
  }

  title.appendChild(caret);
  title.classList.add('type-live');

  var CHAR_MS = 45;
  var START_MS = 250;
  var idx = 0;

  function reveal() {
    if (idx >= spans.length) {
      title.classList.add('type-done');
      caret.remove();
      return;
    }
    spans[idx].classList.add('on');
    idx += 1;
    window.setTimeout(reveal, CHAR_MS);
  }

  window.setTimeout(reveal, START_MS);
})();
