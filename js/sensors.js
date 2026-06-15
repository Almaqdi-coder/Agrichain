/**
 * sensors.js — Simulated IoT sensor feed (ESP32 via MQTT).
 * Renders color-coded status: Normal / Warning / Critical.
 */

function getSensorStatus(type, val) {
  const thresholds = {
    temp:  { warn: 30, crit: 35 },
    hum:   { warn: 85, crit: 92 },
    soil:  { warn: 25, crit: 15 },
  };
  const t = thresholds[type];
  if (!t) return 'normal';
  if (type === 'soil') {
    if (val < t.crit) return 'critical';
    if (val < t.warn) return 'warning';
    return 'normal';
  }
  if (val >= t.crit) return 'critical';
  if (val >= t.warn) return 'warning';
  return 'normal';
}

const STATUS_LABELS = { normal: 'Normal', warning: 'Warning ⚠', critical: 'Critical !' };

function iotCard(label, val, unit, statusClass, node = '') {
  return `
    <div class="iot-card ${statusClass}">
      <div class="iot-label">${label}</div>
      <div class="iot-value">${val}<span class="iot-unit"> ${unit}</span></div>
      <span class="iot-status">${STATUS_LABELS[statusClass]}</span>
      ${node ? `<div class="iot-node">${node}</div>` : ''}
    </div>`;
}

function refreshSensors() {
  const temp  = parseFloat((22 + Math.random() * 10).toFixed(1));
  const hum   = Math.round(60 + Math.random() * 28);
  const soil  = Math.round(32 + Math.random() * 35);

  const tempStatus = getSensorStatus('temp', temp);
  const humStatus  = getSensorStatus('hum',  hum);
  const soilStatus = getSensorStatus('soil', soil);

  const grid = document.getElementById('sensor-grid');
  if (!grid) return;

  grid.innerHTML =
    iotCard('Temperature', temp,  '°C', tempStatus, 'ESP32-Soil-01') +
    iotCard('Humidity',    hum,   '%',  humStatus,  'ESP32-Soil-01') +
    iotCard('Soil Moisture', soil, '%', soilStatus, 'ESP32-Soil-01') +
    `<div class="iot-card normal">
      <div class="iot-label">GPS Location</div>
      <div class="iot-value" style="font-size:1rem">4.5°N</div>
      <div class="iot-unit">101.3°E</div>
      <span class="iot-status">Verified</span>
      <div class="iot-node">ESP32-GPS-01</div>
    </div>`;

  toast('📡 Sensor data refreshed from MQTT broker');
}
