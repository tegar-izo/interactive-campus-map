# Product Requirements Document (PRD)

## Interactive Campus Map

| | |
| --- | --- |
| **Mata Kuliah** | Pengenalan Rekayasa dan Desain |
| **Dosen Pengampu** | Zainul Munir, S.T., Me.TC |
| **Tim Pengembang** | Tegar Izoelhaq (2022010), Dava Arfiansyah (2022042), Farell Fatihah Negara (2622009), Mohd Rafid Noufal M (2622028) |
| **Versi** | 1.0 (Draf) |
| **Status** | Perancangan (belum prototipe) |

---

## 1. Ringkasan Produk

Interactive Campus Map adalah web peta interaktif (dibangun dengan Leaflet.js dan GeoJSON) yang menampilkan denah per lantai di gedung Institut Teknologi Batam (Lantai 1-3). Pengguna dapat mencari ruangan dan fasilitas secara mandiri lewat browser ponsel atau desktop, tanpa instalasi aplikasi dan tanpa login.

## 2. Latar Belakang dan Masalah

Pengguna gedung seperti mahasiswa baru, tamu, orang tua, dan peserta acara sulit menemukan ruangan, fasilitas umum (toilet, tangga), dan laboratorium.

**Solusi eksisting dan keterbatasannya**

- **Peta statis cetak Lantai 1** di area tangga menuju Lantai 2. Hanya bisa dilihat setelah pengguna tiba di lokasi.
- **Papan penunjuk arah** menuju toilet dan tangga. Cakupannya belum lengkap dan tidak memuat nomor ruangan.

**Problem statement**

> Mahasiswa baru, tamu, orang tua, dan peserta acara membutuhkan peta digital yang menampilkan denah per lantai karena mengalami kesulitan menemukan ruangan dan fasilitas di area kampus, sehingga sistem ini diharapkan mempermudah dan mempercepat ditemukannya ruangan target secara mandiri.

## 3. Tujuan dan Metrik Keberhasilan

**Tujuan**

1. Pengguna menemukan ruangan target secara mandiri tanpa bertanya ke staf.
2. Pengelola memperbarui denah dengan cepat dan murah, tanpa cetak ulang.
3. Sistem berjalan dengan biaya operasional nol.

**Spesifikasi terukur**

| Parameter | Metrik | Target | Verifikasi |
| --- | --- | --- | --- |
| Akurasi peta | Kesesuaian posisi ruangan dan nomor ruangan dengan kondisi riil | 100% | Validasi langsung di gedung |
| Kecepatan load | Page load time awal | < 3,0 detik (4G/WiFi) | Google PageSpeed / GTmetrix |
| Kemudahan akses | Instalasi yang dibutuhkan | 0% (langsung via browser) | Uji lintas browser |
| Kemudahan update | Waktu memperbarui denah 1 lantai | < 30 menit, tanpa merusak struktur web | Uji coba update file data/konfigurasi |
| Biaya hosting | Biaya rutin bulanan | Rp 0 (free tier) | Evaluasi anggaran proyek |

## 4. Pengguna dan Kebutuhannya

| Pengguna | Kebutuhan |
| --- | --- |
| Mahasiswa baru | Peta mudah diakses dari ponsel untuk orientasi gedung dan mencari ruang kuliah |
| Tamu dan orang tua | Panduan lokasi yang jelas tanpa bertanya ke staf |
| Peserta acara | Petunjuk cepat ke ruang seminar, aula, atau lokasi kegiatan |
| Pengelola kampus (admin) | Memperbarui data denah saat alokasi ruang berubah, tanpa biaya cetak ulang |

## 5. Alternatif Solusi yang Dievaluasi

Skala 1-5 (semakin tinggi semakin baik).

| Alternatif | Biaya | Kemudahan Update | Aksesibilitas | Catatan |
| --- | --- | --- | --- | --- |
| Denah cetak kertas/spanduk per lantai | 4,0 | 2,0 | 3,0 | Murah di awal, sulit diperbarui, tidak interaktif |
| **Web peta interaktif (terpilih)** | 3,7 | 4,0 | 5,0 | Aksesibilitas tertinggi, mudah diperbarui, layer per lantai |
| Rambu gantung fisik / pos informasi | 1,0 | 1,0 | 3,0 | Biaya tinggi (rambu, pos, staf), pemeliharaan sulit |

**Keputusan:** web peta interaktif dipilih karena aksesibilitas tertinggi dan data denah mudah diperbarui secara digital.

## 6. Lingkup

**Dalam lingkup**

- Gedung Institut Teknologi Batam, Lantai 1, 2, dan 3.
- Denah digital per lantai, penandaan ruangan dan fasilitas umum, pencarian dan filter.

**Di luar lingkup**

- Gedung dan area lain (kantin, gedung lain, lantai di atas Lantai 3).
- Navigasi/GPS indoor real-time.
- Booking atau reservasi ruangan.

## 7. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-01 | **Denah multi-lantai.** Sistem menampilkan denah digital dengan layer per lantai (Lantai 1, 2, 3). | Must |
| FR-02 | **Tata letak ruangan.** Sistem menampilkan posisi visual dan label (nama/nomor) seluruh ruangan di tiap lantai. | Must |
| FR-03 | **Pencarian dan filter.** Pengguna mencari dan menyaring ruangan berdasarkan nama, nomor ruangan, atau kategori (Ruang Kuliah, Laboratorium, Toilet, Tangga). | Must |
| FR-04 | **Antarmuka layer interaktif.** Pengguna berpindah antar-lantai dengan cepat lewat kontrol layer, terinspirasi antarmuka peta interaktif modern. | Must |
| FR-05 | **Penanda fasilitas publik.** Toilet dan tangga ditandai di setiap lantai. | Should |
| FR-06 | **Jadwal custom per ruangan.** Pengguna menambahkan jadwal atau agenda pada ruangan tertentu; data hanya tersimpan untuk pengguna tersebut. | Should |
| FR-07 | **Info kontak dosen/staf ruangan** (tautan). | Could |
| FR-08 | **Dark mode.** | Could |

### Kriteria penerimaan (ringkas)

- **FR-01/04:** pengguna dapat beralih ke Lantai 1, 2, atau 3 dengan satu aksi, dan denah lantai yang dipilih tampil.
- **FR-02:** setiap ruangan pada denah memiliki label yang sesuai kondisi riil.
- **FR-03:** mengetik nama atau nomor ruangan menampilkan ruangan yang sesuai; memilih kategori hanya menampilkan ruangan kategori itu.
- **FR-06:** jadwal yang ditambahkan tetap ada saat halaman dibuka kembali di perangkat yang sama dan tidak terlihat oleh pengguna lain.

## 8. Kebutuhan Non-Fungsional

- **Aksesibilitas:** berbasis web penuh, terbuka di browser ponsel maupun desktop, tanpa instalasi dan tanpa registrasi/login.
- **Akurasi:** data denah dan tata letak sesuai kondisi fisik kampus.
- **Maintainability:** perubahan tata letak atau fungsi ruangan dapat diperbarui cepat dan murah.
- **Performa:** waktu muat dan render peta cepat (target pada bagian 3).

## 9. Prioritas (MoSCoW)

| Kategori | Fitur |
| --- | --- |
| **Must** | Peta interaktif per lantai; penandaan ruangan; filter dan pencarian ruangan |
| **Should** | Jadwal custom per ruangan; penanda fasilitas publik (toilet, tangga) |
| **Could** | Tautan kontak dosen/staf; dark mode |
| **Won't** | Navigasi GPS indoor real-time; booking ruangan (karena anggaran, kompleksitas teknis, dan lingkup awal) |

## 10. Pendekatan Teknis

- **Front-end:** HTML, CSS, dan JavaScript statis.
- **Pustaka peta:** Leaflet.js untuk menampilkan peta interaktif (zoom, geser, popup, kontrol layer).
- **Denah:** GeoJSON per lantai (satu layer per lantai: Lantai 1, 2, 3). Tiap ruangan dan fasilitas berupa fitur GeoJSON (poligon atau titik) yang ditampilkan lewat Leaflet.
- **Data ruangan:** properti pada fitur GeoJSON berisi ID, nama, nomor ruangan, kategori, dan lantai. Pencarian dan filter membaca properti ini, dan memperbarui denah cukup dengan mengedit file GeoJSON.
- **Layer per lantai:** kontrol layer Leaflet untuk berpindah antar-lantai (FR-04).
- **Penyimpanan jadwal custom:** sisi klien (browser) agar tanpa login dan tanpa server.
- **Hosting:** layanan static hosting gratis (free tier) agar biaya rutin Rp 0.

## 11. Kendala dan Batasan

- **Tanpa GPS real-time** di dalam ruangan.
- **Anggaran minimal:** hanya infrastruktur gratis atau berbiaya rendah.
- **Ketersediaan data denah:** jika kampus belum memiliki file vektor denah yang akurat, denah harus digambar ulang secara digital dari awal.
- **Akses terbatas:** area privat/terbatas memerlukan izin pengelola kampus sebelum ditampilkan.

## 12. Risiko dan Asumsi

| Risiko / Asumsi | Dampak | Mitigasi |
| --- | --- | --- |
| Denah vektor resmi tidak tersedia | Waktu pembuatan denah bertambah | Ukur dan gambar manual; validasi langsung di lokasi |
| Area terbatas tidak boleh ditampilkan | Denah tidak lengkap | Minta izin pengelola; tandai area sebagai "akses terbatas" atau sembunyikan |
| Perubahan alokasi ruang setelah rilis | Data tidak akurat | Data terpisah dari tampilan agar update < 30 menit |
| Asumsi: pengguna memiliki browser modern dan koneksi 4G/WiFi | Target performa tidak tercapai di jaringan lemah | Sederhanakan geometri GeoJSON dan optimalkan aset |

## 13. Pertanyaan Terbuka

- Siapa yang bertanggung jawab memperbarui data denah setelah proyek selesai (admin kampus atau tim)?
- Apakah ada daftar ruangan resmi (nama dan nomor) dari pihak kampus sebagai sumber data?
- Area mana saja di Lantai 1-3 yang bersifat terbatas?
