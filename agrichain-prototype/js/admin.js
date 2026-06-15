/**
 * admin.js — Function 1: Register Stakeholder.
 * Maps to: UserRegistry.sol → registerStakeholder()
 */

function registerStakeholder() {
  const address = document.getElementById('reg-address').value.trim();
  const name    = document.getElementById('reg-name').value.trim();
  const role    = document.getElementById('reg-role').value;

  if (!address || !name || !role) {
    setAlert('alert-admin', 'error', 'Please fill in all fields before submitting.');
    return;
  }
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    setAlert('alert-admin', 'error', 'Invalid Ethereum address — must be 0x followed by 40 hex characters.');
    return;
  }
  if (state.users.find(u => u.address.toLowerCase() === address.toLowerCase())) {
    setAlert('alert-admin', 'error', 'This address is already registered on-chain.');
    return;
  }

  setAlert('alert-admin', '');
  const txHash = fakeTxHash();
  const block  = fakeBlock();
  state.users.push({ name, address, role, txHash, block });

  document.getElementById('reg-address').value = '';
  document.getElementById('reg-name').value    = '';
  document.getElementById('reg-role').value    = '';

  renderAdminTable();
  refreshDashboard('admin');
  showModal(txHash, block);
  toast('✅ Stakeholder registered on Sepolia Testnet');
}

function fillDemoAdmin() {
  const hex  = '0123456789abcdef';
  const addr = '0x' + Array.from({ length: 40 }, () => hex[Math.floor(Math.random() * 16)]).join('');
  document.getElementById('reg-address').value = addr;
  document.getElementById('reg-name').value    = 'Nurul Huda Binti Omar';
  document.getElementById('reg-role').value    = 'Farmer';
}

function renderAdminTable() {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;
  if (state.users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty">No users registered yet.</td></tr>';
    return;
  }
  tbody.innerHTML = state.users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td class="hash" style="max-width:140px;overflow:hidden;text-overflow:ellipsis;">${u.address}</td>
      <td><span class="badge badge-blue">${u.role}</span></td>
      <td class="hash">${shortHash(u.txHash)}</td>
    </tr>`).join('');
}
