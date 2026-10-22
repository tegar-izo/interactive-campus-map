// Membangun Leaflet layer dari sebuah FeatureCollection GeoJSON
// dan menerapkan style berdasarkan lantai.

import { CONFIG } from './config.js';

export function buildFloorLayer(geojson, floorId) {
  const style = CONFIG.floorStyle[floorId];
  const group = L.layerGroup();

  L.geoJSON(geojson, {
    style: {
      color: style.color,
      weight: 2,
      fillColor: style.fill,
      fillOpacity: 0.25,
    },
    onEachFeature: (feature, layer) => {
      const { nama, tipe } = feature.properties;
      layer.bindPopup(
        `<b>${nama}</b><br>
         <span style="color:${style.color}">${style.label}</span><br>
         <small style="color:#888">${tipe}</small>`
      );
      layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.5 }));
      layer.on('mouseout',  () => layer.setStyle({ fillOpacity: 0.25 }));
    },
  }).addTo(group);

  return group;
}
