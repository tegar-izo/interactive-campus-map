// Titik masuk aplikasi: muat data, bangun layer, pasang kontrol.

import { CONFIG } from './config.js';
import { createMap } from './map-init.js';
import { loadFloorData } from './data-loader.js';
import { buildFloorLayer } from './layers.js';
import { createFloorControl } from './floor-control.js';
import { createGridControl } from './grid.js';
import { createCompass } from './compass.js';

// Area yang harus terlihat untuk sebuah lantai: denah (bila ada) + semua ruangan.
function boundsForFloor(datasets, floorId) {
  const bounds = L.latLngBounds([]);
  const plan = CONFIG.planImages[floorId];
  if (plan) bounds.extend(plan.bounds);
  bounds.extend(L.geoJSON(datasets[floorId]).getBounds());
  return bounds;
}

async function main() {
  const map = createMap('map');

  // Muat semua lantai secara paralel
  const datasets = {};
  const layers = {};

  await Promise.all(
    CONFIG.floors.map(async (floorId) => {
      const data = await loadFloorData(CONFIG.dataPaths[floorId]);
      datasets[floorId] = data;
      layers[floorId] = buildFloorLayer(data, floorId);
    })
  );

  // Tampilkan lantai awal
  let currentFloor = CONFIG.initialFloor;
  layers[currentFloor].addTo(map);

  const floorLabelEl = document.getElementById('floor-label');
  const floorLabel = (floorId) => `lantai ${floorId}`;
  floorLabelEl.textContent = floorLabel(currentFloor);

  const fitToFloor = (floorId) => {
    map.fitBounds(boundsForFloor(datasets, floorId), { padding: [16, 16] });
  };
  fitToFloor(currentFloor);

  // Kontrol pemilih lantai
  createFloorControl({
    container: document.getElementById('floor-control'),
    floors: CONFIG.floors,
    initialFloor: currentFloor,
    floorStyle: CONFIG.floorStyle,
    onSelect: (floorId) => {
      if (floorId === currentFloor) return;
      layers[currentFloor].removeFrom(map);
      layers[floorId].addTo(map);
      currentFloor = floorId;
      floorLabelEl.textContent = floorLabel(floorId);
      fitToFloor(floorId);
    },
  });

  // Grid cartesius (kisi + sumbu) beserta tombol togglenya. Opsional:
  // dimatikan lewat CONFIG.grid.visible/showToggle agar sesuai desain.
  if (CONFIG.grid.showToggle || CONFIG.grid.visible) {
    createGridControl({
      map,
      config: CONFIG.grid,
      container: document.getElementById('floor-control'),
    });
  }

  // Kompas statis di pojok kanan atas
  createCompass({
    container: document.getElementById('compass'),
    config: CONFIG.compass,
  });
}

main().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML(
    'beforeend',
    `<p style="position:absolute;top:20px;left:20px;background:#fee;padding:12px;border-radius:8px;z-index:9999">
       Gagal memuat aplikasi: ${err.message}
     </p>`
  );
});
