/**
 * ========================================
 * PORTFOLIO WEBSITE - MAIN JAVASCRIPT
 * ========================================
 * Author: Shahlan Mourad
 * Description: Main functionality for portfolio website including
 * navigation, dynamic content generation, and API integrations
 */

'use strict';

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

const SKILL_ICONS = {
  'C#': '<i class="fa-solid fa-code" style="color: var(--primary);"></i>',
  'HTML': '<i class="fab fa-html5" style="color: var(--primary);"></i>',
  'CSS': '<i class="fab fa-css3-alt" style="color: var(--primary);"></i>',
  'JavaScript': '<i class="fab fa-js" style="color: var(--primary);"></i>',
  'TypeScript': '<svg style="width:1.2em;height:1.2em;vertical-align:middle;fill:var(--primary);" viewBox="0 0 24 24"><path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v21A1.5 1.5 0 0 0 1.5 24h21a1.5 1.5 0 0 0 1.5-1.5v-21A1.5 1.5 0 0 0 22.5 0zm0 1.5h21a.001.001 0 0 1 .001.001v21a.001.001 0 0 1-.001.001h-21a.001.001 0 0 1-.001-.001v-21A.001.001 0 0 1 1.5 1.5zm3.75 6.75v1.5h3.75v10.5h1.5V9.75h3.75v-1.5zm7.5 0v1.5h3.75v10.5h1.5V9.75h3.75v-1.5z"/></svg>',
  'SCSS': '<i class="fab fa-sass" style="color: var(--primary);"></i>',
  '.NET': '<i class="fa-brands fa-microsoft" style="color: var(--primary);"></i>',
  'ASP.NET Core': '<i class="fa-brands fa-microsoft" style="color: var(--primary);"></i>',
  'Blazor': '<i class="fa-brands fa-microsoft" style="color: var(--primary);"></i>',
  'React': '<i class="fab fa-react" style="color: var(--primary);"></i>',
  'Angular': '<i class="fab fa-angular" style="color: var(--primary);"></i>',
  'Entity Framework Core': '<i class="fa-brands fa-microsoft" style="color: var(--primary);"></i>',
  'PostgreSQL': '<i class="fas fa-database" style="color: var(--primary);"></i>',
  'SQL Server': '<i class="fas fa-database" style="color: var(--primary);"></i>',
  'MongoDB': '<i class="fa-solid fa-leaf" style="color: var(--primary);"></i>',
  'SQLite': '<i class="fas fa-database" style="color: var(--primary);"></i>',
  'Azure': '<i class="fa-solid fa-cloud" style="color: var(--primary);"></i>',
  'Azure DevOps': '<i class="fa-solid fa-infinity" style="color: var(--primary);"></i>',
  'GitHub Actions': '<i class="fa-solid fa-gears" style="color: var(--primary);"></i>',
  'Git': '<i class="fab fa-git-alt" style="color: var(--primary);"></i>',
  'GitHub': '<i class="fab fa-github" style="color: var(--primary);"></i>',
  'Docker': '<i class="fab fa-docker" style="color: var(--primary);"></i>',
  'Claude': '<i class="fa-solid fa-robot" style="color: var(--primary);"></i>',
  'GitHub Copilot': '<i class="fa-solid fa-robot" style="color: var(--primary);"></i>'
};

// Escapes text from the GitHub API before it is put into HTML.
const escapeHtml = (text) => String(text ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

// Projects and languages come from data/github.json, which the deploy workflow
// builds with scripts/update-github-data.mjs. Loaded once and shared by
// Skills and Projects, so visitors never call the GitHub API themselves.
const GitHubData = {
  promise: null,
  load() {
    this.promise ??= fetch('data/github.json').then((response) => {
      if (!response.ok) throw new Error(`Could not load data/github.json: ${response.status}`);
      return response.json();
    });
    return this.promise;
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const DOM = {
  get: (id) => document.getElementById(id),
  create: (tag, classes) => {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    return el;
  },
  query: (selector) => document.querySelector(selector),
  queryAll: (selector) => document.querySelectorAll(selector)
};

// ==========================================
// LOADING ANIMATION MANAGER
// ==========================================

class LoadingManager {
  constructor() {
    this.createLoader();
  }

  createLoader() {
    const loader = DOM.create('div', 'page-loader');
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-logo">SM</div>
        <div class="loader-spinner"></div>
        <div class="loader-text">Loading Portfolio...</div>
      </div>
    `;
    document.body.prepend(loader);
    this.loader = loader;
  }

  hide() {
    this.loader.classList.add('hidden');
    setTimeout(() => this.loader.remove(), 500);
  }
}

// ==========================================
// 3D TILT EFFECTS MANAGER
// ==========================================

class TiltEffectManager {
  constructor() {
    this.init();
  }

  init() {
    // Apply to cards
    DOM.queryAll('.card').forEach(card => {
      this.addTiltEffect(card);
    });

    // Apply to profile image
    const profileImg = DOM.query('.profile-img-home');
    if (profileImg) {
      this.addTiltEffect(profileImg, 10);
    }
  }

  addTiltEffect(element, maxTilt = 15) {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * maxTilt;
      const rotateY = ((centerX - x) / centerX) * maxTilt;
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  }
}

// ==========================================
// ANIMATED SKILL BARS MANAGER
// ==========================================

class AnimatedSkillBars {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    // Create Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateSkillBar(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe skill bars when they're created
    this.observeSkillBars();
  }

  observeSkillBars() {
    // Use MutationObserver to watch for skill bars being added
    const skillsObserver = new MutationObserver(() => {
      DOM.queryAll('.skill-bar-fill').forEach(bar => {
        if (!bar.dataset.observed) {
          bar.dataset.observed = 'true';
          this.observer.observe(bar);
        }
      });
    });

    const skillsContainer = DOM.get('skills-content');
    if (skillsContainer) {
      skillsObserver.observe(skillsContainer, {
        childList: true,
        subtree: true
      });
    }
  }

  animateSkillBar(bar) {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 100);
  }

  // Animate number counter
  static animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value + '%';
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}

// ==========================================
// NAVIGATION MANAGER
// ==========================================

class NavigationManager {
  constructor() {
    this.sections = [
      { id: 'home', link: 'link-home' },
      { id: 'about', link: 'link-about' },
      { id: 'skills', link: 'link-skills' },
      { id: 'projects', link: 'link-projects' },
      { id: 'contact', link: 'link-contact' }
    ];
    this.scrollTimeout = null;
    this.init();
  }

  init() {
    this.setupSmoothScroll();
    this.setupScrollTracking();
    this.updateActiveLink();
  }

  calculateOffset() {
    const sidebar = DOM.query('.sidebar');
    return sidebar ? sidebar.offsetHeight / 2 : 100;
  }

  updateActiveLink() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let currentSection = null;

    this.sections.forEach(section => {
      const element = DOM.get(section.id);
      if (element) {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          currentSection = section.link;
        }
      }
    });

    this.sections.forEach(section => {
      const link = DOM.get(section.link);
      if (link) {
        link.classList.toggle('active', section.link === currentSection);
      }
    });
  }

  setupSmoothScroll() {
    DOM.queryAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = DOM.query(targetId);

        if (targetElement) {
          const offset = this.calculateOffset();
          const sectionHeight = targetElement.offsetHeight;
          const windowHeight = window.innerHeight;

          let targetPosition;
          if (targetId === '#about' || sectionHeight < windowHeight) {
            targetPosition = targetElement.offsetTop - ((windowHeight - sectionHeight) / 2);
          } else {
            targetPosition = targetElement.offsetTop - offset + 1;
          }

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupScrollTracking() {
    window.addEventListener('scroll', () => {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => this.updateActiveLink(), 50);
    }, { passive: true });
  }
}

// ==========================================
// CONTACT FORM HANDLER
// ==========================================

class ContactFormHandler {
  constructor() {
    this.form = DOM.get('contact-form');
    this.successMsg = DOM.get('contact-success');
    this.errorMsg = DOM.get('contact-error');
    this.init();
  }

  init() {
    if (this.form && this.successMsg) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      this.addInputAnimations();
    }
  }

  addInputAnimations() {
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focused');
      });
      input.addEventListener('blur', (e) => {
        if (!e.target.value) {
          e.target.parentElement.classList.remove('focused');
        }
      });
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.form);
    const button = this.form.querySelector('button[type="submit"]');
    this.errorMsg.classList.add('d-none');
    button.disabled = true;

    try {
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && String(result.success) === 'true') {
        this.showSuccess();
      } else {
        this.showError();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError();
    } finally {
      button.disabled = false;
    }
  }

  showSuccess() {
    this.form.reset();
    this.form.style.display = 'none';
    this.successMsg.classList.remove('d-none');

    setTimeout(() => {
      this.form.style.display = '';
      this.successMsg.classList.add('d-none');
    }, 3000);
  }

  showError() {
    this.errorMsg.classList.remove('d-none');
  }
}

// ==========================================
// DYNAMIC SECTION GENERATORS
// ==========================================

class SectionGenerator {
  static generateHome() {
    const contentArea = DOM.query('.content-wrap');
    if (!contentArea) return;

    const homeSection = DOM.create('section');
    homeSection.id = 'home';
    homeSection.className = 'section home-modern';

    homeSection.innerHTML = `
      <div class="row align-items-center home-row">
        <div class="col-md-7 text-start order-2 order-md-1 home-text-col">
          <h1 id="home-title" class="home-title mb-2">
            <span class="home-title-main">Hi! I'm Shahlan,</span><br>
            <span class="home-title-sub">.NET Developer</span>
          </h1>
          <p class="mb-4 home-desc">A .NET developer in Stockholm who turns complex requirements into efficient, scalable software with C#, ASP.NET Core and modern frontend frameworks.</p>
          <a href="#contact" class="btn btn-primary btn-lg home-connect-btn">Let's Connect</a>
        </div>
        <div class="col-md-5 d-flex justify-content-center align-items-center order-1 order-md-2">
          <div class="profile-img-glow-frame">
            <img src="https://github.com/Shahlan-Mourad.png" alt="Shahlan Mourad" class="profile-img-home">
          </div>
        </div>
      </div>
    `;

    const oldHome = DOM.get('home');
    if (oldHome) oldHome.remove();

    contentArea.prepend(homeSection);
  }

  static generateAbout() {
    const aboutSection = DOM.get('about');
    if (!aboutSection) return;

    aboutSection.innerHTML = `
      <div class="container about-container">
        <h2 id="about-title" class="about-title">About Me</h2>
        <h3 class="about-subtitle">
          I'm <span class="about-name">Shahlan Mourad</span>, <span class="about-role">.NET Developer</span>
        </h3>
        <p class="about-desc">
          I am a committed .NET developer with a strong interest in problem solving and modern software development.
          I do my best work in teams where I can use analytical thinking to turn complex requirements into
          efficient, scalable code. Before I moved into software, I spent several years leading teams and improving
          workflows in logistics, which taught me planning, responsibility and how to deliver every day.
        </p>
        <ul class="about-info">
          <li><span class="about-label">💼 Experience:</span> System Developer, Need2Code AB (2025–2026)</li>
          <li><span class="about-label">🎓 Education:</span> .NET Developer, Newton Vocational University (2026)</li>
          <li><span class="about-label">📍 Location:</span> Stockholm, Sweden</li>
          <li><span class="about-label">🌐 Languages:</span> Kurdish, Swedish, Arabic, English</li>
        </ul>
      </div>
    `;
  }
}

// ==========================================
// SKILLS SECTION MANAGER
// ==========================================

class SkillsManager {
  static async render() {
    const skillsContent = DOM.get('skills-content');
    if (!skillsContent) return;

    const skillGroups = [
      {
        title: 'Frameworks & Libraries',
        icon: '<i class="fa-solid fa-layer-group" style="color: var(--primary);"></i>',
        skills: ['.NET', 'ASP.NET Core', 'Entity Framework Core', 'Blazor', 'React', 'Angular']
      },
      {
        title: 'Databases',
        icon: '<i class="fas fa-database" style="color: var(--primary);"></i>',
        skills: ['PostgreSQL', 'SQL Server', 'SQLite', 'MongoDB']
      },
      {
        title: 'DevOps & Cloud',
        icon: '<i class="fa-solid fa-cloud" style="color: var(--primary);"></i>',
        skills: ['Azure', 'Azure DevOps', 'GitHub Actions', 'Docker']
      },
      {
        title: 'Tools & AI',
        icon: '<i class="fa-solid fa-screwdriver-wrench" style="color: var(--primary);"></i>',
        skills: ['Git', 'GitHub', 'GitHub Copilot', 'Claude']
      }
    ];

    let html = this.generateGitHubSkillsCard();
    html += skillGroups.map(group => this.generateSkillCard(group)).join('');

    skillsContent.innerHTML = `<div class="skills-cols">${html}</div>`;

    await this.updateGitHubSkills();
  }

  static generateGitHubSkillsCard() {
    return `
      <div class="card skill-card programming-languages-card">
        <div class="card-body">
          <h5 class="card-title">
            <i class="fa-solid fa-code" style="color: var(--primary);"></i> Programming Languages
          </h5>
          <div class="card-list-wrapper">
            <div class="skill-bar-group" id="github-skill-bars">
              <div>Loading skills from GitHub...</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static generateSkillCard(group) {
    return `
      <div class="card skill-card">
        <div class="card-body">
          <h5 class="card-title">${group.icon} ${group.title}</h5>
          <div class="card-list-wrapper">
            <ul class="list-unstyled mb-0">
              ${group.skills.map(skill => `
                <li class="skill-pill">
                  ${SKILL_ICONS[skill] || ''} 
                  <span class='skill-text'>${skill}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  static async updateGitHubSkills() {
    const container = DOM.get('github-skill-bars');
    if (!container) return;

    container.innerHTML = `
      <div class="d-flex flex-column align-items-center py-4">
        <div class="spinner-border text-warning mb-2" role="status" style="width:2.5rem;height:2.5rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div>Loading skills from GitHub...</div>
      </div>
    `;

    try {
      const { languages } = await GitHubData.load();

      const sorted = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      const total = sorted.reduce((sum, [_, bytes]) => sum + bytes, 0);

      container.innerHTML = '';

      sorted.forEach(([lang, bytes]) => {
        const percent = total ? Math.round((bytes / total) * 100) : 0;
        const item = DOM.create('div', 'skill-bar-item');
        const icon = SKILL_ICONS[lang] || '';

        item.innerHTML = `
          ${icon} <span class='skill-text'>${escapeHtml(lang)}</span>
          <div class="skill-bar">
            <div class="skill-bar-fill" style="width: ${percent}%;"></div>
          </div>
        `;

        container.appendChild(item);
      });

      if (sorted.length === 0) {
        container.innerHTML = '<div>No languages found on GitHub.</div>';
      }
    } catch (error) {
      console.error('Error fetching GitHub skills:', error);
      container.innerHTML = `
        <div class="d-flex flex-column align-items-center py-4">
          <i class="bi bi-exclamation-triangle text-danger mb-2" style="font-size:2rem;"></i>
          <div>Could not load skills from GitHub.</div>
        </div>
      `;
    }
  }
}

// ==========================================
// PROJECTS MANAGER
// ==========================================

class ProjectsManager {
  static async renderCarousel() {
    const swiperEl = DOM.get('projects-swiper');
    const wrapper = DOM.get('projects-swiper-wrapper');

    if (!swiperEl || !wrapper) return;

    wrapper.innerHTML = '<div class="loading-message">Loading projects from GitHub...</div>';

    try {
      const { projects: slidesData } = await GitHubData.load();

      wrapper.innerHTML = '';

      slidesData.forEach(repo => {
        const slide = DOM.create('div', 'swiper-slide');
        slide.style.background = 'radial-gradient(120% 100% at 50% 0%, #3a3a3a 0%, #232323 60%, #181818 100%)';

        slide.innerHTML = `
          <div>
            <h2>${escapeHtml(repo.name.replace(/[-_]/g, ' ')).toUpperCase()}</h2>
            ${repo.language ? `<span class="project-lang">${escapeHtml(repo.language)}</span>` : ''}
            ${repo.description ? `<p class="project-desc">${escapeHtml(repo.description)}</p>` : ''}
            <a class="coverflow-btn" href="${escapeHtml(repo.url)}" target="_blank" rel="noopener noreferrer">View code</a>
          </div>
        `;

        wrapper.appendChild(slide);
      });

      // Initialize Swiper
      new Swiper('#projects-swiper', {
        effect: 'coverflow',
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 48,
        grabCursor: true,
        simulateTouch: true,
        touchRatio: 1,
        touchAngle: 45,
        resistanceRatio: 0.65,
        longSwipesMs: 120,
        threshold: 5,
        coverflowEffect: {
          rotate: 24,
          stretch: 0,
          depth: 180,
          modifier: 1.3,
          slideShadows: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        loop: slidesData.length > 3,
        autoplay: false
      });
    } catch (error) {
      console.error('Error rendering projects:', error);
  wrapper.innerHTML = `
    <div class="error-message-container" style="
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      height: 100%; 
      min-height: 300px;
      gap: 1.5rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
    ">
      <i class="bi bi-exclamation-triangle" style="font-size: 3.5rem; color: var(--primary);"></i>
      <div style="color: var(--primary); font-size: 1.2rem; font-weight: 600; text-align: center;">Could not load projects from GitHub</div>
    </div>
  `;
    }
  }
}

// ==========================================
// FOOTER UTILITIES
// ==========================================

class FooterManager {
  static init() {
    const yearElement = DOM.get('footer-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }
}

// ==========================================
// MICRO-INTERACTIONS MANAGER
// ==========================================

class MicroInteractions {
  static init() {
    // Add ripple effect to buttons
    this.addRippleEffect();
    
    // Add hover sound effects (optional)
    //this.addHoverEffects();
    
    // Add cursor trail effect
    //this.addCursorTrail();
  }

  static addRippleEffect() {
    DOM.queryAll('.btn, .social-link, .sidebar-link').forEach(element => {
      element.addEventListener('click', function(e) {
        const ripple = DOM.create('span', 'ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple animation to stylesheet dynamically
    if (!document.querySelector('#ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  static addHoverEffects() {
    DOM.queryAll('.card, .btn, .social-link').forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      });
    });
  }

  static addCursorTrail() {
    // Subtle cursor trail effect
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateTrail() {
      trailX += (mouseX - trailX) * 0.1;
      trailY += (mouseY - trailY) * 0.1;

      const trail = DOM.query('.cursor-trail');
      if (trail) {
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
      }

      requestAnimationFrame(animateTrail);
    }

    // Create cursor trail element
    const trail = DOM.create('div', 'cursor-trail');
    trail.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent);
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.2s ease;
    `;
    document.body.appendChild(trail);
    animateTrail();
  }
}

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

class App {
  static async init() {
    // Show loading screen
    const loadingManager = new LoadingManager();

    // Generate dynamic sections
    SectionGenerator.generateHome();
    SectionGenerator.generateAbout();

    // Initialize all managers
    new NavigationManager();
    new ContactFormHandler();
    new AnimatedSkillBars();
    MicroInteractions.init();
    FooterManager.init();

    // Render the skill cards and projects. The cards are created right away;
    // GitHub data fills in afterwards, so the page does not wait for the API.
    const githubContent = Promise.all([
      SkillsManager.render(),
      ProjectsManager.renderCarousel()
    ]);
    new TiltEffectManager();

    // Show the page as soon as the static content is ready
    loadingManager.hide();

    await githubContent;
  }
}

// ==========================================
// START APPLICATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
