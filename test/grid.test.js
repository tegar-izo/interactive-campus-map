import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAxisLabels,
  buildAxisLines,
  buildGridLines,
  formatCoordinate,
  gridSteps,
  shouldShowLabels,
  spacingInPixels,
  toLatLng,
} from '../js/grid.js';
import { CONFIG } from '../js/config.js';

const BOUNDS = { minX: -20, maxX: 140, minY: -20, maxY: 130 };

test('ambang label sumbu cukup lebar agar label tidak saling tumpuk', () => {
  // Lebar label "100 m" sekitar 38 px; ambang yang lebih kecil membuat label bertumpuk.
  assert.ok(
    CONFIG.grid.labelMinPx >= 30,
    `labelMinPx terlalu kecil: ${CONFIG.grid.labelMinPx}`
  );
});

test('toLatLng membalik koordinat dunia (x, y) menjadi (lat, lng) Leaflet', () => {
  assert.deepEqual(toLatLng([10, 20]), [20, 10]);
  assert.deepEqual(toLatLng([0, 0]), [0, 0]);
  assert.deepEqual(toLatLng([-20, 130]), [130, -20]);
});

test('formatCoordinate menulis satuan dan tanda minus', () => {
  assert.equal(formatCoordinate(0, 'm'), '0 m');
  assert.equal(formatCoordinate(10, 'm'), '10 m');
  assert.equal(formatCoordinate(-10, 'm'), '-10 m');
  assert.equal(formatCoordinate(-0, 'm'), '0 m');
  assert.equal(formatCoordinate(12.3456, 'm'), '12.346 m');
});

test('gridSteps hanya menghasilkan kelipatan di dalam batas', () => {
  assert.deepEqual(gridSteps(-20, 20, 10), [-20, -10, 0, 10, 20]);
  assert.deepEqual(gridSteps(1, 9, 10), []);
  assert.deepEqual(gridSteps(0, 30, 10), [0, 10, 20, 30]);
});

test('buildGridLines melewati garis sumbu x = 0 dan y = 0', () => {
  const { vertical, horizontal } = buildGridLines(BOUNDS, 10);

  // 17 nilai vertikal (-20..140) dikurangi x = 0, 16 nilai horizontal (-20..130) dikurangi y = 0
  assert.equal(vertical.length, 16);
  assert.equal(horizontal.length, 15);
  assert.ok(!vertical.some((line) => line.x === 0));
  assert.ok(!horizontal.some((line) => line.y === 0));

  assert.equal(vertical[0].x, -20);
  assert.equal(vertical[vertical.length - 1].x, 140);
  assert.equal(horizontal[0].y, -20);
  assert.equal(horizontal[horizontal.length - 1].y, 130);
});

test('buildGridLines menggambar garis penuh dari batas ke batas', () => {
  const { vertical, horizontal } = buildGridLines(BOUNDS, 10);
  const line = vertical[0];

  assert.equal(line.y1, BOUNDS.minY);
  assert.equal(line.y2, BOUNDS.maxY);
  assert.equal(horizontal[0].x1, BOUNDS.minX);
  assert.equal(horizontal[0].x2, BOUNDS.maxX);
});

test('buildAxisLines menempatkan sumbu di titik asal', () => {
  const { xAxis, yAxis } = buildAxisLines(BOUNDS);

  assert.equal(xAxis.y, 0);
  assert.equal(yAxis.x, 0);
  assert.equal(xAxis.x1, BOUNDS.minX);
  assert.equal(xAxis.x2, BOUNDS.maxX);
  assert.equal(yAxis.y1, BOUNDS.minY);
  assert.equal(yAxis.y2, BOUNDS.maxY);
});

test('buildAxisLabels memakai satuan meter dan menyisakan satu label titik asal', () => {
  const labels = buildAxisLabels(BOUNDS, 10, 'm');

  assert.ok(labels.x.some((label) => label.text === '10 m'));
  assert.ok(labels.x.some((label) => label.text === '-10 m'));
  assert.ok(labels.x.some((label) => label.value === 0));
  assert.ok(!labels.y.some((label) => label.value === 0));

  assert.ok(labels.x.every((label) => label.position[1] === 0));
  assert.ok(labels.y.every((label) => label.position[0] === 0));
  assert.ok(labels.y.every((label) => label.side === 'left'));
  assert.ok(labels.x.every((label) => label.side === 'below'));
});

test('spacingInPixels mengikuti skala CRS.Simple', () => {
  assert.equal(spacingInPixels(10, 0), 10);
  assert.equal(spacingInPixels(10, -1), 5);
  assert.equal(spacingInPixels(10, 3), 80);
});

test('shouldShowLabels menyembunyikan label saat kisi terlalu rapat', () => {
  assert.equal(shouldShowLabels(10, 12), false);
  assert.equal(shouldShowLabels(5, 12), false);
  assert.equal(shouldShowLabels(12, 12), true);
  assert.equal(shouldShowLabels(80, 12), true);
});
