/**
 * retailer.js — Retailer screen: confirm product receipt + generate QR code.
 * Maps to: BatchTracker.sol → confirmReceipt() + QR generation.
 */

function confirmReceipt() {
  const batchId = document.getElementById('retail-batch').value.trim();
  if (!batchId) {
    setAlert('alert-retailer', 'error', 'Please enter a Batch ID to confirm receipt.');
    return;
  }

  setAlert('alert-retailer', '');
  const txHash = fakeTxHash();
  const block  = fakeBlock();

  const batch = state.batches.find(b => b.id === batchId);
  if (batch) batch.stage = 'Received';

  if (!state.receipts.find(r => r.batchId === batchId)) {
    state.receipts.push({ batchId, txHash, block, date: new Date().toISOString().split('T')[0] });
  }

  renderReceiptsTable();
  refreshDashboard('retailer');
  renderQrPanel(batchId, txHash, block);
  showModal(txHash, block);
  toast('✅ Receipt confirmed on-chain — QR code ready');
}

function generateQr() {
  const batchId = document.getElementById('retail-batch').value.trim();
  if (!batchId) { toast('⚠️ Enter a Batch ID first'); return; }
  renderQrPanel(batchId, fakeTxHash(), fakeBlock());
}

/** Render a mock QR code with batch details */
function renderQrPanel(batchId, txHash, block) {
  const panel = document.getElementById('qr-panel');
  if (!panel) return;
  panel.style.display = '';

  // Simple deterministic-looking QR grid (purely visual)
  const seed = batchId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 49 }, (_, i) => {
    // Always fill corners (finder patterns)
    const row = Math.floor(i / 7), col = i % 7;
    if ((row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2)) return 'b';
    return ((seed * (i + 7)) % 3 === 0) ? 'b' : '';
  });

  const cert = state.certs.find(c => c.batchId === batchId);
  const batch = state.batches.find(b => b.id === batchId);

  panel.innerHTML = `
    <div class="card">
      <h2>📲 QR Code Generated — ${batchId}</h2>
      <div style="display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start">
        <div class="qr-block">
          <div class="qr-mock">${cells.map(c => `<div class="qr-cell ${c}"></div>`).join('')}</div>
          <div class="qr-id">agrichain.verify/${batchId}</div>
          <div style="margin-top:8px">
            <button class="btn btn-blue btn-sm">⬇ Download QR</button>
          </div>
        </div>
        <div style="flex:1;min-width:200px">
          <div class="kv-list">
            <div class="kv-row"><span class="kv-key">Batch ID</span>      <span class="kv-value">${batchId}</span></div>
            <div class="kv-row"><span class="kv-key">Product</span>       <span class="kv-value">${batch?.name || '—'}</span></div>
            <div class="kv-row"><span class="kv-key">Status</span>        <span class="kv-value"><span class="badge badge-green">Received</span></span></div>
            <div class="kv-row"><span class="kv-key">Certification</span> <span class="kv-value">${cert ? cert.certType + ' Certified ✓' : 'No cert on-chain'}</span></div>
            <div class="kv-row"><span class="kv-key">Scan URL</span>      <span class="kv-value hash">agrichain.verify/${batchId}</span></div>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary btn-sm" onclick="selectRole('consumer');document.getElementById('verify-id').value='${batchId}';verifyProduct()">
              🔍 Preview Consumer View
            </button>
          </div>
        </div>
      </div>
      ${blockchainWidget(txHash, block)}
    </div>`;
}

function fillDemoRetailer() {
  const delivered = state.batches.find(b => b.stage === 'In Transit' || b.stage === 'With Retailer');
  document.getElementById('retail-batch').value = delivered?.id || (state.batches.length ? state.batches[0].id : 'BATCH-001');
}

function renderReceiptsTable() {
  const tbody = document.getElementById('receipts-tbody');
  const table = document.getElementById('receipts-table');
  const empty = document.getElementById('receipts-empty');
  if (!tbody) return;

  if (state.receipts.length === 0) {
    table.style.display = 'none'; empty.style.display = ''; return;
  }
  table.style.display = ''; empty.style.display = 'none';
  const cert = (batchId) => state.certs.find(c => c.batchId === batchId);
  tbody.innerHTML = state.receipts.map(r => `
    <tr>
      <td><span class="badge badge-blue">${r.batchId}</span></td>
      <td>${r.date}</td>
      <td>${cert(r.batchId) ? `<span class="badge badge-green">${cert(r.batchId).certType} Certified</span>` : '<span class="badge badge-gray">Uncertified</span>'}</td>
      <td><span class="badge badge-green">QR Generated</span></td>
      <td class="hash">${shortHash(r.txHash)}</td>
    </tr>`).join('');
}
