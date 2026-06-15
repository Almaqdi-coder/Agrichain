/**
 * main.js — App initialisation.
 */

function renderAllTables() {
  renderAdminTable();
  renderInputsTable();
  renderBatchesTable();
  renderCertsTable();
  renderShipmentsTable();
  renderReceiptsTable();
}

document.addEventListener('DOMContentLoaded', () => {
  renderAllTables();
  showScreen('landing');
});
