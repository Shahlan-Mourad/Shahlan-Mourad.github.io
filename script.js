// Navigation mellan sektioner
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('d-none'));
  document.getElementById(sectionId).classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', function() {
  const sections = [
    {id: 'home', link: 'link-home'},
    {id: 'about', link: 'link-about'},
    {id: 'skills', link: 'link-skills'},
    {id: 'projects', link: 'link-projects'},
    {id: 'contact', link: 'link-contact'}
  ];

  // Beräkna offset baserat på sidebar och eventuell header
  function calculateOffset() {
    const sidebar = document.querySelector('.sidebar');
    return sidebar ? sidebar.offsetHeight / 2 : 100;
  }

  // Uppdatera aktiva länkar
  function updateActiveLink() {
    // const offset = calculateOffset();
    // const scrollPosition = window.scrollY + offset;
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let currentSection = null;

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          currentSection = section.link;
        }
      }
    });

    sections.forEach(section => {
      const link = document.getElementById(section.link);
      if (link) {
        link.classList.toggle('active', section.link === currentSection);
      }
    });
  }

  // Smidig scroll för navigering
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offset = calculateOffset();
        const sectionHeight = targetElement.offsetHeight;
        const windowHeight = window.innerHeight;

        let targetPosition;
        if (targetId === "#about") {
          // Scrolla så att mitten av about hamnar i mitten av fönstret
          targetPosition = targetElement.offsetTop - ((windowHeight - sectionHeight) / 2);
        } else if (sectionHeight < windowHeight) {
          // Centrera sektionen vertikalt
          targetPosition = targetElement.offsetTop - ((windowHeight - sectionHeight) / 2);
        } else {
          // Som tidigare, toppen av sektionen
          targetPosition = targetElement.offsetTop - offset + 1;
        }

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Optimera scroll-händelse
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveLink, 50);
  }, { passive: true });

  // Initiera första gången
  updateActiveLink();
});

// Dynamiskt skapa home-sektionen med unik bildklass och modern design
(function() {
  const contentArea = document.querySelector('.content-wrap');
  if (!contentArea) return;

  const homeSection = document.createElement('section');
  homeSection.id = 'home';
  homeSection.className = 'section home-modern';

  homeSection.innerHTML = `
    <div class="row align-items-center home-row">
      <div class="col-md-7 text-start order-2 order-md-1 home-text-col">
        <h1 class="home-title mb-2">
          <span class="home-title-main">Hi! I'm Shahlan,</span><br>
          <span class="home-title-sub">.NET Developer</span>
        </h1>
        <p class="mb-4 home-desc">I am a passionate .NET developer based in Stockholm, focused on building robust and scalable applications.</p>
        <a href="#contact" class="btn btn-primary btn-lg home-connect-btn">Let's Connect</a>
      </div>
      <div class="col-md-5 d-flex justify-content-center align-items-center order-1 order-md-2">
        <div class="profile-img-glow-frame">
          <img src="https://github.com/Shahlan-Mourad.png" alt="Shahlan Mourad" class="profile-img-home">
        </div>
      </div>
    </div>
  `;

  // Ta bort eventuell befintlig home-section
  const oldHome = document.getElementById('home');
  if (oldHome) oldHome.remove();

  contentArea.prepend(homeSection);
})();

// Dynamiskt skapa about-sektionen
(function() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;
  aboutSection.innerHTML = `
    <div class="row about-row align-items-center">
      <div class="col-md-5 about-img-col d-flex justify-content-center align-items-center">
        <img src="img/img1.png" alt="Shahlan Mourad" class="about-img">
      </div>
      <div class="col-md-7 about-text-col">
        <h2 class="about-title">About Me</h2>
        <h3 class="about-subtitle">
          I'm <span class="about-name">Shahlan Mourad</span>, <span class="about-role">.NET Developer</span>
        </h3>
        <p class="about-desc">
          I am a dedicated system developer with a strong focus on .NET technologies. I enjoy building robust and scalable applications, and I am always eager to learn new things and improve my skills. Currently, I am working on projects that enhance productivity and collaboration for remote teams.
        </p>
      </div>
      <ul class="about-info">
          <li><span class="about-label">⌛ Experience:</span> 1+ years</li>
          <li><span class="about-label">🟢 Availability:</span> 24/7</li>
          <li><span class="about-label">🎂 Age:</span> 27</li>
          <li><span class="about-label">💻 Language:</span> C#, .NET</li>
        </ul>
    </div>
  `;
})();

// Projektdata (alla projekt du nämnt)
const projects = [
  {
    name: 'BookApp',
    description: 'A web application for managing and browsing books.',
    link: 'https://github.com/Shahlan-Mourad/BooksApp',
    demo: '', // Lägg till demo-länk här senare om du vill
    image: 'https://raw.githubusercontent.com/Shahlan-Mourad/BookApp/main/preview.png'
  },
  {
    name: 'React-MusicgruppApp',
    description: 'A React app for managing music groups and bands.',
    link: 'https://github.com/Shahlan-Mourad/React-MusicgruppApp',
    demo: 'https://ambitious-mushroom-0ad423703.6.azurestaticapps.net/',
    image: 'https://raw.githubusercontent.com/Shahlan-Mourad/React-MusicgruppApp/main/preview.png'
  },
  {
    name: 'MusicApp',
    description: 'A music application for streaming and managing playlists.',
    link: 'https://github.com/Shahlan-Mourad/MusicApp',
    demo: '',
    image: 'https://raw.githubusercontent.com/Shahlan-Mourad/MusicApp/main/preview.png'
  },
  {
    name: 'BankSystem',
    description: 'A basic banking system project.',
    link: 'https://github.com/Shahlan-Mourad/BankSystem',
    demo: '',
    image: 'https://raw.githubusercontent.com/Shahlan-Mourad/BankSystem/main/preview.png'
  },
  {
    name: 'SearchPhoneNumber',
    description: 'A tool for searching phone numbers.',
    link: 'https://github.com/Shahlan-Mourad/SearchPhoneNumber',
    demo: '',
    image: 'https://raw.githubusercontent.com/Shahlan-Mourad/SearchPhoneNumber/main/preview.png'
  }
];

function loadProjects() {
  const container = document.getElementById('projects-list');
  container.innerHTML = '';
  projects.forEach(proj => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card h-100">
        <img src="${proj.image}" class="card-img-top" alt="${proj.name}" onerror="this.style.display='none'">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${proj.name}</h5>
          <p class="card-text flex-grow-1">${proj.description}</p>
          <div class="mt-auto pt-2 text-center">
            <a href="${proj.link}" class="btn btn-outline-primary btn-sm" target="_blank">GitHub</a>
            <a href="${proj.demo || '#'}" class="btn btn-primary btn-sm ms-2 ${!proj.demo ? 'disabled' : ''}" target="_blank">View</a>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// Kontaktformulär: visa tack-meddelande direkt på sidan
window.addEventListener('DOMContentLoaded', function() {
  loadProjects();
  // Sätter aktuellt år i footern
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Hantera tack-meddelande för kontaktformulär
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('contact-success');
  const iframe = document.getElementById('hidden_iframe');
  if (form && successMsg && iframe) {
    form.addEventListener('submit', function() {
      // Vänta på att iframen laddas (dvs. Formsubmit svarar)
      iframe.onload = function() {
        form.reset();
        form.style.display = 'none';
        successMsg.classList.remove('d-none');
      };
    });
  }
});





 