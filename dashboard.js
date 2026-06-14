/**
 * Smart Sachivalayam Portal - Staff Dashboard
 * CRUD operations for notices and announcements
 */

let editingNoticeId = null;

/**
 * Protect dashboard - redirect if not authenticated
 */
function protectDashboard() {
  const session = window.SachivalayamAuth?.isAuthenticated();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

/**
 * Initialize dashboard navigation sections
 */
function initDashboardNav() {
  const navLinks = document.querySelectorAll('[data-section]');
  const sections = document.querySelectorAll('.dashboard-section');
  const mobileBtns = document.querySelectorAll('.mobile-dash-nav button');

  function showSection(sectionId) {
    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));
    mobileBtns.forEach(b => b.classList.remove('active'));

    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');

    document.querySelectorAll(`[data-section="${sectionId}"]`).forEach(el => {
      el.classList.add('active');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  mobileBtns.forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });
}

/**
 * Update dashboard statistics
 */
function updateStats() {
  const notices = window.SachivalayamStorage.getNotices();
  const totalEl = document.getElementById('statTotal');
  const noticeEl = document.getElementById('statNotices');
  const announceEl = document.getElementById('statAnnouncements');

  if (totalEl) totalEl.textContent = notices.length;
  if (noticeEl) noticeEl.textContent = notices.filter(n => n.type === 'notice').length;
  if (announceEl) announceEl.textContent = notices.filter(n => n.type === 'announcement').length;
}

/**
 * Render announcements-only table
 */
function renderAnnouncementsTable() {
  const tbody = document.getElementById('announcementTableBody');
  if (!tbody) return;

  const announcements = window.SachivalayamStorage.getNotices()
    .filter(n => n.type === 'announcement')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (announcements.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; color: var(--text-muted); padding: 2rem;">
          No announcements yet. Add one with type "Announcement".
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = announcements.map(notice => `
    <tr>
      <td>${window.SachivalayamStorage.formatDate(notice.date)}</td>
      <td>${escapeHtml(notice.title)}</td>
      <td>${escapeHtml(notice.description.substring(0, 80))}${notice.description.length > 80 ? '...' : ''}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-outline btn-sm edit-btn" data-id="${notice.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${notice.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn.dataset.id));
  });

  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => confirmDelete(btn.dataset.id));
  });
}

/**
 * Render notices table in dashboard
 */
function renderDashboardTable() {
  const tbody = document.getElementById('noticeTableBody');
  if (!tbody) return;

  const notices = window.SachivalayamStorage.getNotices()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (notices.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color: var(--text-muted); padding: 2rem;">
          No notices yet. Add your first notice above.
        </td>
      </tr>
    `;
    renderAnnouncementsTable();
    return;
  }

  tbody.innerHTML = notices.map(notice => `
    <tr>
      <td>${window.SachivalayamStorage.formatDate(notice.date)}</td>
      <td>${escapeHtml(notice.title)}</td>
      <td>${escapeHtml(notice.type)}</td>
      <td>${escapeHtml(notice.description.substring(0, 60))}${notice.description.length > 60 ? '...' : ''}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-outline btn-sm edit-btn" data-id="${notice.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${notice.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  /* Bind edit/delete handlers */
  tbody.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn.dataset.id));
  });

  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => confirmDelete(btn.dataset.id));
  });

  renderAnnouncementsTable();
}

/**
 * Validate notice form
 */
function validateNoticeForm(title, description, date, type) {
  let valid = true;
  const fields = [
    { el: document.getElementById('noticeTitle'), err: document.getElementById('titleError'), check: () => title.trim().length >= 3, msg: 'Title must be at least 3 characters.' },
    { el: document.getElementById('noticeDescription'), err: document.getElementById('descError'), check: () => description.trim().length >= 10, msg: 'Description must be at least 10 characters.' },
    { el: document.getElementById('noticeDate'), err: document.getElementById('dateError'), check: () => date.trim() !== '', msg: 'Date is required.' },
    { el: document.getElementById('noticeType'), err: document.getElementById('typeError'), check: () => type !== '', msg: 'Please select a type.' }
  ];

  fields.forEach(({ el, err, check, msg }) => {
    el?.classList.remove('error');
    err?.classList.remove('show');
    if (!check()) {
      el?.classList.add('error');
      if (err) { err.textContent = msg; err.classList.add('show'); }
      valid = false;
    }
  });

  return valid;
}

/**
 * Handle add notice form submission
 */
function initAddNoticeForm() {
  const form = document.getElementById('addNoticeForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('noticeTitle').value;
    const description = document.getElementById('noticeDescription').value;
    const date = document.getElementById('noticeDate').value;
    const type = document.getElementById('noticeType').value;

    if (!validateNoticeForm(title, description, date, type)) return;

    const notices = window.SachivalayamStorage.getNotices();
    notices.push({
      id: window.SachivalayamStorage.generateId(),
      title: title.trim(),
      description: description.trim(),
      date,
      type
    });

    window.SachivalayamStorage.saveNotices(notices);
    form.reset();
    showToast('Notice added successfully!');
    updateStats();
    renderDashboardTable();
    renderAnnouncementsTable();
  });
}

/**
 * Open edit modal with notice data
 */
function openEditModal(id) {
  const notices = window.SachivalayamStorage.getNotices();
  const notice = notices.find(n => n.id === id);
  if (!notice) return;

  editingNoticeId = id;
  document.getElementById('editTitle').value = notice.title;
  document.getElementById('editDescription').value = notice.description;
  document.getElementById('editDate').value = notice.date;
  document.getElementById('editType').value = notice.type;

  document.getElementById('editModal').classList.add('active');
}

/**
 * Save edited notice
 */
function initEditModal() {
  const modal = document.getElementById('editModal');
  const form = document.getElementById('editNoticeForm');
  const closeBtn = document.getElementById('closeEditModal');
  const cancelBtn = document.getElementById('cancelEdit');

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  cancelBtn?.addEventListener('click', () => modal.classList.remove('active'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;
    const date = document.getElementById('editDate').value;
    const type = document.getElementById('editType').value;

    if (!title.trim() || !description.trim() || !date || !type) {
      alert('Please fill all fields.');
      return;
    }

    const notices = window.SachivalayamStorage.getNotices();
    const index = notices.findIndex(n => n.id === editingNoticeId);
    if (index !== -1) {
      notices[index] = { ...notices[index], title: title.trim(), description: description.trim(), date, type };
      window.SachivalayamStorage.saveNotices(notices);
    }

    modal.classList.remove('active');
    editingNoticeId = null;
    showToast('Notice updated successfully!');
    updateStats();
    renderDashboardTable();
    renderAnnouncementsTable();
  });
}

/**
 * Confirm and delete notice
 */
function confirmDelete(id) {
  const notices = window.SachivalayamStorage.getNotices();
  const notice = notices.find(n => n.id === id);
  if (!notice) return;

  if (confirm(`Are you sure you want to delete "${notice.title}"?`)) {
    const updated = notices.filter(n => n.id !== id);
    window.SachivalayamStorage.saveNotices(updated);
    showToast('Notice deleted successfully!');
    updateStats();
    renderDashboardTable();
    renderAnnouncementsTable();
  }
}

/**
 * Simple toast notification
 */
function showToast(message) {
  let toast = document.getElementById('dashboardToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dashboardToast';
    toast.style.cssText = `
      position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
      background: var(--success); color: white; padding: 0.85rem 1.5rem;
      border-radius: 8px; font-weight: 600; z-index: 3000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2); transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Initialize dashboard
 */
document.addEventListener('DOMContentLoaded', () => {
  const session = protectDashboard();
  if (!session) return;

  const userDisplay = document.getElementById('staffUsername');
  if (userDisplay) userDisplay.textContent = session.username;

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    window.SachivalayamAuth.logout();
  });

  /* Set default date to today */
  const dateInput = document.getElementById('noticeDate');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  initDashboardNav();
  initAddNoticeForm();
  initEditModal();
  updateStats();
  renderDashboardTable();
  renderAnnouncementsTable();
});
