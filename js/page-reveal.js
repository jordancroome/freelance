/**
 * Staggered load animations sitewide. Call applyPageReveal(container) after injecting HTML (e.g. case study).
 */
(function () {
  var STEP = 52;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mark(el, i) {
    if (!el || el.closest('#loader')) return;
    el.classList.add('pr-on-load');
    el.style.setProperty('--pr-delay', i * STEP + 'ms');
  }

  function collect() {
    var out = [];
    var seen = new Set();

    function add(el) {
      if (!el || seen.has(el)) return;
      seen.add(el);
      out.push(el);
    }

    var hasHero = !!document.getElementById('hero');
    var nav = document.querySelector('body > nav');
    if (nav && !hasHero) add(nav);

    var main = document.querySelector('main');
    if (main) {
      main.querySelectorAll(':scope > header, :scope > section').forEach(function (el) {
        if (el.id === 'contact-hero') {
          el.querySelectorAll(':scope > .contact-hero-left, :scope > .contact-hero-right').forEach(add);
        } else {
          add(el);
        }
      });
    }

    var about = document.getElementById('about');
    if (about) {
      about.querySelectorAll(':scope > div').forEach(add);
    }

    if (hasHero) {
      var mq = document.querySelector('.marquee-bar');
      if (mq) add(mq);
      document.querySelectorAll('body > section:not(#hero)').forEach(add);
    }

    var listPage = document.getElementById('work-list-page');
    var stack = document.getElementById('work-list-stack');
    var workIndexAwaitingList =
      listPage && !listPage.hidden && stack && stack.children.length === 0;
    if (listPage && listPage.hidden) {
      /* Case study route: list is hidden */
    } else if (workIndexAwaitingList) {
      /* /work index: projects load async — footer + list block in revealWorkListAfterInject */
    } else {
      document.querySelectorAll('.work-list-header').forEach(add);
      document.querySelectorAll('.work-list-item').forEach(add);
    }

    document.querySelectorAll('.project-error').forEach(add);

    if (!workIndexAwaitingList) {
      document.querySelectorAll('footer.site-footer').forEach(add);
    }

    document.querySelectorAll('.case-main > section, .case-main > .case-showcase-wrap, .case-main > .case-cta-row').forEach(function (el) {
      if (!seen.has(el)) add(el);
    });

    return out;
  }

  window.revealWorkListAfterInject = function () {
    if (reduce) return;
    var i = 0;
    document.querySelectorAll('.work-list-header, .work-list-item, footer.site-footer').forEach(function (el) {
      el.classList.remove('pr-on-load');
      el.style.removeProperty('--pr-delay');
    });
    void document.body.offsetWidth;
    document.querySelectorAll('.work-list-header').forEach(function (el) {
      mark(el, i++);
    });
    document.querySelectorAll('.work-list-item').forEach(function (el) {
      mark(el, i++);
    });
    document.querySelectorAll('footer.site-footer').forEach(function (el) {
      mark(el, i++);
    });
  };

  window.applyPageReveal = function (container) {
    if (reduce || !container) return;
    var kids = Array.prototype.slice.call(container.children);
    kids.forEach(function (el, i) {
      el.classList.remove('pr-on-load');
      el.style.removeProperty('--pr-delay');
    });
    void container.offsetWidth;
    kids.forEach(function (el, i) {
      mark(el, i);
    });
  };

  function run() {
    if (reduce) return;
    var items = collect();
    items.forEach(function (el, i) {
      mark(el, i);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  /* Homepage: hero copy after loader finishes */
  var loader = document.getElementById('loader');
  if (loader && !reduce) {
    loader.addEventListener(
      'transitionend',
      function (e) {
        if (e.propertyName !== 'opacity' || !loader.classList.contains('done')) return;
        var n = 0;
        var hc = document.querySelector('.hero-content');
        var hs = document.querySelector('.hero-scroll-hint');
        if (hc) {
          mark(hc, n++);
        }
        if (hs) {
          mark(hs, n);
        }
      },
      { once: true }
    );
  }
})();
