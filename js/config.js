// Semua konstanta terpusat di sini.
// Ubah nilai di file ini untuk menyesuaikan demo tanpa menyentuh logika.

export const CONFIG = {
  initialFloor: 1,

  floors: [1, 2],

  dataPaths: {
    1: 'data/floor-1.geojson',
    2: 'data/floor-2.geojson',
  },

  floorStyle: {
    1: { color: '#2c7be5', fill: '#2c7be5', label: 'Lantai 1' },
    2: { color: '#e67e22', fill: '#e67e22', label: 'Lantai 2' },
  },

  // Grid cartesius: kisi kotak + sumbu X/Y (1 unit koordinat = 1 meter).
  grid: {
    spacing: 10, // jarak antar garis kisi
    unit: 'm',
    bounds: { minX: -20, maxX: 140, minY: -20, maxY: 130 }, // area kisi digambar
    visible: true,
    // Label sumbu disembunyikan bila jarak antar garis < nilai ini.
    // 40 px ≈ lebar label "100 m", jadi label tidak pernah saling tumpuk.
    labelMinPx: 40,
  },

  // Kompas statis, utara = sumbu +Y (ke atas).
  compass: {
    size: 56,
    title: 'Utara = sumbu +Y',
  },
};
