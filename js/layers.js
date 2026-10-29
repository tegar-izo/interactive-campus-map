// Membangun Leaflet layer dari sebuah FeatureCollection GeoJSON:
// gambar denah (bila ada) sebagai latar, lalu polygon ruangan di atasnya.

import { CONFIG } from './config.js';

export const PLAN_PANE = 'plan-pane';

const FILL_OPACITY = 0.3;
const FILL_OPACITY_HOVER = 0.55;

// Warna polygon mengikuti tipe ruangan; lantai hanya jadi cadangan.
function colorFor(feature, floorStyle) {
  return CONFIG.tipeColors[feature.properties.tipe] ?? floorStyle.fill;
}

function baseStyle(feature, floorStyle) {
  const color = colorFor(feature, floorStyle);
  return {
    color,
    weight: 1.5,
    fillColor: color,
    fillOpacity: FILL_OPACITY,
  };
}

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
    style: (feature) => baseStyle(feature, style),
    onEachFeature: (feature, layer) => {
      const { nama, tipe } = feature.properties;
      const color = colorFor(feature, style);
      layer.bindPopup(
        `<b>${nama}</b><br>
         <span style="color:${color}">${style.label}</span><br>
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

      layer.on('mouseover', () => layer.setStyle({ fillOpacity: FILL_OPACITY_HOVER }));
      layer.on('mouseout', () => layer.setStyle({ fillOpacity: FILL_OPACITY }));
    },
  }).addTo(group);

  return group;
}
