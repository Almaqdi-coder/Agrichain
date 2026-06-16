/**
 * farmer.js — Function 3: Register Product Batch.
 * Maps to: BatchTracker.sol → registerBatch()
 */

function registerBatch() {
  const name     = document.getElementById('bat-name').value.trim();
  const variety  = document.getElementById('bat-variety').value;
  const harvest  = document.getElementById('bat-harvest').value;
  const location = document.getElementById('bat-location').value.trim();
  const weight   = document.getElementById('bat-weight').value;
  const gi       = document.getElementById('bat-gi').value.trim();
  const inputs   = document.getElementById('bat-inputs').value.trim();

  if (!name || !harvest || !location || !weight) {
    setAlert('alert-farmer', 'error', 'Please fill in Batch Name, Harvest Date, Location, and Weight.');
    return;
  }

  setAlert('alert-farmer', '');
  const txHash = fakeTxHash();
  const block  = fakeBlock();
  const id = 'BATCH-' + String(state.nextBatchId++).padStart(3, '0');

  const batch = { id, name, variety, harvest, location, weight: weight + ' kg', gi, inputs, txHash, block, stage: 'Farm Gate' };
  state.batches.push(batch);

  ['bat-name', 'bat-harvest', 'bat-location', 'bat-weight', 'bat-gi', 'bat-inputs']
    .forEach(eid => { document.getElementById(eid).value = ''; });

  renderBatchesTable();
  refreshDashboard('farmer');
  showBatchSummary(batch);
  toast('✅ ProductBatch registered on blockchain');
}

/** Vertical supply chain + batch details shown after registration */
function showBatchSummary(b) {
  const container = document.getElementById('batch-last-summary');
  if (!container) return;
  container.style.display = '';

  const stages = [
    { name: 'Input Supplier', detail: 'Inputs recorded & verified', done: true },
    { name: 'Farmer',         detail: `${b.name} registered on-chain`, done: true, active: true },
    { name: 'Certifier',      detail: 'Awaiting certification review', done: false },
    { name: 'Transporter',    detail: 'Not yet dispatched', done: false },
    { name: 'Retailer',       detail: 'Not yet received', done: false },
    { name: 'Consumer',       detail: 'QR not yet generated', done: false },
  ];

  const stagesHtml = stages.map((s, i) => {
    const cls = s.active ? 'active' : s.done ? 'done' : 'pending';
    const icon = s.active ? '▶' : s.done ? '✓' : (i + 1).toString();
    const connector = i < stages.length - 1
      ? `<div class="sc-connector ${s.done ? 'done' : ''}"></div>` : '';
    return `
      <div class="sc-stage ${cls}">
        <div class="sc-icon">${icon}</div>
        <div class="sc-info">
          <div class="sc-name">${s.name}</div>
          <div class="sc-detail">${s.detail}</div>
        </div>
      </div>${connector}`;
  }).join('');

  container.innerHTML = `
    <div class="card">
      <h2>📦 Batch Summary — ${b.id}</h2>
      <div class="grid-2">
        <div>
          <div class="kv-list">
            <div class="kv-row"><span class="kv-key">Batch ID</span>     <span class="kv-value">${b.id}</span></div>
            <div class="kv-row"><span class="kv-key">Product</span>      <span class="kv-value">${b.name}</span></div>
            <div class="kv-row"><span class="kv-key">Coffee Variety</span><span class="kv-value">${b.variety}</span></div>
            <div class="kv-row"><span class="kv-key">Weight</span>       <span class="kv-value">${b.weight}</span></div>
            <div class="kv-row"><span class="kv-key">Harvest Date</span> <span class="kv-value">${b.harvest}</span></div>
            <div class="kv-row"><span class="kv-key">Farm Location</span><span class="kv-value">${b.location}</span></div>
            ${b.gi ? `<div class="kv-row"><span class="kv-key">GI Region</span><span class="kv-value">${b.gi}</span></div>` : ''}
            <div class="kv-row"><span class="kv-key">Linked Inputs</span><span class="kv-value">${b.inputs || '—'}</span></div>
            <div class="kv-row"><span class="kv-key">Current Stage</span><span class="kv-value"><span class="badge badge-amber">Farm Gate</span></span></div>
          </div>
        </div>
        <div>
          <h3 style="font-size:.82rem;text-transform:uppercase;letter-spacing:.5px;color:#777;margin-bottom:12px;">Supply Chain Progress</h3>
          <div class="sc-vertical">${stagesHtml}</div>
        </div>
      </div>
      ${blockchainWidget(b.txHash, b.block)}
    </div>`;
}

function fillDemoFarmer() {
  document.getElementById('bat-name').value     = 'Highland Arabica Lot A';
  document.getElementById('bat-variety').value  = 'Arabica';
  document.getElementById('bat-harvest').value  = '2026-04-15';
  document.getElementById('bat-location').value = 'Cameron Highlands, MY';
  document.getElementById('bat-weight').value   = '200';
  document.getElementById('bat-gi').value       = 'Sabah GI Zone 3';
  document.getElementById('bat-inputs').value   = 'INP-001, INP-002';
}

function renderBatchesTable() {
  const tbody = document.getElementById('batches-tbody');
  const table = document.getElementById('batches-table');
  const empty = document.getElementById('batches-empty');
  if (!tbody) return;

  if (state.batches.length === 0) {
    table.style.display = 'none'; empty.style.display = ''; return;
  }
  table.style.display = ''; empty.style.display = 'none';
  tbody.innerHTML = state.batches.map(b => `
    <tr>
      <td><span class="badge badge-blue">${b.id}</span></td>
      <td>${b.name}</td>
      <td>${b.variety}</td>
      <td>${b.weight}</td>
      <td><span class="badge badge-amber">${b.stage}</span></td>
      <td class="hash">${shortHash(b.txHash)}</td>
    </tr>`).join('');
}
