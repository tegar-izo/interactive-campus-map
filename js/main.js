// Titik masuk aplikasi: muat data, bangun layer, pasang kontrol.

import { CONFIG } from './config.js';
import { createMap } from './map-init.js';
import { loadFloorData } from './data-loader.js';
import { buildFloorLayer } from './layers.js';
import { createFloorControl } from './floor-control.js';
import { createGridControl } from './grid.js';
import { createCompass } from './compass.js';

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

  // Fit tampilan ke keseluruhan denah semua lantai (supaya konsisten saat ganti lantai)
  const allFeatures = {
    type: 'FeatureCollection',
    features: Object.values(datasets).flatMap((fc) => fc.features),
  };
  map.fitBounds(L.geoJSON(allFeatures).getBounds(), { padding: [40, 40] });

  // Kontrol pemilih lantai
  const floorControlEl = document.getElementById('floor-control');

  createFloorControl({
    container: floorControlEl,
    floors: CONFIG.floors,
    initialFloor: currentFloor,
    floorStyle: CONFIG.floorStyle,
    onSelect: (floorId) => {
      if (floorId === currentFloor) return;
      layers[currentFloor].removeFrom(map);
      layers[floorId].addTo(map);
      currentFloor = floorId;
    },
  });

  // Grid cartesius (kisi + sumbu) dan tombol togglenya, di panel yang sama.
  // Dibuat setelah floor control karena floor control mengosongkan container.
  createGridControl({
    map,
    config: CONFIG.grid,
    container: floorControlEl,
  });

  // Kompas statis di pojok kiri atas
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
