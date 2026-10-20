'use strict';
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    nav.classList.toggle('is-open', !isOpen);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();
const form = document.getElementById('contact-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  // Configure the actual commercial inbox before publishing.
  const recipient = 'CONTATO@SEU-DOMINIO.COM.BR';
  if (recipient.includes('SEU-DOMINIO')) {
    alert('Antes de publicar, configure o e-mail comercial no arquivo script.js, na variável recipient.');
    return;
  }
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const company = String(data.get('company') || '').trim();
  const message = String(data.get('message') || '').trim();
  const subject = encodeURIComponent(`Contato pelo site Workflash — ${company || name}`);
  const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\nEmpresa: ${company || 'Não informada'}\n\nDesafio:\n${message}`);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});
