/**
 * Shahlan Mourad – Portfolio
 * All content is in index.html. This script only adds:
 *  - the active state in the navigation
 *  - sending the contact form without leaving the page
 *  - the "More on GitHub" list from data/github.json (built at deploy time)
 */
'use strict';

// Projects already shown as cards in index.html, so they are not listed twice
const FEATURED_REPOS = new Set(['Exarbete-2026', 'BooksApp', 'BankSystem', 'React-MusicgroupApp']);

/* ---------- Navigation: mark the section in view ---------- */
function initNavigation() {
  const links = [...document.querySelectorAll('.sidebar-link')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  // A section counts as active when it crosses the middle of the screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Contact form (FormSubmit) ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form || !status) return;

  const button = form.querySelector('button[type="submit"]');
  const buttonText = button.querySelector('.btn-text');

  const showStatus = (message, type) => {
    status.textContent = message;
    status.className = `form-status is-${type}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    button.disabled = true;
    buttonText.textContent = 'Sending…';
    showStatus('', 'info');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && String(result.success) === 'true') {
        form.reset();
        showStatus('Thank you! Your message has been sent.', 'success');
      } else {
        throw new Error(result.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showStatus('Something went wrong. Please try again or email me directly.', 'error');
    } finally {
      button.disabled = false;
      buttonText.textContent = 'Send message';
    }
  });
}

/* ---------- "More on GitHub" ---------- */
async function initMoreProjects() {
  const wrapper = document.getElementById('more-projects');
  const list = document.getElementById('more-projects-list');
  if (!wrapper || !list) return;

  try {
    const response = await fetch('data/github.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { projects = [] } = await response.json();

    const others = projects.filter((repo) => !FEATURED_REPOS.has(repo.name));
    if (others.length === 0) return;

    // Built with DOM methods (not innerHTML), so text from GitHub can never become HTML
    for (const repo of others) {
      const link = document.createElement('a');
      link.href = repo.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const name = document.createElement('strong');
      name.textContent = repo.name.replace(/[-_]/g, ' ');
      link.append(name);

      if (repo.description) {
        const description = document.createElement('span');
        description.textContent = repo.description;
        link.append(description);
      }

      if (repo.language) {
        const language = document.createElement('span');
        language.className = 'lang';
        language.textContent = repo.language;
        link.append(language);
      }

      const item = document.createElement('li');
      item.append(link);
      list.append(item);
    }

    wrapper.hidden = false;
  } catch (error) {
    // The section simply stays hidden; the "See all repositories" link is still there
    console.warn('Could not load data/github.json:', error);
  }
}

/* ---------- Footer year ---------- */
function initFooterYear() {
  const year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();
}

initNavigation();
initContactForm();
initMoreProjects();
initFooterYear();
