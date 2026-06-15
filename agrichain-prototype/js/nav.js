/**
 * nav.js — Screen and tab navigation.
 */

const ROLE_LABELS = {
  admin:       'Administrator',
  supplier:    'Input Supplier',
  farmer:      'Farmer',
  certifier:   'Certifier',
  transporter: 'Transporter',
  retailer:    'Retailer',
  consumer:    'Consumer',
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id)?.classList.add('active');

  const navRole    = document.getElementById('navRole');
  const navBack    = document.getElementById('navBack');
  const navArchBtn = document.getElementById('navArchBtn');

  if (id === 'landing' || id === 'home') {
    navRole.style.display    = 'none';
    navBack.style.display    = 'none';
    navArchBtn.style.display = id === 'home' ? '' : 'none';
    state.role = null;
  } else if (id === 'architecture') {
    navArchBtn.style.display = 'none';
  } else {
    navBack.style.display    = '';
    navArchBtn.style.display = '';
  }
}

function selectRole(role) {
  state.role = role;
  document.getElementById('navRole').textContent   = ROLE_LABELS[role] || role;
  document.getElementById('navRole').style.display = '';
  document.getElementById('navBack').style.display = '';
  document.getElementById('navArchBtn').style.display = '';
  showScreen(role);

  if (role === 'farmer')      refreshSensors();
  if (role === 'transporter') refreshTransportSensors();
  renderAllTables();
  refreshDashboard(role);
}

function goHome() {
  showScreen('home');
}

function switchTab(clickedTab, tabId) {
  clickedTab.closest('.card').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  clickedTab.classList.add('active');
  const prefix = tabId.split('-')[0];
  document.querySelectorAll(`[id^="tab-${prefix}"]`).forEach(t => t.style.display = 'none');
  document.getElementById('tab-' + tabId).style.display = '';
}
