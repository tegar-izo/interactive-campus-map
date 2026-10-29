# interactive-campus-map

Peta indoor kampus berbasis Leaflet (`CRS.Simple`) dengan UI mengikuti mockup `Mobile.png`: header judul, denah SVG sebagai latar, polygon ruangan GeoJSON di atasnya, kompas di kanan atas, tombol lantai bulat, dan label lantai di bawah.

## Menjalankan

GeoJSON dan denah diambil lewat `fetch`, jadi harus lewat HTTP server (bukan `file://`):

```bash
npm run dev      # python3 -m http.server 8000
```

Lalu buka <http://localhost:8000>.

## Test

```bash
npm test         # node --test, tanpa dependency
```

## Struktur

| File | Isi |
| --- | --- |
| `js/config.js` | Semua konstanta: `CONFIG.planImages`, `CONFIG.grid`, `CONFIG.compass`, gaya lantai, dan warna per tipe ruangan (`CONFIG.tipeColors`) |
| `js/grid.js` | Kisi, sumbu, label koordinat, dan tombol toggle Grid (opsional) |
| `js/compass.js` | Kompas statis (utara = sumbu +Y) |
| `js/map-init.js` | Inisialisasi peta, pane denah/kisi/sumbu |
| `js/layers.js` | Overlay denah SVG + polygon ruangan per lantai, popup, label ruangan |
| `js/data-loader.js` | Pengambilan GeoJSON |
| `js/floor-control.js` | Tombol bulat pemilih lantai |
| `js/main.js` | Perakitan aplikasi, label lantai, fit tampilan per lantai |

## Data

| File | Catatan |
| --- | --- |
| `data/floor-1.geojson` | Ruangan Lantai 1 |
| `data/floor-2.geojson` | Ruangan Lantai 2 |
| `data/floor-3.geojson` | **Data contoh** Lantai 3 (belum divalidasi ke gedung) |
| `data/floor-1-map.svg` | Gambar denah Lantai 1, dipasang lewat `CONFIG.planImages[1]` |

Lantai yang punya `planImages` memakai gambar denah sebagai latar; lantai tanpa gambar menampilkan nama ruangan sebagai label di tengah polygon. Warna isi polygon diambil dari `CONFIG.tipeColors` berdasarkan properti `tipe` tiap fitur, dengan warna lantai sebagai cadangan.

### Kalibrasi overlay denah

`bounds` pada `CONFIG.planImages` memetakan viewBox SVG ke koordinat dunia (1 unit = 1 meter) yang dipakai GeoJSON. Nilai Lantai 1 dihitung dari batas dinding denah (x 100–2140, y 50–1150 pada SVG) yang dipetakan ke `floor-1.geojson` (x 0,1–101, y 1,7–56). Jika SVG diganti atau digeser, cukup perbarui `bounds` di `js/config.js`.

Geometri `floor-1.geojson` diambil langsung dari garis dinding SVG (koordinat viewBox yang sama), jadi setiap polygon ruangan menimpa dinding denah dengan pas: Mushola, Tangga Barat, Galery PMB, Perpustakaan, Tangga Timur, Toilet Wanita, Toilet Pria, Auditorium, Taman, Parkiran, dan area koridor. Saat menggambar ulang denah, ambil koordinat dinding dari SVG lalu konversi dengan `bounds` di atas.

## Konvensi koordinat

- 1 unit koordinat = **1 meter**, sumbu X ke kanan, sumbu Y ke atas.
- Titik asal (0, 0) berada di pojok kiri-bawah area denah; sumbu digambar tepat di titik asal.
- Leaflet menyimpan posisi sebagai `(lat, lng)`, sedangkan `CRS.Simple` memetakan `lat` ke sumbu Y. Karena itu koordinat dunia `(x, y)` dibalik menjadi `[y, x]` lewat `toLatLng()` di `js/grid.js`. GeoJSON dan `L.imageOverlay` tidak perlu perlakuan ini karena Leaflet menukarnya sendiri.
- Grid, sumbu, dan label memakai pane Leaflet terpisah supaya urutannya tidak berubah saat ganti lantai. Grid nonaktif secara default (`CONFIG.grid.visible`), aktifkan bersama `CONFIG.grid.showToggle` untuk memunculkannya lagi.
- Zoom memakai `zoomSnap: 0.1` agar denah pas mengisi layar saat `fitBounds`.

## Deploy

Aplikasi ini statis tanpa build step, jadi **GitHub Pages** cukup (Pages menyajikan repo apa adanya; `package.json` diabaikan browser). Aktifkan Pages dari branch `main`. `npm test` tidak berjalan di Pages — jalankan manual atau lewat GitHub Actions.
