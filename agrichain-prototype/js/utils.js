/**
 * utils.js — Shared helper functions.
 */

function fakeTxHash() {
  const hex = '0123456789abcdef';
  return '0x' + Array.from({ length: 64 }, () => hex[Math.floor(Math.random() * 16)]).join('');
}

function fakeBlock() {
  return Math.floor(Math.random() * 500_000 + 5_800_000);
}

function fakeCid() {
  return 'Qm' + Math.random().toString(36).substring(2, 50).padEnd(48, 'x');
}

function shortHash(h) {
  return h.slice(0, 10) + '…' + h.slice(-6);
}

function toast(msg, dur = 3000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
}

function showModal(hash, block) {
  document.getElementById('modal-hash').textContent  = hash;
  document.getElementById('modal-block').textContent = '#' + block;
  document.getElementById('modal-tx').classList.add('show');
}

function closeModal() {
  document.getElementById('modal-tx').classList.remove('show');
}

function setAlert(containerId, type, msg = '') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = msg ? `<div class="alert alert-${type}"><span>${msg}</span></div>` : '';
}

/** Render a blockchain widget (dark card showing tx hash + block + network) */
function blockchainWidget(hash, block) {
  return `
    <div class="blockchain-widget">
      <div class="bw-header">
        <div class="bw-dot"></div> Blockchain Record — Sepolia Testnet
      </div>
      <div class="bw-row">
        <div class="bw-field">
          <span class="bw-field-label">Transaction Hash</span>
          <span class="bw-field-value">${hash}</span>
        </div>
        <div class="bw-field">
          <span class="bw-field-label">Block Number</span>
          <span class="bw-field-value">#${block}</span>
        </div>
        <div class="bw-field">
          <span class="bw-field-label">Network</span>
          <span class="bw-field-value bw-network">
            <span class="bw-network-dot"></span> Ethereum Sepolia Testnet
          </span>
        </div>
      </div>
    </div>`;
}
