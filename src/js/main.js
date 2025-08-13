if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.querySelectorAll('.project-card__toggle-btn').forEach(btn => {
  const extraId = btn.getAttribute('aria-controls');
  const extra = document.getElementById(extraId);
  const card = btn.closest('.project-card');

  if (!extra) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    extra.hidden = open;
    card.classList.toggle('is-open', !open);
  });


  extra.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      btn.setAttribute('aria-expanded', 'false');
      extra.hidden = true;
      card.classList.remove('is-open');
      btn.focus();
    }
  });
});

const headerEl = document.querySelector('.header');
window.addEventListener('scroll', () => {
  headerEl.classList.toggle('header--scrolled', window.scrollY > 10);
}, { passive: true });

let lastY = window.scrollY;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const goingDown = y > lastY && y > 120;
  const goingUp = y < lastY;

  if (goingDown) {
    headerEl.classList.add('header--hidden');
  } else if (goingUp) {
    headerEl.classList.remove('header--hidden');
  }

  lastY = y;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });


const setHeaderH = () => {
  const h = headerEl.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--header-h', `${Math.round(h)}px`);
};
setHeaderH();
window.addEventListener('resize', setHeaderH);

(function () {
  const links = document.querySelectorAll('.nav__links a[href^="#"]');

  function readHeaderH() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--header-h').trim();
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : 0; 
  }

  links.forEach(link => {
    link.addEventListener('click', e => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      const headerH = readHeaderH();
      const y = target.getBoundingClientRect().top + window.pageYOffset - (headerH + 8);
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

(function () {
  const links = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  function setActive(id) {
    links.forEach(a => {
      const match = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', match);
      if (match) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function readHeaderH() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--header-h').trim();
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : 0;
  }

  let ticking = false;
  function onScroll() {
    const headerH = readHeaderH();
    const y = window.scrollY + headerH + 16;
    let current = sections[0]?.id;

    for (const sec of sections) {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (y >= top && y < bottom) {
        current = sec.id;
        break;
      }
    }
    setActive(current);
    ticking = false;
  }

  document.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });


  window.addEventListener('load', () => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        const headerH = readHeaderH();
        const y = target.getBoundingClientRect().top + window.pageYOffset - (headerH + 8);
        window.scrollTo({ top: y });
        setActive(target.id);
        return;
      }
    }
    if (sections[0]) setActive(sections[0].id);
  });
})();
