// Membuat instance peta Leaflet dengan CRS.Simple
// (koordinat = pixel/lokal, bukan lat/lng).

export function createMap(elementId) {
  const map = L.map(elementId, {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 4,
    zoomControl: false,
  });

  // Pane khusus supaya urutan kisi/sumbu tidak berubah saat layer lantai ditukar:
  // kisi di bawah polygon lantai, sumbu + label di atasnya.
  map.createPane('grid-pane');
  map.getPane('grid-pane').style.zIndex = 250;

  map.createPane('axis-pane');
  map.getPane('axis-pane').style.zIndex = 620;

  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  return map;
}
