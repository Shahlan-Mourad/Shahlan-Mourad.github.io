// Navigation mellan sektioner
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('d-none'));
  document.getElementById(sectionId).classList.remove('d-none');
}

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

// Kontaktformulär hanteras nu av Formsubmit.co
document.addEventListener('DOMContentLoaded', function() {
  loadProjects();
  // Sätter aktuellt år i footern
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

 