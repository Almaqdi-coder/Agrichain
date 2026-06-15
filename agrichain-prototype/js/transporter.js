/**
 * transporter.js — Transporter screen: live GPS/sensor monitoring + confirm delivery.
 * Maps to: BatchTracker.sol → logTransitHandover() / SensorEvent submissions.
 */

let transportSensorInterval = null;

function refreshTransportSensors() {
  const temp = parseFloat((21 + Math.random() * 8).toFixed(1));
  const hum  = Math.round(58 + Math.random() * 22);
  const lats = ['3.8°N', '4.1°N', '3.6°N', '4.3°N'];
  const lons = ['101.6°E', '101.9°E', '102.1°E', '101.4°E'];
  const lat  = lats[Math.floor(Math.random() * lats.length)];
  const lon  = lons[Math.floor(Math.random() * lons.length)];

  const tempStatus = temp >= 32 ? 'critical' : temp >= 28 ? 'warning' : 'normal';
  const humStatus  = hum  >= 88 ? 'critical' : hum  >= 80 ? 'warning' : 'normal';

  const statusLabel = { normal: 'Normal', warning: 'Warning ⚠', critical: 'Critical !' };

  const grid = document.getElementById('transport-sensor-grid');
  if (!grid) return;

  grid.innerHTML = `
    <div class="iot-card ${tempStatus}">
      <div class="iot-label">Temperature</div>
      <div class="iot-value">${temp}<span class="iot-unit"> °C</span></div>
      <span class="iot-status">${statusLabel[tempStatus]}</span>
      <div class="iot-node">ESP32-Transit-01</div>
    </div>
    <div class="iot-card ${humStatus}">
      <div class="iot-label">Humidity</div>
      <div class="iot-value">${hum}<span class="iot-unit"> %</span></div>
      <span class="iot-status">${statusLabel[humStatus]}</span>
      <div class="iot-node">ESP32-Transit-01</div>
    </div>
    <div class="iot-card normal">
      <div class="iot-label">GPS Latitude</div>
      <div class="iot-value" style="font-size:1.2rem">${lat}</div>
      <span class="iot-status">Verified</span>
      <div class="iot-node">ESP32-GPS-Transit</div>
    </div>
    <div class="iot-card normal">
      <div class="iot-label">GPS Longitude</div>
      <div class="iot-value" style="font-size:1.2rem">${lon}</div>
      <span class="iot-status">Verified</span>
      <div class="iot-node">ESP32-GPS-Transit</div>
    </div>`;

  // Update GPS display in shipment selector
  const gpsDisplay = document.getElementById('transport-gps-live');
  if (gpsDisplay) gpsDisplay.textContent = `${lat}, ${lon}`;
}

function confirmDelivery() {
  const batchId = document.getElementById('transport-batch').value.trim();
  const dest    = document.getElementById('transport-dest').value.trim();

  if (!batchId) {
    setAlert('alert-transporter', 'error', 'Please enter a Batch ID to confirm delivery.');
    return;
  }

  setAlert('alert-transporter', '');
  const txHash = fakeTxHash();
  const block  = fakeBlock();

  // Update batch stage
  const batch = state.batches.find(b => b.id === batchId);
  if (batch) batch.stage = 'With Retailer';

  // Record shipment
  const shipment = state.shipments.find(s => s.batchId === batchId);
  if (shipment) {
    shipment.status = 'Delivered';
    shipment.destination = dest || shipment.destination;
    shipment.txHash = txHash;
    shipment.block  = block;
  }

  renderShipmentsTable();
  refreshDashboard('transporter');

  const summary = document.getElementById('transport-delivery-summary');
  if (summary) {
    summary.style.display = '';
    summary.innerHTML = `
      <div class="summary-card">
        <div class="summary-card-header">🚚 Delivery Confirmed — ${batchId}</div>
        <div class="summary-card-body">
          <div class="summary-field"><span class="sf-label">Batch ID</span>     <span class="sf-value">${batchId}</span></div>
          <div class="summary-field"><span class="sf-label">Destination</span>  <span class="sf-value">${dest || 'KL Warehouse'}</span></div>
          <div class="summary-field"><span class="sf-label">Handover</span>     <span class="sf-value">Custody transferred to Retailer</span></div>
          <div class="summary-field"><span class="sf-label">Stage</span>        <span class="sf-value"><span class="badge badge-green">Delivered</span></span></div>
        </div>
        <div class="summary-checks">
          <span class="summary-check">✓ Handover recorded on-chain</span>
          <span class="summary-check">✓ GPS coordinates logged</span>
          <span class="summary-check">✓ Final sensor reading submitted</span>
        </div>
      </div>
      ${blockchainWidget(txHash, block)}`;
  }

  showModal(txHash, block);
  toast('✅ Delivery confirmed — custody transferred to Retailer');
}

function fillDemoTransporter() {
  const firstBatch = state.batches.length ? state.batches[0].id : 'BATCH-001';
  document.getElementById('transport-batch').value = firstBatch;
  document.getElementById('transport-dest').value  = 'KL Central Warehouse, Kuala Lumpur';
}

function renderShipmentsTable() {
  const tbody = document.getElementById('shipments-tbody');
  const table = document.getElementById('shipments-table');
  const empty = document.getElementById('shipments-empty');
  if (!tbody) return;

  if (state.shipments.length === 0) {
    table.style.display = 'none'; empty.style.display = ''; return;
  }
  table.style.display = ''; empty.style.display = 'none';
  tbody.innerHTML = state.shipments.map(s => `
    <tr>
      <td><span class="badge badge-gray">${s.id}</span></td>
      <td>${s.batchId}</td>
      <td>${s.origin}</td>
      <td>${s.destination}</td>
      <td>${s.gps}</td>
      <td><span class="badge ${s.status === 'Delivered' ? 'badge-green' : 'badge-amber'}">${s.status}</span></td>
    </tr>`).join('');
}
