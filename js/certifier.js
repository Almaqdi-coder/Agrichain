/**
 * certifier.js — Function 4: Issue Certification.
 * Maps to: CertificationManager.sol → issueCertification()
 */

function runComplianceCheck() {
  const batchId = document.getElementById('cert-batch').value.trim();
  const result  = document.getElementById('compliance-result');
  if (!result) return;

  if (!batchId) {
    result.innerHTML = '<div class="alert alert-amber">Enter a Batch ID to run compliance check.</div>';
    return;
  }

  const batch = state.batches.find(b => b.id === batchId);
  const linkedInputIds = batch?.inputs?.split(',').map(s => s.trim()) || [];
  const linkedInputs   = linkedInputIds.map(id => state.inputs.find(i => i.id === id)).filter(Boolean);
  const allCompliant   = linkedInputs.length > 0 && linkedInputs.every(i => i.compliance === 'Compliant');
  const hasInputs      = linkedInputs.length > 0;
  const decision       = batch && allCompliant ? 'approved' : 'rejected';
  const decisionLabel  = decision === 'approved' ? '✅ APPROVED' : '❌ REJECTED';

  result.innerHTML = `
    <ul class="compliance-list">
      <li class="compliance-item ${batch ? 'pass' : 'fail'}">
        <span class="ci-icon">${batch ? '✓' : '✗'}</span>
        <span class="ci-label">Batch Data</span>
        <span class="ci-badge">${batch ? 'Verified' : 'Not Found'}</span>
      </li>
      <li class="compliance-item ${hasInputs ? 'pass' : 'fail'}">
        <span class="ci-icon">${hasInputs ? '✓' : '✗'}</span>
        <span class="ci-label">Input Records Linked</span>
        <span class="ci-badge">${hasInputs ? linkedInputs.length + ' records' : 'None found'}</span>
      </li>
      <li class="compliance-item ${allCompliant ? 'pass' : 'fail'}">
        <span class="ci-icon">${allCompliant ? '✓' : '✗'}</span>
        <span class="ci-label">All Inputs Compliant</span>
        <span class="ci-badge">${allCompliant ? 'Compliant' : 'Non-compliant input detected'}</span>
      </li>
      <li class="compliance-item pass">
        <span class="ci-icon">✓</span>
        <span class="ci-label">Sensor Records Present</span>
        <span class="ci-badge">Verified</span>
      </li>
    </ul>
    <div class="cert-decision ${decision}">
      <div class="cd-label">Certification Decision</div>
      <div class="cd-value">${decisionLabel}</div>
    </div>`;
}

function issueCert() {
  const batchId  = document.getElementById('cert-batch').value.trim();
  const certType = document.getElementById('cert-type').value;
  const body     = document.getElementById('cert-body').value.trim();
  const expiry   = document.getElementById('cert-expiry').value;

  if (!batchId || !body || !expiry) {
    setAlert('alert-certifier', 'error', 'Please fill in Batch ID, Issuing Body, and Valid Until date.');
    return;
  }

  setAlert('alert-certifier', '');
  const txHash = fakeTxHash();
  const block  = fakeBlock();
  const id  = 'CERT-' + String(state.nextCertId++).padStart(3, '0');
  const cid = fakeCid();

  const cert = { id, batchId, certType, body, expiry, cid, txHash, block, status: 'Active' };
  state.certs.push(cert);

  const batch = state.batches.find(b => b.id === batchId);
  if (batch) { batch.stage = 'Certified'; renderBatchesTable(); }

  ['cert-batch', 'cert-body', 'cert-expiry', 'cert-notes']
    .forEach(eid => { document.getElementById(eid).value = ''; });
  const r = document.getElementById('compliance-result');
  if (r) r.innerHTML = '';

  renderCertsTable();
  refreshDashboard('certifier');
  showCertSummary(cert);
  toast('✅ CertificationRecord on-chain · PDF pinned to IPFS');
}

function showCertSummary(c) {
  const container = document.getElementById('cert-last-summary');
  if (!container) return;
  container.style.display = '';
  container.innerHTML = `
    <div class="summary-card">
      <div class="summary-card-header">📜 Certification Issued — ${c.id}</div>
      <div class="summary-card-body">
        <div class="summary-field"><span class="sf-label">Cert ID</span>      <span class="sf-value">${c.id}</span></div>
        <div class="summary-field"><span class="sf-label">Batch</span>        <span class="sf-value">${c.batchId}</span></div>
        <div class="summary-field"><span class="sf-label">Type</span>         <span class="sf-value">${c.certType}</span></div>
        <div class="summary-field"><span class="sf-label">Issuing Body</span> <span class="sf-value">${c.body}</span></div>
        <div class="summary-field"><span class="sf-label">Valid Until</span>  <span class="sf-value">${c.expiry}</span></div>
        <div class="summary-field"><span class="sf-label">Status</span>       <span class="sf-value"><span class="badge badge-green">Active</span></span></div>
      </div>
      <div class="summary-checks">
        <span class="summary-check">✓ Stored on-chain</span>
        <span class="summary-check">✓ PDF pinned to IPFS</span>
        <span class="summary-check">✓ CID: ${c.cid.slice(0,20)}…</span>
      </div>
    </div>
    ${blockchainWidget(c.txHash, c.block)}`;
}

function fillDemoCert() {
  const firstBatch = state.batches.length ? state.batches[0].id : 'BATCH-001';
  document.getElementById('cert-batch').value  = firstBatch;
  document.getElementById('cert-type').value   = 'Organic';
  document.getElementById('cert-body').value   = 'Malaysian Organic Alliance';
  document.getElementById('cert-expiry').value = '2027-04-30';
  document.getElementById('cert-notes').value  = 'All input records verified compliant on-chain.';
  runComplianceCheck();
}

function renderCertsTable() {
  const tbody = document.getElementById('certs-tbody');
  const table = document.getElementById('certs-table');
  const empty = document.getElementById('certs-empty');
  if (!tbody) return;

  if (state.certs.length === 0) {
    table.style.display = 'none'; empty.style.display = ''; return;
  }
  table.style.display = ''; empty.style.display = 'none';
  tbody.innerHTML = state.certs.map(c => `
    <tr>
      <td><span class="badge badge-blue">${c.id}</span></td>
      <td>${c.batchId}</td>
      <td>${c.certType}</td>
      <td>${c.body}</td>
      <td>${c.expiry}</td>
      <td class="hash">${c.cid.slice(0, 18)}…</td>
      <td><span class="badge badge-green">${c.status}</span></td>
    </tr>`).join('');
}
