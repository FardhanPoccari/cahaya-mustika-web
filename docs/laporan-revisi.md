# Laporan Revisi Cahaya Mustika

Tanggal: 2 November 2026.

Website asli telah direvisi menjadi paket statis lengkap berisi 55 halaman HTML. Tidak memerlukan npm, framework, instalasi dependency, atau proses build.

## Perubahan

- Navbar desktop, mobile, dan footer memakai label **Indoor** dan **Outdoor**; penanda halaman aktif disesuaikan.
- Tombol **Jeda** dihapus dari HTML, JavaScript, dan CSS. Slideshow beranda memakai satu timer, terus mengulang, serta tetap mempunyai panah dan indikator manual. Hover dan fokus tidak menghentikan putaran otomatis. Aktivitas dihentikan sementara ketika halaman tidak terlihat, menu atau galeri dibuka, atau preferensi reduced motion aktif.
- Intro halaman hanya muncul di halaman tujuan, tanpa intro keluar kedua. Inisialisasi kelima berkas JavaScript dilindungi agar tidak dijalankan ganda.
- Layout ke-4 beranda diganti bento grid asimetris. Halaman Indoor dan Outdoor juga mendapatkan bento grid dengan enam kartu, foto produk, overlay biru tua, ikon kategori, dan tautan ke produk yang tepat.
- Layout ke-5 beranda dan katalog Indoor berisi enam produk Indoor. Katalog Outdoor berisi enam produk Outdoor. Desktop memakai tiga kolom, tablet dua kolom, dan mobile satu kolom.
- Katalog menampilkan nama model sebenarnya, foto besar, spesifikasi, detail yang dapat dibuka, galeri perbesar foto, dan tombol penawaran. Model yang belum mempunyai halaman detail tersendiri diarahkan ke kartu katalog relevan; tidak dibuat halaman detail kosong.
- CTA biru **“Masih Bingung Memilih Videotron?”** diterapkan pada seluruh 55 halaman. Desktop memakai teks di kiri dan tombol putih di kanan; mobile disusun vertikal.
- Seluruh 196 tautan WhatsApp memakai **+62 811-3791-1115** (`https://wa.me/6281137911115`). Nomor lama tidak ditemukan pada kode aktif.
- Seluruh halaman detail lama yang ada tetap dipertahankan dan tautannya diperiksa. Kedua alamat listing Hikvision yang sudah ada tetap bekerja; canonical menyatukannya ke `pages/produk/hikvision.html`.

## Gambar dari spreadsheet

Kedua tab **HIKVISION** dan **Samsung** diperiksa melalui ekspor spreadsheet yang mempertahankan gambar tertanam. Foto benar-benar diekstrak dan digunakan pada website, bukan sekadar ditautkan dalam laporan.

| Kategori | Jumlah foto berbeda | Lokasi |
|---|---:|---|
| Indoor | 6 | Bento dan katalog Indoor, serta koleksi beranda |
| Outdoor | 6 | Bento dan katalog Outdoor |

Sumber: https://docs.google.com/spreadsheets/d/1QaBAxflClmKm48MenWRI-lG1YOPdxmPXbhtLe2MjT6U/edit

Nama model, tab, nomor baris, nama gambar, dan rujukan koreksi tercatat di `docs/sumber-gambar.md` dan `docs/produk.json`. Tidak ada gambar palsu atau foto tambahan yang diduplikasi untuk memenuhi jumlah kartu. Foto produk yang sama digunakan konsisten pada bento dan katalog.

Angka pitch Samsung XAT100 dan XAT067 pada spreadsheet tidak cocok dengan nama modelnya. Katalog mengikuti spesifikasi resmi Samsung. Deskripsi penggunaan VMR-O dan dimensi kabinet Hikvision DS-D4239CF-1AAB juga dikoreksi berdasarkan halaman produsen. Gambar tetap berasal dari spreadsheet.

## Optimasi dan struktur

- Foto katalog diubah ke WebP dengan margin kosong luar dipangkas. Varian 480 px dan `srcset` disediakan ketika ukuran sumber mencukupi; semua gambar mempunyai alt text serta dimensi untuk menjaga ruang layout.
- Gambar di bawah layar memakai lazy loading; gambar pertama hero diprioritaskan.
- Logo header yang semula 11.461 px diperkecil menjadi 800 px. Ukuran file turun dari sekitar 490 KB menjadi 24 KB.
- Enam PNG ilustrasi Outdoor lama yang tidak lagi dipakai serta tiga logo merek tanpa referensi dibuang. CSS dialog digabungkan dan aturan tombol Jeda yang tidak diperlukan dihapus.
- Canonical, Open Graph URL, robots, dan sitemap memakai target GitHub Pages `https://fardhanpoccari.github.io/vidiotron-indoor-outdoor/`. Sitemap hanya memuat berkas yang ada dan menghindari duplikasi alias listing.

| Jalur | Isi |
|---|---|
| `index.html` | Beranda |
| `pages/` | Indoor, Outdoor, artikel, portofolio, kontak, dan detail produk lama |
| `assets/css/` | CSS dasar, komponen bersama, dan katalog |
| `assets/js/` | Tema/menu, transisi halaman, slider, dan galeri |
| `assets/images/catalog/` | Dua belas foto produk dari spreadsheet beserta varian ukuran |
| `assets/fonts/` | Font lokal |
| `robots.txt`, `sitemap.xml`, `.nojekyll` | Berkas pendukung GitHub Pages |
| `docs/` | Laporan, sumber, hasil pengujian, dan screenshot; tidak diperlukan untuk menjalankan website |

ZIP tidak memuat `.git`, `node_modules`, package manager, server pengujian, atau berkas sementara.

## Hasil pengujian

| Pengujian | Cakupan | Hasil |
|---|---|---|
| Audit statis | 55 HTML; 1.978 elemen tautan; 429 elemen gambar; sumber CSS/JS dan gambar responsif | Tidak ditemukan file, gambar, atau target anchor internal yang hilang |
| Responsive halaman utama | Beranda, Indoor, Outdoor pada 360, 390, 768, 1024, dan 1440 px | 15/15 lulus |
| Halaman lainnya | Seluruh 52 halaman lainnya pada 390 px | 52/52 lulus |
| Pemeriksaan ulang setelah optimasi | Ketiga halaman utama pada lima ukuran yang sama | 15/15 lulus |
| Slideshow otomatis | 43 detik; dua putaran penuh; sembilan pengamatan pergantian | Terus berulang; tepat satu slide aktif |
| Reduced motion JavaScript | Preferensi disimulasikan aktif selama lebih dari 5 detik | Slide tetap, loader tertutup, semua konten tampil |
| Interaksi mobile | Buka/tutup menu, navigasi Outdoor, Escape, detail produk, galeri berikutnya, tema gelap/terang | Berfungsi |
| Jalur subfolder | Navigasi Indoor ke Outdoor di simulasi direktori proyek GitHub Pages | Berfungsi; gambar termuat |
| Sintaks JavaScript | Kelima berkas JS menggunakan pemeriksaan Node | Lulus |
| Console | Halaman yang diuji, termasuk rangkaian iframe QA | Tidak ditemukan error dari berkas website; log ekstensi browser dikecualikan |

Pemeriksaan responsive mengecek lebar dokumen, gambar gagal dimuat, jumlah H1/CTA, jumlah kartu, kartu bertumpuk, dan teks bento yang keluar dari kartu. Bukti mentah tersedia di JSON dalam `docs/`. Screenshot desktop, mobile, dan CTA berada di `docs/screenshots/`.

## Batas verifikasi

- Skor Lighthouse/PageSpeed serta Core Web Vitals pada situs live belum diuji. Tidak ada klaim skor 100 atau hasil lapangan.
- Paket ini belum dipublikasikan atau di-push ke GitHub. Jalur GitHub Pages telah diuji melalui simulasi subfolder.
- Buka langsung melalui `file://` tidak dapat diuji karena browser pengujian hanya mengizinkan HTTP(S). Situs tidak memakai fetch, import module, atau dependency build untuk konten utamanya.
- Screenshot referensi yang disebutkan dalam file instruksi tidak ikut menjadi lampiran sesi ini. Desain mengikuti rincian bento dan CTA tertulis.
- Uji responsive memakai viewport browser/iframe, bukan perangkat Android atau iPhone fisik. Reduced motion sistem operasi tidak diubah; perilaku JavaScript disimulasikan dan CSS medianya diperiksa.

## Cara menggunakan

Ekstrak ZIP. Untuk GitHub Pages, unggah **isi folder website** sehingga `index.html` berada di root repository, bersama `assets/`, `pages/`, `robots.txt`, `sitemap.xml`, dan `.nojekyll`. Folder `docs/` bersifat dokumentasi dan boleh dipertahankan atau dihapus.

Jika memakai repository atau domain lain, sesuaikan origin canonical, Open Graph URL, sitemap, dan robots sebelum publikasi. Tidak perlu menjalankan `npm install` atau perintah build.
