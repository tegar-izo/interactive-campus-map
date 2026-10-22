// Membuat instance peta Leaflet dengan CRS.Simple
// (koordinat = pixel/lokal, bukan lat/lng).

export function createMap(elementId) {
  return L.map(elementId, {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 4,
    zoomControl: true,
  });
}
