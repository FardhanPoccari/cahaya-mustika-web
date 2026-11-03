# Cahaya Mustika — Laporan Rev 4 Full Hero

Tanggal: 3 November 2026. Dasar revisi: ZIP terbaru `Cahaya-Mustika-Final-Indoor-Outdoor(3).zip` dan master prompt Rev 4.

Pekerjaan dilanjutkan dari hasil sebelumnya. Semua file implementasi, foto, referensi, dan verifikasi spreadsheet masih tersedia. Sesi browser yang terputus tidak menyimpan hasil akhir matriks pengujian; pengujian tersebut diselesaikan kembali tanpa membangun ulang website.

## Perubahan website

| Bagian | Hasil |
|---|---|
| Hero Beranda | Foto, judul, deskripsi, tujuan CTA, dan empat slide asli dipertahankan. Tinggi hero desktop beserta navbar menjadi 100svh. |
| Hero Indoor | H1 sesuai master prompt, deskripsi dan dua CTA, empat foto penerapan Indoor. Tombol Lihat Produk menuju `#katalog`. |
| Hero Outdoor | H1 sesuai master prompt, deskripsi dan dua CTA, empat foto penerapan Outdoor. Tombol Lihat Produk menuju `#katalog`. |
| Responsif hero | Tablet sekitar 90svh dan mobile sekitar 82svh; konten boleh menambah tinggi saat layar pendek. Tinggi navbar diukur otomatis. |
| Slider | Autoplay lima detik, loop empat slide, panah dan indikator aktif, navigasi keyboard, autoplay berlanjut setelah interaksi, tanpa tombol Jeda. Foto memakai latar gelap untuk menghindari flash putih. |
| Scroll | Indikator “Scroll untuk Jelajahi ↓” menuju bagian lokasi setelah hero. |
| Bento | Enam kartu lokasi per kategori, foto full-cover, overlay biru, geometri asimetris yang sudah ada, dan penyesuaian mobile. Bento Beranda juga menggunakan enam lokasi Indoor. |
| Katalog | Enam produk Indoor dan enam Outdoor, foto, nama, spesifikasi, detail accordion, lightbox, dan tombol penawaran dipertahankan. Halaman produk Hikvision, Samsung, LG, artikel, serta halaman lama lain tetap tersedia. |
| FAQ Beranda | Tujuh pertanyaan lama dipertahankan; semuanya tertutup saat dimuat. |
| FAQ kategori | Enam pertanyaan Indoor dan enam Outdoor; jawaban 49–53 kata. Urutan halaman: hero → enam lokasi → katalog → FAQ → CTA → footer. |
| Desain FAQ | Border tipis, radius 18px, nomor, ikon +/− dalam lingkaran, aksen biru aktif, satu pertanyaan terbuka per kelompok. Native details dan satu animasi tinggi digunakan. Pembersihan animasi setelah klik cepat telah diperbaiki. |
| CTA dan kontak | CTA biru yang sudah ada dipertahankan. Seluruh 218 tautan WhatsApp memakai `+62 811-3791-1115`. |

Enam lokasi Indoor: Ruang Meeting; Auditorium; Hotel dan Ballroom; Tempat Ibadah; Showroom dan Retail; Lobi dan Area Publik Indoor.

Enam lokasi Outdoor: Billboard Digital; Fasad Gedung; Panggung dan Event Outdoor; Stadion dan Area Olahraga; Plaza dan Area Publik; Area Komersial Outdoor.

Tombol bento menggunakan “Konsultasikan Kebutuhan →” menuju WhatsApp dengan konteks masing-masing lokasi. Halaman portofolio lama berisi contoh, sehingga tidak dijadikan detail proyek yang seolah telah terverifikasi.

## Foto dan katalog

| Hero | Slide dan sumber |
|---|---|
| Beranda | 4 foto asli ZIP: auditorium-logo, lobi rumah sakit, ruang sidang, auditorium-panorama. |
| Indoor | 4 foto: auditorium, ruang meeting, hall acara Suntec, lobi rumah sakit. Tiga dari ZIP; satu referensi berlisensi terbuka. |
| Outdoor | 4 foto: billboard Piccadilly Circus, fasad Resorts World Las Vegas, panggung Castlefest, plaza Victoria Park. Seluruhnya foto nyata berlisensi terbuka. |

Bento memakai tiga aset penerapan dari ZIP dan sembilan foto eksternal berlisensi CC0 atau CC BY-SA. Setiap kategori memiliki enam foto berbeda. Kredit fotografer, sumber, lisensi, serta keterangan perubahan tersedia di `pages/kredit-foto.html`, `docs/sumber-gambar.md`, dan `docs/foto-penerapan.json`. Foto eksternal ditandai sebagai referensi penerapan dan tidak diklaim sebagai proyek Cahaya Mustika. Tidak ada gambar generatif.

Google Sheets sumber dibuka dan kedua tab HIKVISION serta Samsung diperiksa. Dua belas gambar sumber katalog cocok dengan gambar tertanam dalam ekspor spreadsheet melalui hash SHA-256. Tidak ditemukan tautan folder Drive untuk foto penerapan. Foto dan spesifikasi katalog tidak diubah pada Rev 4.

Foto kartu **Hotel dan Ballroom** adalah hall acara Suntec Singapore Convention Centre, sebagai referensi konfigurasi ruang acara. Foto hotel dengan layar LED yang sesuai dan izin penggunaan terverifikasi belum diperoleh; foto ini tidak diberi keterangan sebagai hotel atau proyek perusahaan. Ini satu keterbatasan kecocokan lokasi foto yang masih dicatat.

Foto baru dioptimalkan menjadi WebP dengan sisi maksimum 1.600px dan varian 768px. Gambar bawah halaman memakai lazy loading, hero pertama diprioritaskan, dan dimensi gambar ditetapkan.

## SEO dan tautan

Canonical, Open Graph, robots, dan sitemap mengarah ke `https://fardhanpoccari.github.io/cahaya-mustika-web/`. Semua 56 halaman memiliki satu H1, title serta meta description unik, viewport, dan alt gambar. Structured data relevan mencakup halaman, organisasi, breadcrumb, FAQ, serta data produk yang dipertahankan.

Sitemap berisi 55 URL unik. Alias lama `pages/produk/hivision.html` tetap tersedia untuk kompatibilitas, menggunakan canonical ke halaman Hikvision utama dan `noindex, follow`, serta dikeluarkan dari sitemap. Seluruh 55 halaman asli tetap ada; satu halaman kredit foto ditambahkan. Isi utama 52 halaman di luar tiga halaman yang direvisi dipastikan tetap sama.

Audit path memeriksa tautan internal, anchor, CSS, JavaScript, srcset, dan aset. Navigasi juga diperiksa dengan prefix `/cahaya-mustika-web/`. Tidak ada dependency baru, npm, atau proses build. Tidak ada janji peringkat pencarian.

## Hasil pengujian

| Pemeriksaan | Hasil |
|---|---|
| Audit statis | 56 HTML, 2,145 elemen tautan, 452 elemen gambar, 218 tautan WhatsApp; tidak ditemukan path/anchor internal rusak atau aset gambar korup. |
| Preservasi | 55 halaman lama tersedia; 52/52 isi utama halaman lain sama; 12/12 produk kategori sama; empat foto hero Beranda sama. |
| Metadata dan sitemap | 56 title serta deskripsi unik; sitemap 55 URL sesuai target; JSON-LD valid secara sintaks. |
| JavaScript | Kelima berkas lulus `node --check`. |
| Browser responsif | **127/127 kasus lulus** di Chrome. Tiga halaman utama pada lebar 360, 390, 768, 1024, dan 1440px; 53 halaman lain pada 390 dan 1440px; tambahan tiga halaman utama pada 390×667 dan 768×500. |
| Layout browser | Tidak ditemukan horizontal overflow, gambar gagal, kartu bento bertabrakan, atau teks bento/hero terpotong pada kasus tersebut. Desktop diuji dengan hero + navbar sama dengan tinggi viewport. |
| FAQ, menu, detail | Semua FAQ awal tertutup, ikon sesuai, hanya satu terbuka, bisa ditutup, dan klik cepat tidak meninggalkan tinggi/overflow terkunci. Menu mobile dan detail produk lolos pemeriksaan. |
| Loop slider | Ketiga slider diamati selama 43 detik; masing-masing memiliki sedikitnya 9 rekaman pergantian/keadaan, satu slide aktif, dan kembali ke slide awal pada putaran berikutnya. |
| Reduced motion | Simulasi preferensi reduced motion pada JavaScript lulus: autoplay berhenti, FAQ tetap bekerja, loader selesai, elemen reveal tidak tertahan. CSS juga menyediakan aturan reduced motion. |
| Interaksi langsung | Keyboard FAQ, panah/indikator slider, autoplay setelah interaksi, scroll indicator, menu/Escape, lightbox, tema, dan navigasi dengan prefix GitHub Pages diuji; rincian ada di `uji-interaksi-rev4.json`. |
| Console | Log browser diperiksa; tidak ditemukan error dari kode website. Pesan dari ekstensi browser dicatat terpisah. |
| ZIP | Integritas CRC diperiksa dan file uji sementara tidak disertakan. |

Pengujian ukuran layar dilakukan melalui iframe dengan viewport CSS yang ditentukan, bukan perangkat fisik. Reduced motion disimulasikan pada JavaScript, bukan perubahan pengaturan sistem operasi. Pengujian tidak mencakup Safari, Firefox, perangkat Android/iPhone fisik, Lighthouse/PageSpeed pada situs live, validasi Rich Results oleh Google, atau keterjangkauan seluruh tautan eksternal. Pembukaan `file://` tidak diuji di browser. Tidak ada klaim nilai performa numerik.

## Isi paket dan penggunaan

`Cahaya-Mustika-Final-Rev-4-Full-Hero.zip` berisi website lengkap dan dokumentasi pengujian, screenshot desktop/mobile, sumber foto, serta README. Ekstrak lalu unggah **isi folder website** ke root repository sehingga `index.html`, `assets/`, `pages/`, `robots.txt`, `sitemap.xml`, dan `.nojekyll` berada langsung di root. Pertahankan halaman kredit foto dan tautannya untuk atribusi lisensi.

ZIP ini belum di-push ke GitHub dan belum dipublikasikan ulang. Pemeriksaan URL GitHub Pages menggunakan simulasi prefix lokal; deployment live masih mengikuti langkah upload/push pengguna.
