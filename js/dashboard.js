/**
 * dashboard.js — Statistics cards and recent activity feed for each role dashboard.
 */

/** Compute aggregate stats and render them into the stats grid for a given role */
function refreshDashboard(role) {
  const map = {
    admin:       renderAdminDashboard,
    supplier:    renderSupplierDashboard,
    farmer:      renderFarmerDashboard,
    certifier:   renderCertifierDashboard,
    transporter: renderTransporterDashboard,
    retailer:    renderRetailerDashboard,
  };
  map[role]?.();
}

/* ── Shared helpers ─────────────────────────────────────── */

function statsHtml(cards) {
  return cards.map(c => `
    <div class="stat-card ${c.color || ''}">
      <span class="stat-icon">${c.icon}</span>
      <div class="stat-val">${c.val}</div>
      <div class="stat-label">${c.label}</div>
    </div>`).join('');
}

function activityHtml(items) {
  if (!items.length) return '<p class="empty">No recent activity.</p>';
  return `<ul class="activity-feed">` + items.map(a => `
    <li class="activity-item">
      <div class="activity-dot ${a.color || ''}"></div>
      <span class="activity-text">${a.text}</span>
      <span class="activity-time">${a.time}</span>
    </li>`).join('') + `</ul>`;
}

function setStats(containerId, html)    { const el = document.getElementById(containerId); if (el) el.innerHTML = html; }
function setActivity(containerId, html) { const el = document.getElementById(containerId); if (el) el.innerHTML = html; }

/* ── Role dashboards ─────────────────────────────────────── */

function renderAdminDashboard() {
  setStats('admin-stats', statsHtml([
    { icon: '👥', val: state.users.length,   label: 'Registered Users',  color: '' },
    { icon: '📦', val: state.batches.length, label: 'Active Batches',    color: 'blue' },
    { icon: '📜', val: state.certs.length,   label: 'Certifications',    color: '' },
    { icon: '🌱', val: state.inputs.length,  label: 'Input Records',     color: '' },
  ]));
  setActivity('admin-activity', activityHtml([
    { text: 'Raj Kumar registered as Transporter', time: '2 hrs ago' },
    { text: 'Siti Nor Aisyah assigned Certifier role', time: '1 day ago' },
    { text: 'Ahmad Al-Rashidi registered as Farmer', time: '2 days ago' },
  ]));
}

function renderSupplierDashboard() {
  const compliant = state.inputs.filter(i => i.compliance === 'Compliant').length;
  setStats('supplier-stats', statsHtml([
    { icon: '🌱', val: state.inputs.length,    label: 'Inputs Recorded',    color: '' },
    { icon: '✅', val: compliant,               label: 'Compliant Inputs',   color: '' },
    { icon: '❌', val: state.inputs.length - compliant, label: 'Non-Compliant', color: 'red' },
    { icon: '📄', val: state.inputs.length,    label: 'IPFS Documents',     color: 'blue' },
  ]));
  setActivity('supplier-activity', activityHtml([
    { text: 'INP-003 Lime pH Adjuster — stored on-chain', time: '3 hrs ago' },
    { text: 'INP-002 Cow Manure — IPFS CID generated', time: '1 day ago' },
    { text: 'INP-001 BioGrow NPK — compliance verified', time: '2 days ago' },
  ]));
}

function renderFarmerDashboard() {
  const alerts = 2;
  setStats('farmer-stats', statsHtml([
    { icon: '📦', val: state.batches.length,  label: 'Batches Registered',  color: '' },
    { icon: '📜', val: state.certs.filter(c => state.batches.find(b => b.id === c.batchId)).length, label: 'Certified Batches', color: '' },
    { icon: '⚠️', val: alerts,                label: 'Sensor Alerts',       color: 'amber' },
    { icon: '🔗', val: state.inputs.length,   label: 'Linked Inputs',       color: 'blue' },
  ]));
  setActivity('farmer-activity', activityHtml([
    { text: 'BATCH-001 — Transit sensor reading logged', time: '30 min ago', color: '' },
    { text: 'BATCH-002 — Certification APPROVED ✓',     time: '4 hrs ago',  color: '' },
    { text: 'BATCH-001 — Registered on blockchain',     time: '2 days ago', color: '' },
    { text: 'Soil moisture alert — PLOT-07',             time: '3 days ago', color: 'amber' },
  ]));
}

function renderCertifierDashboard() {
  const active  = state.certs.filter(c => c.status === 'Active').length;
  const revoked = state.certs.filter(c => c.status === 'Revoked').length;
  setStats('certifier-stats', statsHtml([
    { icon: '📋', val: state.batches.length,  label: 'Batches Pending Review', color: '' },
    { icon: '✅', val: active,                 label: 'Active Certifications',  color: '' },
    { icon: '❌', val: revoked,                label: 'Revoked',                color: 'red' },
    { icon: '📄', val: state.certs.length,    label: 'IPFS Documents',         color: 'blue' },
  ]));
  setActivity('certifier-activity', activityHtml([
    { text: 'CERT-002 Fair Trade — issued for BATCH-002', time: '5 hrs ago' },
    { text: 'CERT-001 Organic — issued for BATCH-001',    time: '2 days ago' },
    { text: 'Input compliance check passed for INP-001',  time: '3 days ago' },
  ]));
}

function renderTransporterDashboard() {
  setStats('transporter-stats', statsHtml([
    { icon: '🚛', val: state.shipments.length,   label: 'Active Shipments',   color: '' },
    { icon: '📍', val: state.shipments.length,   label: 'GPS Logs Today',     color: 'blue' },
    { icon: '✅', val: state.receipts.length,    label: 'Delivered',          color: '' },
    { icon: '⚠️', val: 0,                        label: 'Threshold Alerts',   color: 'amber' },
  ]));
  setActivity('transporter-activity', activityHtml([
    { text: 'BATCH-001 — GPS updated: 3.8°N 101.6°E', time: '5 min ago' },
    { text: 'BATCH-001 — Temperature within threshold', time: '10 min ago' },
    { text: 'BATCH-001 — Pickup confirmed at farm gate', time: '6 hrs ago' },
  ]));
}

function renderRetailerDashboard() {
  setStats('retailer-stats', statsHtml([
    { icon: '📦', val: state.batches.length,   label: 'Batches in System',  color: '' },
    { icon: '✅', val: state.receipts.length,  label: 'Receipts Confirmed', color: '' },
    { icon: '📲', val: state.receipts.length,  label: 'QR Codes Generated', color: 'blue' },
    { icon: '🔍', val: state.verifications,    label: 'Consumer Scans',     color: '' },
  ]));
  setActivity('retailer-activity', activityHtml([
    { text: 'BATCH-002 — QR code scanned 12 times today', time: '1 hr ago' },
    { text: 'BATCH-001 — Receipt confirmed, QR generated', time: '2 days ago' },
  ]));
}
