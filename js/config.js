// Semua konstanta terpusat di sini.
// Ubah nilai di file ini untuk menyesuaikan demo tanpa menyentuh logika.

export const CONFIG = {
  initialFloor: 1,

  floors: [1, 2, 3],

  dataPaths: {
    1: 'data/floor-1.geojson',
    2: 'data/floor-2.geojson',
    3: 'data/floor-3.geojson',
  },

  // Gambar denah (SVG) yang dipakai sebagai latar tiap lantai.
  // bounds = [[lintang-atas, bujur-kiri], [lintang-bawah, bujur-kanan]] dalam
  // koordinat dunia (1 unit = 1 meter). Nilai lantai 1 dikalibrasi ke
  // data/floor-1.geojson sehingga polygon ruangan menimpa denah dengan pas.
  planImages: {
    1: {
      path: 'data/floor-1-map.svg',
      bounds: [
        [57.48, -1.38],
        [-10.15, 102.98],
      ],
    },
  },

  floorStyle: {
    1: { color: '#2c7be5', fill: '#2c7be5', label: 'Lantai 1' },
    2: { color: '#e67e22', fill: '#e67e22', label: 'Lantai 2' },
    3: { color: '#27ae60', fill: '#27ae60', label: 'Lantai 3' },
  },

  // Warna polygon per tipe ruangan (properti "tipe" pada GeoJSON) agar tiap
  // jenis ruangan mudah dibedakan. Tipe yang tidak terdaftar memakai warna
  // lantai (floorStyle).
  tipeColors: {
    ibadah: '#8e44ad',
    stairs: '#7f8c8d',
    galeri: '#e67e22',
    'ruang baca': '#2980b9',
    toilet: '#16a085',
    aula: '#c0392b',
    taman: '#27ae60',
    parkir: '#546e7a',
    koridor: '#f1c40f',
    meeting: '#d35400',
    office: '#2c7be5',
    utility: '#95a5a6',
    kelas: '#e74c3c',
    laboratorium: '#3498db',
    kantor: '#9b59b6',
  },

  // Grid cartesius: kisi kotak + sumbu X/Y (1 unit koordinat = 1 meter).
  // Dimatikan agar tampilan sesuai desain; aktifkan visible + showToggle
  // untuk memunculkan kisi dan tombolnya lagi.
  grid: {
    spacing: 10, // jarak antar garis kisi
    unit: 'm',
    bounds: { minX: -20, maxX: 140, minY: -20, maxY: 130 }, // area kisi digambar
    visible: false,
    showToggle: false,
    // Label sumbu disembunyikan bila jarak antar garis < nilai ini.
    // 40 px ≈ lebar label "100 m", jadi label tidak pernah saling tumpuk.
    labelMinPx: 40,
  },

  // Kompas statis, utara = sumbu +Y (ke atas).
  compass: {
    size: 84,
    title: 'Utara = sumbu +Y',
    letters: { n: 'U', e: 'T', s: 'S', w: 'B' }, // Utara, Timur, Selatan, Barat
  },
};
