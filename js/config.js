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
};
