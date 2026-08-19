const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const toast = document.querySelector('.toast');
const form = document.querySelector('.contact-form');
const serviceSelect = document.querySelector('#service');

const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('open');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 30);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}

let toastTimer;
const showToast = message => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
};

document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    if (serviceSelect) serviceSelect.value = button.dataset.service;
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    showToast(`${button.dataset.service} selected — complete the form below.`);
  });
});

form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  showToast('Demo enquiry received. Connect this form to your email or booking system before launch.');
  form.reset();
});

document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
