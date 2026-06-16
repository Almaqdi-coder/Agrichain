/**
 * consumer.js — Function 5: Verify Product via QR Code.
 * The showpiece screen — full provenance, trust score, sensor records, cert download.
 */

function loadDemoVerify() {
  document.getElementById('verify-id').value = 'BATCH-001';
  verifyProduct();
}

function verifyProduct() {
  const id = document.getElementById('verify-id').value.trim();
  if (!id) { toast('⚠️ Please enter a Batch ID'); return; }

  state.verifications++;

  const batch = state.batches.find(b => b.id === id);
  const cert  = state.certs.find(c => c.batchId === id);
  const data  = batch ? buildDataFromState(batch, cert) : buildDemoData(id);

  renderVerification(data);
  document.getElementById('verify-result').style.display = '';

  // Scroll to result
  document.getElementById('verify-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildDataFromState(batch, cert) {
  const linkedInputIds = batch.inputs?.split(',').map(s => s.trim()) || [];
  const linkedInputs   = linkedInputIds.map(id => state.inputs.find(i => i.id === id)).filter(Boolean);
  const allCompliant   = linkedInputs.every(i => i.compliance === 'Compliant');
  const score = cert && allCompliant ? 98 : cert ? 72 : allCompliant ? 60 : 35;

  return {
    id: batch.id, name: batch.name, variety: batch.variety,
    location: batch.location, harvest: batch.harvest, weight: batch.weight,
    stage: batch.stage, certified: !!cert,
    certType: cert?.certType, certBody: cert?.body,
    certExpiry: cert?.expiry, certCid: cert?.cid,
    txHash: batch.txHash, block: batch.block,
    score, allCompliant, linkedInputs,
  };
}

function buildDemoData(id) {
  return {
    id, name: 'Highland Arabica Lot A', variety: 'Arabica',
    location: 'Cameron Highlands, MY', harvest: '2026-04-15', weight: '200 kg',
    stage: 'In Transit', certified: true,
    certType: 'Organic', certBody: 'Malaysian Organic Alliance',
    certExpiry: '2027-04-30', certCid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    block: 5823501, score: 98, allCompliant: true,
    linkedInputs: state.inputs.slice(0, 2),
  };
}

function renderVerification(d) {
  renderTrustPanel(d);
  renderBatchSummary(d);
  renderSupplyChainHistory(d);
  renderSensorSection(d);
  renderCertSection(d);
}

function renderTrustPanel(d) {
  const panel = document.getElementById('trust-panel');
  const scoreEl = document.getElementById('trust-score-num');
  const titleEl = document.getElementById('trust-title');
  const descEl  = document.getElementById('trust-desc');
  const tagsEl  = document.getElementById('trust-tags');

  let color, title, desc, tags;
  if (d.score >= 90) {
    color = 'green'; title = '✅ Fully Verified & Compliant';
    desc  = 'All input records are on-chain and compliant. Active certification confirmed.';
    tags  = ['Organic Certified', 'IoT Verified', 'Blockchain Traced', 'GI Registered'];
  } else if (d.score >= 60) {
    color = 'amber'; title = '⚠️ Partially Verified';
    desc  = 'Product is traceable but has pending certification or minor alerts.';
    tags  = ['Blockchain Traced', 'IoT Verified'];
  } else {
    color = 'red'; title = '❌ Verification Failed';
    desc  = 'Non-compliant inputs detected or certification revoked.';
    tags  = ['Non-Compliant Inputs'];
  }

  panel.className  = `trust-panel ${color}`;
  scoreEl.textContent = d.score + '%';
  titleEl.textContent = title;
  descEl.textContent  = desc;
  tagsEl.innerHTML = tags.map(t => `<span class="badge badge-${color === 'green' ? 'green' : color === 'amber' ? 'amber' : 'red'}">${t}</span>`).join('');
}

function renderBatchSummary(d) {
  document.getElementById('v-panel').innerHTML = `
    <div class="kv-list">
      <div class="kv-row"><span class="kv-key">Batch ID</span>        <span class="kv-value">${d.id}</span></div>
      <div class="kv-row"><span class="kv-key">Product Name</span>    <span class="kv-value">${d.name}</span></div>
      <div class="kv-row"><span class="kv-key">Coffee Variety</span>  <span class="kv-value">${d.variety}</span></div>
      <div class="kv-row"><span class="kv-key">Origin</span>          <span class="kv-value">${d.location}</span></div>
      <div class="kv-row"><span class="kv-key">Harvest Date</span>    <span class="kv-value">${d.harvest}</span></div>
      <div class="kv-row"><span class="kv-key">Weight</span>          <span class="kv-value">${d.weight}</span></div>
      <div class="kv-row"><span class="kv-key">Certification Body</span><span class="kv-value">${d.certBody || '—'}</span></div>
      <div class="kv-row"><span class="kv-key">Current Stage</span>   <span class="kv-value"><span class="badge badge-amber">${d.stage}</span></span></div>
    </div>`;
}

function renderSupplyChainHistory(d) {
  const stages = [
    { name: 'Input Supplier', icon: '🌱', date: '2026-03-10', detail: 'BioGrow NPK, Cow Manure — Compliant ✅',        done: true },
    { name: 'Farmer',         icon: '🚜', date: '2026-04-15', detail: `${d.name} registered — ${d.weight}`,            done: true },
    { name: 'Certifier',      icon: '📜', date: '2026-04-25', detail: d.certified ? `${d.certType} cert issued by ${d.certBody}` : 'Pending certification', done: d.certified },
    { name: 'Transporter',    icon: '🚛', date: '2026-04-28', detail: 'GPS tracked — Cameron Highlands → KL',          done: true },
    { name: 'Retailer',       icon: '🏪', date: '—',          detail: 'Awaiting receipt confirmation',                 done: false },
  ];

  const historyHtml = stages.map((s, i) => {
    const cls  = s.done ? 'done' : 'pending';
    const icon = s.done ? '✓' : '○';
    const connector = i < stages.length - 1 ? `<div class="sc-connector ${s.done ? 'done' : ''}"></div>` : '';
    return `
      <div class="sc-stage ${cls}">
        <div class="sc-icon">${icon}</div>
        <div class="sc-info">
          <div class="sc-name">${s.icon} ${s.name}</div>
          <div class="sc-detail">${s.date !== '—' ? s.date + ' — ' : ''}${s.detail}</div>
        </div>
      </div>${connector}`;
  }).join('');

  const tlEvents = [
    { date: '2026-03-10', title: 'Inputs Recorded On-Chain',       sub: 'BioGrow NPK 5-5-5 (50 kg) · Cow Manure (120 kg) — All Compliant', txHash: state.inputs[0]?.txHash || fakeTxHash() },
    { date: '2026-04-15', title: 'Product Batch Registered',       sub: `${d.name} · ${d.variety} · ${d.weight} · ${d.location}`, txHash: d.txHash },
    { date: '2026-04-20', title: 'Sensor Data: Farm Gate',         sub: 'Temp 24.2°C · Humidity 72% · Soil Moisture 48% — All Normal', txHash: fakeTxHash() },
    ...(d.certified ? [{ date: '2026-04-25', title: `${d.certType} Certification Issued`, sub: `Issuing Body: ${d.certBody} · Valid until ${d.certExpiry}`, txHash: state.certs[0]?.txHash || fakeTxHash() }] : []),
    { date: '2026-04-28', title: 'Transit: GPS & Sensor Logged',   sub: '3.8°N, 101.6°E · Temp 23.4°C · Humidity 68% — Within Thresholds', txHash: fakeTxHash(), alert: false },
  ];

  document.getElementById('v-supply-chain').innerHTML = `
    <div class="grid-2">
      <div>
        <h3 style="font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;color:#777;margin-bottom:12px;">Stage Progress</h3>
        <div class="sc-vertical">${historyHtml}</div>
      </div>
      <div>
        <h3 style="font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;color:#777;margin-bottom:12px;">Blockchain Event Log</h3>
        <div class="timeline">
          ${tlEvents.map(e => `
            <div class="tl-item">
              <div class="tl-dot ${e.alert ? 'amber' : ''}"></div>
              <div class="tl-date">${e.date}</div>
              <div class="tl-title">${e.title}</div>
              <div class="tl-sub">${e.sub}</div>
              <div class="tl-hash">Tx: ${shortHash(e.txHash)}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

function renderSensorSection(d) {
  document.getElementById('v-sensors').innerHTML = `
    <div class="iot-grid">
      <div class="iot-card normal">
        <div class="iot-label">Temperature</div>
        <div class="iot-value">24.2<span class="iot-unit"> °C</span></div>
        <span class="iot-status">Normal</span>
        <div class="iot-node">Latest: 2026-04-28</div>
      </div>
      <div class="iot-card normal">
        <div class="iot-label">Humidity</div>
        <div class="iot-value">68<span class="iot-unit"> %</span></div>
        <span class="iot-status">Normal</span>
        <div class="iot-node">Latest: 2026-04-28</div>
      </div>
      <div class="iot-card normal">
        <div class="iot-label">Soil Moisture</div>
        <div class="iot-value">48<span class="iot-unit"> %</span></div>
        <span class="iot-status">Normal</span>
        <div class="iot-node">Farm gate reading</div>
      </div>
      <div class="iot-card normal">
        <div class="iot-label">GPS (Last Known)</div>
        <div class="iot-value" style="font-size:1rem">3.8°N</div>
        <div class="iot-unit">101.6°E</div>
        <span class="iot-status">Verified</span>
        <div class="iot-node">In transit</div>
      </div>
    </div>`;
}

function renderCertSection(d) {
  const container = document.getElementById('v-cert-body');
  if (d.certified) {
    container.innerHTML = `
      <div class="alert alert-success" style="margin-bottom:14px">
        ✅ Active ${d.certType} certification confirmed on Sepolia blockchain
      </div>
      <div class="kv-list">
        <div class="kv-row"><span class="kv-key">Certification Type</span><span class="kv-value">${d.certType}</span></div>
        <div class="kv-row"><span class="kv-key">Issuing Body</span>      <span class="kv-value">${d.certBody}</span></div>
        <div class="kv-row"><span class="kv-key">Valid Until</span>       <span class="kv-value">${d.certExpiry}</span></div>
        <div class="kv-row"><span class="kv-key">IPFS CID</span>         <span class="kv-value hash">${d.certCid}</span></div>
      </div>
      <div class="btn-row">
        <button class="btn btn-blue">⬇ View Certificate PDF (IPFS)</button>
        <button class="btn btn-secondary">🔗 View on Etherscan</button>
      </div>`;
  } else {
    container.innerHTML = `<div class="alert alert-amber">No active certification found for this batch.</div>`;
  }
}
