// Membangun Leaflet layer dari sebuah FeatureCollection GeoJSON:
// gambar denah (bila ada) sebagai latar, lalu polygon ruangan di atasnya.

import { CONFIG } from './config.js';

export const PLAN_PANE = 'plan-pane';

export function buildFloorLayer(geojson, floorId) {
  const style = CONFIG.floorStyle[floorId];
  const plan = CONFIG.planImages[floorId];
  const group = L.layerGroup();

  // Denah dasar (SVG) di bawah polygon; tanpa interaksi agar klik tetap ke ruangan.
  if (plan) {
    L.imageOverlay(plan.path, plan.bounds, {
      pane: PLAN_PANE,
      interactive: false,
      className: 'plan-image',
      alt: `Denah ${style.label}`,
    }).addTo(group);
  }

  L.geoJSON(geojson, {
    style: {
      color: style.color,
      weight: 1.5,
      fillColor: style.fill,
      fillOpacity: 0.12,
    },
    onEachFeature: (feature, layer) => {
      const { nama, tipe } = feature.properties;
      layer.bindPopup(
        `<b>${nama}</b><br>
         <span style="color:${style.color}">${style.label}</span><br>
         <small style="color:#888">${tipe}</small>`
      );

      // Nama ruangan hanya digambar untuk lantai yang belum punya denah,
      // supaya tidak dobel dengan label pada gambar denah.
      if (!plan) {
        layer.bindTooltip(nama, {
          permanent: true,
          direction: 'center',
          className: 'room-label',
        });
      }

      layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.35 }));
      layer.on('mouseout', () => layer.setStyle({ fillOpacity: 0.12 }));
    },
  }).addTo(group);

  return group;
}
