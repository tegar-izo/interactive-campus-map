// Grid cartesius: kisi kotak + sumbu X/Y untuk membaca koordinat lokal peta.
//
// Bagian atas file ini adalah fungsi murni (tanpa DOM dan tanpa Leaflet) supaya
// bisa diuji langsung dengan `node --test`. Bagian bawah membangun layer Leaflet.
//
// Konvensi: 1 unit koordinat = 1 meter, sumbu X ke kanan, sumbu Y ke atas.
// Garis sumbu digambar di titik asal (x = 0 dan y = 0).
//
// Catatan Leaflet: Leaflet selalu menyimpan posisi sebagai (lat, lng).
// Untuk CRS.Simple, lat = sumbu Y (vertikal) dan lng = sumbu X (horizontal),
// jadi koordinat dunia (x, y) harus dibalik menjadi [y, x] saat dipakai
// sebagai latlng. GeoJSON aman karena L.geoJSON menukarnya sendiri.

export const GRID_PANE = 'grid-pane';
export const AXIS_PANE = 'axis-pane';

/** Koordinat dunia (x, y) -> latlng Leaflet (lat, lng) = (y, x). */
export function toLatLng([x, y]) {
  return [y, x];
}

/** Format label koordinat: 0 -> "0 m", -10 -> "-10 m". */
export function formatCoordinate(value, unit = 'm') {
  const rounded = Math.round(value * 1000) / 1000;
  const sign = rounded < 0 ? '-' : '';
  return `${sign}${Math.abs(rounded)} ${unit}`;
}

/** Kelipatan spacing yang berada di dalam [min, max]. */
export function gridSteps(min, max, spacing) {
  const values = [];
  const first = Math.ceil(min / spacing) * spacing;
  for (let value = first; value <= max + 1e-9; value += spacing) {
    values.push(Math.round(value * 1000) / 1000);
  }
  return values;
}

/**
 * Garis kisi vertikal & horizontal.
 * Garis di x = 0 dan y = 0 dilewati karena digambar terpisah sebagai sumbu.
 */
export function buildGridLines(bounds, spacing) {
  const vertical = [];
  const horizontal = [];

  for (const x of gridSteps(bounds.minX, bounds.maxX, spacing)) {
    if (x === 0) continue;
    vertical.push({ x, y1: bounds.minY, y2: bounds.maxY });
  }

  for (const y of gridSteps(bounds.minY, bounds.maxY, spacing)) {
    if (y === 0) continue;
    horizontal.push({ y, x1: bounds.minX, x2: bounds.maxX });
  }

  return { vertical, horizontal };
}

/** Garis sumbu: sumbu Y di x = 0, sumbu X di y = 0. */
export function buildAxisLines(bounds) {
  return {
    yAxis: { x: 0, y1: bounds.minY, y2: bounds.maxY },
    xAxis: { y: 0, x1: bounds.minX, x2: bounds.maxX },
  };
}

/**
 * Label sumbu: sumbu X dilabeli di bawah garis (y = 0),
 * sumbu Y dilabeli di kiri garis (x = 0). Titik asal dilabeli satu kali saja.
 */
export function buildAxisLabels(bounds, spacing, unit = 'm') {
  const x = [];
  const y = [];

  for (const value of gridSteps(bounds.minX, bounds.maxX, spacing)) {
    x.push({
      value,
      position: [value, 0],
      side: 'below',
      text: formatCoordinate(value, unit),
    });
  }

  for (const value of gridSteps(bounds.minY, bounds.maxY, spacing)) {
    if (value === 0) continue;
    y.push({
      value,
      position: [0, value],
      side: 'left',
      text: formatCoordinate(value, unit),
    });
  }

  return { x, y };
}

/** Jarak antar garis dalam piksel layar (CRS.Simple: 1 unit = 1 px pada zoom 0). */
export function spacingInPixels(spacing, zoom) {
  return spacing * Math.pow(2, zoom);
}

/** Label sumbu hanya ditampilkan selama kisi masih cukup terbaca. */
export function shouldShowLabels(spacingPx, minPx) {
  return spacingPx >= minPx;
}

/* ------------------------------------------------------------------ *
 * Layer Leaflet
 * ------------------------------------------------------------------ */

/** Kisi kotak tipis, berada di bawah polygon lantai. */
export function buildGridLayer(config) {
  const { bounds, spacing } = config;
  const layer = L.layerGroup();
  const lines = buildGridLines(bounds, spacing);

  const style = { pane: GRID_PANE, color: '#8a8a8a', weight: 1, opacity: 0.35, interactive: false };

  lines.vertical.forEach((line) => {
    L.polyline([toLatLng([line.x, line.y1]), toLatLng([line.x, line.y2])], style).addTo(layer);
  });

  lines.horizontal.forEach((line) => {
    L.polyline([toLatLng([line.x1, line.y]), toLatLng([line.x2, line.y])], style).addTo(layer);
  });

  return layer;
}

/** Garis sumbu X dan Y, berada di atas polygon lantai. */
export function buildAxisLayer(config) {
  const { bounds } = config;
  const layer = L.layerGroup();
  const { xAxis, yAxis } = buildAxisLines(bounds);
  const style = { pane: AXIS_PANE, color: '#333333', weight: 2, opacity: 0.75, interactive: false };

  // Sumbu X: garis horizontal pada y = 0.
  L.polyline([toLatLng([xAxis.x1, xAxis.y]), toLatLng([xAxis.x2, xAxis.y])], style).addTo(layer);
  // Sumbu Y: garis vertikal pada x = 0.
  L.polyline([toLatLng([yAxis.x, yAxis.y1]), toLatLng([yAxis.x, yAxis.y2])], style).addTo(layer);

  return layer;
}

/** Label angka pada sumbu, misalnya "10 m". */
export function buildLabelLayer(config) {
  const { bounds, spacing, unit } = config;
  const layer = L.layerGroup();
  const labels = buildAxisLabels(bounds, spacing, unit);

  const addLabel = (label, modifier) => {
    L.marker(toLatLng(label.position), {
      pane: AXIS_PANE,
      interactive: false,
      keyboard: false,
      icon: L.divIcon({
        className: `axis-label ${modifier}`,
        html: `<span class="axis-label__text">${label.text}</span>`,
        iconSize: [0, 0],
      }),
    }).addTo(layer);
  };

  labels.x.forEach((label) => addLabel(label, 'axis-label--x'));
  labels.y.forEach((label) => addLabel(label, 'axis-label--y'));

  return layer;
}

/* ------------------------------------------------------------------ *
 * Kontrol
 * ------------------------------------------------------------------ */

/** Tombol toggle "Grid" di panel kontrol (dibuat oleh floor-control.js). */
export function createGridToggle({ container, active = true, onToggle }) {
  const separator = document.createElement('div');
  separator.className = 'panel-separator';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'grid-toggle';
  button.classList.toggle('active', active);
  button.setAttribute('aria-pressed', String(active));
  button.innerHTML =
    '<span class="grid-toggle__icon" aria-hidden="true">▦</span><span>Grid</span>';

  button.addEventListener('click', () => {
    const next = !button.classList.contains('active');
    button.classList.toggle('active', next);
    button.setAttribute('aria-pressed', String(next));
    onToggle(next);
  });

  container.append(separator, button);
  return button;
}

/**
 * Mengpasang grid + sumbu + label pada peta, lengkap dengan tombol toggle.
 * Kisi, sumbu, dan label dipisahkan agar urutannya tidak berubah saat
 * layer lantai ditukar.
 */
export function createGridControl({ map, config, container }) {
  const gridLayer = buildGridLayer(config);
  const axisLayer = buildAxisLayer(config);
  const labelLayer = buildLabelLayer(config);

  let visible = config.visible !== false;
  let labelsVisible = false;

  function syncLabels() {
    const show =
      visible && shouldShowLabels(spacingInPixels(config.spacing, map.getZoom()), config.labelMinPx);
    if (show === labelsVisible) return;
    labelsVisible = show;
    if (show) {
      map.addLayer(labelLayer);
    } else {
      map.removeLayer(labelLayer);
    }
  }

  function setVisible(next) {
    visible = next;
    if (next) {
      map.addLayer(gridLayer);
      map.addLayer(axisLayer);
      syncLabels();
    } else {
      map.removeLayer(gridLayer);
      map.removeLayer(axisLayer);
      map.removeLayer(labelLayer);
      labelsVisible = false;
    }
  }

  map.on('zoomend', syncLabels);

  const toggle = createGridToggle({
    container,
    active: visible,
    onToggle: (active) => setVisible(active),
  });

  if (visible) {
    map.addLayer(gridLayer);
    map.addLayer(axisLayer);
    syncLabels();
  }

  return { setVisible, toggle, gridLayer, axisLayer, labelLayer };
}
