/**
 * state.js — Shared in-memory data store.
 * Pre-seeded with demo data so dashboards show realistic numbers on first load.
 */
const state = {
  role: null,

  users: [
    { name: 'Ahmad Al-Rashidi',   address: '0xA1b2C3d4E5f6A1b2C3d4E5f6A1b2C3d4E5f6A1b2', role: 'Farmer',        txHash: '0xabc123def456abc123def456abc123def456abc123def456abc123def456abc123', block: 5823441 },
    { name: 'Siti Nor Aisyah',    address: '0xB2c3D4e5F6a7B2c3D4e5F6a7B2c3D4e5F6a7B2c3', role: 'Certifier',     txHash: '0xdef456abc123def456abc123def456abc123def456abc123def456abc123def456', block: 5823445 },
    { name: 'Raj Kumar Pillai',   address: '0xC3d4E5f6A1b2C3d4E5f6A1b2C3d4E5f6A1b2C3d4', role: 'Transporter',   txHash: '0xfed321cba654fed321cba654fed321cba654fed321cba654fed321cba654fed321', block: 5823450 },
    { name: 'Lim Wei Kang',       address: '0xD4e5F6a7B2c3D4e5F6a7B2c3D4e5F6a7B2c3D4e5', role: 'Retailer',      txHash: '0x123abc456def123abc456def123abc456def123abc456def123abc456def123abc', block: 5823452 },
    { name: 'Hamidah Binti Yusof',address: '0xE5f6A1b2C3d4E5f6A1b2C3d4E5f6A1b2C3d4E5f6', role: 'Input Supplier',txHash: '0x456def789abc456def789abc456def789abc456def789abc456def789abc456def', block: 5823455 },
  ],

  inputs: [
    { id: 'INP-001', type: 'Organic Fertiliser', product: 'BioGrow NPK 5-5-5',   qty: '50 kg',  date: '2026-03-10', compliance: 'Compliant',     field: 'PLOT-07', cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco', txHash: '0x9d82a1b3c4d5e6f78901a2b3c4d5e6f78901a2b3c4d5e6f78901a2b3c4d5e6f7', block: 5823460 },
    { id: 'INP-002', type: 'Manure',             product: 'Composted Cow Manure', qty: '120 kg', date: '2026-03-12', compliance: 'Compliant',     field: 'PLOT-07', cid: 'QmYz1234abcdEFGH5678ijklMNOP9012qrstUVWX3456yza', txHash: '0x8c71b2a4d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1', block: 5823465 },
    { id: 'INP-003', type: 'Soil Amendment',     product: 'Lime pH Adjuster',     qty: '30 kg',  date: '2026-03-15', compliance: 'Compliant',     field: 'PLOT-12', cid: 'QmABCD1234EFGHijklMNOP5678qrstUVWX9012yza12345', txHash: '0x7b60a1b3c2d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0', block: 5823470 },
  ],

  batches: [
    { id: 'BATCH-001', name: 'Highland Arabica Lot A', variety: 'Arabica', harvest: '2026-04-15', location: 'Cameron Highlands, MY', weight: '200 kg', gi: 'Sabah GI Zone 3', inputs: 'INP-001, INP-002', txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', block: 5823501, stage: 'In Transit' },
    { id: 'BATCH-002', name: 'Lowland Robusta Lot B',  variety: 'Robusta', harvest: '2026-04-20', location: 'Johor Bahru, MY',       weight: '150 kg', gi: 'Johor GI Zone 1', inputs: 'INP-003',           txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3', block: 5823520, stage: 'Certified' },
  ],

  certs: [
    { id: 'CERT-001', batchId: 'BATCH-001', certType: 'Organic', body: 'Malaysian Organic Alliance', expiry: '2027-04-30', cid: 'QmCertABCD1234EFGHijklMNOP5678qrstUVWX9012yz', txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4', block: 5823540, status: 'Active' },
    { id: 'CERT-002', batchId: 'BATCH-002', certType: 'Fair Trade', body: 'Fairtrade International', expiry: '2027-03-15', cid: 'QmCertEFGH5678ijklMNOP9012qrstUVWX3456yzABCD', txHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', block: 5823555, status: 'Active' },
  ],

  shipments: [
    { id: 'SHIP-001', batchId: 'BATCH-001', origin: 'Cameron Highlands', destination: 'Kuala Lumpur Warehouse', status: 'In Transit', gps: '3.8°N, 101.6°E', temp: 23.4, humidity: 68, txHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6', block: 5823580 },
  ],

  receipts: [],
  verifications: 34,

  nextInputId: 4,
  nextBatchId: 3,
  nextCertId:  3,
  nextShipId:  2,
};
