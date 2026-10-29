// Membuat instance peta Leaflet dengan CRS.Simple
// (koordinat = pixel/lokal, bukan lat/lng).

import { PLAN_PANE } from './layers.js';

export function createMap(elementId) {
  const map = L.map(elementId, {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 4,
    // Zoom pecahan supaya denah pas mengisi lebar layar saat fitBounds.
    zoomSnap: 0.1,
    zoomControl: false,
  });

  // Pane khusus supaya urutan gambar denah, kisi, dan polygon stabil:
  // denah paling bawah, lalu kisi, lalu polygon ruangan (pane bawaan).
  map.createPane(PLAN_PANE);
  map.getPane(PLAN_PANE).style.zIndex = 200;

  map.createPane('grid-pane');
  map.getPane('grid-pane').style.zIndex = 250;

  map.createPane('axis-pane');
  map.getPane('axis-pane').style.zIndex = 620;

  return map;
}
