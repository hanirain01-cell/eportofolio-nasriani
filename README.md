# E-Portfolio Praktik Mengajar Mandiri

Website portfolio guru PPG siap pakai, sesuai rancangan yang diberikan.

## Struktur folder
```
index.html
css/style.css
js/script.js
assets/
  foto-profil.jpg   -> ganti dengan foto profil Anda
  video/             -> simpan video mengajar (mp4) di sini
  dokumen/           -> simpan PDF (modul ajar, LKPD, ATP, CP, rubrik, dll)
  media/             -> simpan gambar/dokumentasi media pembelajaran
```

## Cara menjalankan
Cukup buka `index.html` langsung di browser, atau upload seluruh folder ini
ke hosting statis (Netlify, Vercel, GitHub Pages, cPanel, dll).

## Yang perlu Anda ganti
1. **Data pribadi** di `index.html`: nama guru, NIM, mata pelajaran, guru pamong,
   dosen pembimbing (cari teks berwarna seperti "Nama Lengkap Guru, S.Pd.").
2. **Foto profil**: ganti file `assets/foto-profil.jpg` dengan foto Anda
   (nama file harus persis sama, atau ubah path `src` di `index.html`).
3. **Video mengajar**: pada bagian "Analisis Video Mengajar", ganti
   `<div class="video-placeholder">` dengan tag `<video>` atau `<iframe>` YouTube.
4. **Dokumen**: letakkan file PDF Anda di `assets/dokumen/` lalu sesuaikan
   nama file pada atribut `href` tombol unggahan/Instrumen Penilaian.
5. **Statistik hero** (jumlah pertemuan, dokumen, dll) ada di atribut
   `data-count` pada bagian `<section id="beranda">`.

## Catatan teknis
- Warna, jarak, dan komponen (card, timeline, accordion) diatur lewat
  CSS custom properties di awal `css/style.css`, cukup ubah nilai hex di sana
  untuk mengganti seluruh palet warna sekaligus.
- Semua ikon memakai Font Awesome (CDN), font memakai Poppins + Caveat (Google Fonts, CDN).
- Animasi scroll memakai AOS (CDN). Efek loading, progress bar, counter, ripple,
  dark mode, dan accordion ditulis manual di `js/script.js` tanpa dependensi tambahan.
- `preview.html` adalah versi satu-file (CSS & JS digabung) khusus untuk pratinjau cepat;
  untuk pengembangan sehari-hari gunakan `index.html` + `css/style.css` + `js/script.js`.
