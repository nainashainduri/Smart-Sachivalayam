/**
 * Smart Sachivalayam Portal - Main JavaScript
 * Handles navigation, loading, notices display, and shared utilities
 */

/* --- Local Storage Keys --- */
const STORAGE_KEYS = {
  NOTICES: 'sachivalayam_notices',
  AUTH: 'sachivalayam_auth'
};

/* --- Default Sample Notices --- */
const DEFAULT_NOTICES = [
  {
    id: '1',
    title: 'Pension Disbursement Schedule - June 2026',
    description: 'Old age pensions will be disbursed on 15th and 20th June 2026 at the Sachivalayam office between 10:00 AM and 4:00 PM. Beneficiaries are requested to carry their Aadhaar card and passbook.',
    date: '2026-06-01',
    type: 'announcement'
  },
  {
    id: '2',
    title: 'Ration Card Verification Drive',
    description: 'All ration card holders must complete biometric verification by 30th June 2026. Visit your nearest Sachivalayam with original documents. No verification may lead to temporary suspension.',
    date: '2026-05-28',
    type: 'notice'
  },
  {
    id: '3',
    title: 'Grievance Redressal Camp',
    description: 'A special grievance redressal camp will be held on 18th June 2026 from 9:00 AM to 5:00 PM. Citizens can register complaints related to certificates, pensions, and welfare schemes.',
    date: '2026-05-25',
    type: 'announcement'
  },
  {
    id: '4',
    title: 'Income Certificate Application - Online Facility',
    description: 'Citizens can now apply for Income Certificates through the Sachivalayam portal. Required documents: Aadhaar, address proof, and income declaration form. Processing time: 7 working days.',
    date: '2026-05-20',
    type: 'notice'
  },
  {
    id: '5',
    title: 'Holiday Notice - State Formation Day',
    description: 'The Sachivalayam office will remain closed on 2nd June 2026 on account of State Formation Day. Emergency services will be available through the helpline number.',
    date: '2026-05-18',
    type: 'notice'
  }
];

/* --- Notice Storage Utilities --- */
function getNotices() {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTICES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [...DEFAULT_NOTICES];
    }
  }
  /* Seed default notices on first visit */
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(DEFAULT_NOTICES));
  return [...DEFAULT_NOTICES];
}

function saveNotices(notices) {
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function formatDateParts(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return {
    day: date.getDate(),
    month: date.toLocaleDateString('en-IN', { month: 'short' })
  };
}

/* --- Loading Animation --- */
function initLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;

  window.addEventListener('load', () => {
    setTimeout(() => overlay.classList.add('hidden'), 600);
  });
}

/* --- Mobile Navigation --- */
function initNavigation() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('navMenu');
  const header = document.querySelector('.header');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });

    /* Close menu on link click */
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }

  /* Header scroll effect */
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* Active nav link based on current page */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --- Back to Top Button --- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Home Page Announcements --- */
function renderHomeAnnouncements() {
  const container = document.getElementById('homeAnnouncements');
  if (!container) return;

  const notices = getNotices()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  if (notices.length === 0) {
    container.innerHTML = '<p class="no-results">No announcements at this time.</p>';
    return;
  }

  container.innerHTML = notices.map(notice => {
    const parts = formatDateParts(notice.date);
    return `
      <article class="announcement-item">
        <div class="announcement-date">
          <span class="day">${parts.day}</span>
          <span class="month">${parts.month}</span>
        </div>
        <div class="announcement-content">
          <h4>${escapeHtml(notice.title)}</h4>
          <p>${escapeHtml(notice.description.substring(0, 120))}${notice.description.length > 120 ? '...' : ''}</p>
        </div>
      </article>
    `;
  }).join('');
}

/* --- Notice Board Page --- */
function renderNoticeBoard(searchQuery = '') {
  const container = document.getElementById('noticeList');
  if (!container) return;

  let notices = getNotices().sort((a, b) => new Date(b.date) - new Date(a.date));

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    notices = notices.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.description.toLowerCase().includes(query) ||
      n.type.toLowerCase().includes(query)
    );
  }

  if (notices.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <div class="icon">📋</div>
        <h3>No notices found</h3>
        <p>${searchQuery ? 'Try a different search term.' : 'Check back later for updates.'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = notices.map(notice => `
    <article class="notice-card">
      <div class="notice-card-header">
        <h3>${escapeHtml(notice.title)}</h3>
        <span class="notice-badge">${escapeHtml(notice.type)} · ${formatDate(notice.date)}</span>
      </div>
      <p>${escapeHtml(notice.description)}</p>
    </article>
  `).join('');
}

function initNoticeSearch() {
  const searchInput = document.getElementById('noticeSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    renderNoticeBoard(e.target.value);
  });
}

/* --- Contact Form Validation --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const phone = document.getElementById('contactPhone');
    const message = document.getElementById('contactMessage');
    const successMsg = document.getElementById('contactSuccess');

    let valid = true;

    /* Reset errors */
    [name, email, phone, message].forEach(field => {
      field.classList.remove('error');
      const errEl = field.parentElement.querySelector('.error-message');
      if (errEl) errEl.classList.remove('show');
    });

    if (!name.value.trim() || name.value.trim().length < 2) {
      showFieldError(name, 'Please enter your full name (min 2 characters).');
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email address.');
      valid = false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.value.trim())) {
      showFieldError(phone, 'Please enter a valid 10-digit mobile number.');
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      showFieldError(message, 'Message must be at least 10 characters.');
      valid = false;
    }

    if (valid) {
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.textContent = 'Thank you! Your message has been sent successfully. We will respond within 2 working days.';
      }
      form.reset();
      setTimeout(() => successMsg?.classList.remove('show'), 5000);
    }
  });
}

function showFieldError(field, message) {
  field.classList.add('error');
  const errEl = field.parentElement.querySelector('.error-message');
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add('show');
  }
}

/* --- HTML Escape Utility --- */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* --- Form Download Handlers --- */
function initFormDownloads() {
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const formName = btn.dataset.form;
      alert(`"${formName}" download will be available soon.\n\nFor now, please visit the Sachivalayam office to collect the physical form.`);
    });
  });
}

/* --- Initialize on DOM Ready --- */
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initNavigation();
  initBackToTop();
  renderHomeAnnouncements();
  renderNoticeBoard();
  initNoticeSearch();
  initContactForm();
  initFormDownloads();
});

/* --- Export for dashboard module --- */
if (typeof window !== 'undefined') {
  window.SachivalayamStorage = {
    getNotices,
    saveNotices,
    generateId,
    formatDate,
    STORAGE_KEYS
  };
}
