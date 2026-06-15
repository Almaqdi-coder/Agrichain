/**
 * supplier.js — Function 2: Record Farm Input.
 * Maps to: InputRecord.sol → recordInput()
 */

function recordInput() {
  const type       = document.getElementById('inp-type').value;
  const product    = document.getElementById('inp-product').value.trim();
  const qty        = document.getElementById('inp-qty').value;
  const date       = document.getElementById('inp-date').value;
  const compliance = document.getElementById('inp-compliance').value;
  const field      = document.getElementById('inp-field').value.trim();

  if (!type || !product || !qty || !date) {
    setAlert('alert-supplier', 'error', 'Please fill in all required fields: Type, Product, Quantity, and Date.');
    return;
  }

  setAlert('alert-supplier', '');
  const txHash = fakeTxHash();
  const block  = fakeBlock();
  const id  = 'INP-' + String(state.nextInputId++).padStart(3, '0');
  const cid = document.getElementById('inp-cid').value.trim() || fakeCid();

  const record = { id, type, product, qty: qty + ' kg', date, compliance, field, cid, txHash, block };
  state.inputs.push(record);

  ['inp-product', 'inp-qty', 'inp-date', 'inp-field', 'inp-cid', 'inp-notes']
    .forEach(eid => { document.getElementById(eid).value = ''; });
  document.getElementById('inp-type').value = '';

  renderInputsTable();
  refreshDashboard('supplier');
  showInputSummary(record);
  toast('✅ InputRecord submitted to blockchain');
}

/** Show post-submission summary card with blockchain widget */
function showInputSummary(r) {
  const container = document.getElementById('input-last-summary');
  if (!container) return;
  container.style.display = '';
  container.innerHTML = `
    <div class="summary-card">
      <div class="summary-card-header">✅ Input Record Submitted — ${r.id}</div>
      <div class="summary-card-body">
        <div class="summary-field"><span class="sf-label">Input ID</span>    <span class="sf-value">${r.id}</span></div>
        <div class="summary-field"><span class="sf-label">Type</span>        <span class="sf-value">${r.type}</span></div>
        <div class="summary-field"><span class="sf-label">Product</span>     <span class="sf-value">${r.product}</span></div>
        <div class="summary-field"><span class="sf-label">Quantity</span>    <span class="sf-value">${r.qty}</span></div>
        <div class="summary-field"><span class="sf-label">Date Applied</span><span class="sf-value">${r.date}</span></div>
        <div class="summary-field">
          <span class="sf-label">Compliance</span>
          <span class="sf-value">
            <span class="badge ${r.compliance === 'Compliant' ? 'badge-green' : 'badge-red'}">${r.compliance}</span>
          </span>
        </div>
      </div>
      <div class="summary-checks">
        <span class="summary-check">✓ Stored on-chain</span>
        <span class="summary-check">✓ IPFS CID Generated</span>
        <span class="summary-check">✓ Role verified (Input Supplier)</span>
      </div>
    </div>
    ${blockchainWidget(r.txHash, r.block)}`;
}

function fillDemoSupplier() {
  document.getElementById('inp-type').value       = 'Organic Fertiliser';
  document.getElementById('inp-product').value    = 'BioGrow NPK 5-5-5';
  document.getElementById('inp-qty').value        = '50';
  document.getElementById('inp-date').value       = '2026-03-10';
  document.getElementById('inp-compliance').value = 'Compliant';
  document.getElementById('inp-field').value      = 'PLOT-07';
}

function renderInputsTable() {
  const tbody = document.getElementById('inputs-tbody');
  const table = document.getElementById('inputs-table');
  const empty = document.getElementById('inputs-empty');
  if (!tbody) return;

  if (state.inputs.length === 0) {
    table.style.display = 'none'; empty.style.display = ''; return;
  }
  table.style.display = ''; empty.style.display = 'none';
  tbody.innerHTML = state.inputs.map(r => `
    <tr>
      <td><span class="badge badge-gray">${r.id}</span></td>
      <td>${r.type}</td>
      <td>${r.product}</td>
      <td>${r.qty}</td>
      <td>${r.date}</td>
      <td><span class="badge ${r.compliance === 'Compliant' ? 'badge-green' : 'badge-red'}">${r.compliance}</span></td>
      <td class="hash">${shortHash(r.txHash)}</td>
    </tr>`).join('');
}
