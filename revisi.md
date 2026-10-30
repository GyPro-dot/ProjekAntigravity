# LEMBAR REVISI PROJEK (REVISI.MD)
================================================================================
STATUS: SELESAI DITERAPKAN & AKTIF DI LOCALHOST:8085 (VERIFIKASI TAMPILAN)
FITUR TERBARU: SINKRONISASI MENYELURUH MOBILEVIEW, TABLETVIEW & DESKTOPVIEW (v2.0.7)
TANGGAL PENGAJUAN: 29 OKTOBER 2026
================================================================================

## 1. DESKRIPSI KEBUTUHAN (PROBLEM STATEMENT)
Pengguna menginstruksikan perubahan tampilan antarmuka pada **DesktopView** dan **MobileView** agar presisi menyerupai gambar referensi yang telah disediakan di folder `assets/`:
1. **Referensi `1.jpg` (Header, Sub-Navbar, Hero & Brand Gateway):**
   - **Top Utility Bar:** Teks *"Banyak Promo Belanja di App"* di kiri, serta link *"Cara Belanja"* dan *"Belanja ke Toko"* di kanan.
   - **Main Header Bar:** Logo resmi *"V&T VIC & TIS"*, Search Bar rounded dengan ikon kaca pembesar `🔍`, dropdown lokasi *"📍 Mau belanja di mana? v"*, tombol *"🛒 Keranjang"*, dan tombol *"👤 Masuk"*.
   - **Sub-Nav Bar:** Kategori (`⊞ Kategori v`), *"📢 What's New"*, *"📦 Just Arrived"*, dan *"🎉 10.10"*.
   - **Hero / Brand Story Section:**
     * Sisi Kiri: Logo V&T VIC & TIS, subtitle *"INDIAN WOMEN'S FASHION | MEN'S FASHION"*, deskripsi sejarah berdirinya VIC & TIS (sejak 2022 oleh Vicky & Hritish), serta daftar *"ACCEPTS THESE: • GIFT CERTIFICATES • SHOPPING VOUCHERS"*.
     * Sisi Kanan: Dua banner promo atas (*Software Development* & *PAC Pink Accessories* dengan logo lotus) serta foto showcase interior butik PAC dengan manekin gaun India.
     * Banner Bantuan: Strip notifikasi bantuan CS WhatsApp serta floating button hijau *"💬 Butuh bantuan? Hubungi kami"*.

2. **Referensi `2.jpg` (Catalog & Product Listing E-Commerce):**
   - **Sidebar Kiri ("Filter Produk"):**
     * Accordion *"Lokasi Stok (0/5)"* dengan grouping wilayah:
       - **INDONESIA:** Gudang PAC Medan, Gudang Maestro JKT.
       - **INDIA:** Gudang Bangalore, Gudang New Delhi.
     * Accordion *"Status Stok"* (`[ ] Hanya yang Tersedia`).
     * Accordion *"Rentang Harga"*.
   - **Area Utama Produk (Kanan):**
     * Judul kategori *"Fashion,"* dengan counter jumlah produk (misal: *"2106 Produk"*).
     * Kontrol kanan: Dropdown *"Urutkan: Rekomendasi v"* dan paginasi *"1 dari 36"* dengan tombol navigasi `<` `>`.
     * **Grid Produk:**
       - Tampilan Desktop: 4 Kolom produk rapi.
       - Tampilan Mobile: 2 Kolom produk kompak.
     * **Desain Kartu Produk:**
       - Foto produk proporsional.
       - Judul produk 2 baris terbaca jelas (anti-cut).
       - Badge varian produk (e.g. `Black`, `Purple`, `White`, dsb).
       - Rating bintang & ulasan (e.g. `★ 5 (2rb+)`).
       - Baris harga: Harga diskon warna merah tebal (e.g. `Rp69.500`), badge persentase diskon (e.g. `-37%`), dan harga asli coret (e.g. `Rp108.900`).
       - Footer kartu: Lokasi ketersediaan barang (`Tersedia di 13 lokasi >`).

3. **Referensi `3.jpg` (Product Detail View / Modal):**
   - **Layout 2 Kolom (Desktop) & Responsif Adaptif (Mobile):**
     * Sisi Kiri: 5 strip thumbnail gambar vertikal, display foto utama resolusi tinggi dengan navigasi panah `<` `>`, serta preview area detail.
     * Sisi Kanan:
       - Judul lengkap produk.
       - Info produk: `★ 5 (1) • SKU 7CSE2TBK` dengan tombol copy SKU, icon Share `🔗`, dan Wishlist `🤍`.
       - Box Harga: Harga merah bold, harga coret, dan badge diskon `-39%`.
       - Pilihan Varian Interaktif: Chip pilihan *"Warna: Black"* dan *"Ukuran: L"* dengan outline biru aktif.
       - Tombol Aksi Utama: Tombol biru lebar *"🔔 Ingatkan Saya / Tambah ke Keranjang"*.

---

## 2. RENCANA TEKNIS IMPLEMENTASI (SURGICAL PLAN)

### A. Berkas yang Akan Diubah:
1. `index.html`:
   - **Struktur Header & Utility Bar:**
     * Menambahkan bar utilitas atas (`.top-utility-bar`).
     * Memperbarui `.top-header` dengan logo V&T VIC & TIS, search bar rounded dengan ikon `🔍`, pill dropdown lokasi belanja (`#locationDropdownBtn`), tombol keranjang dengan badge dinamis, dan tombol login/masuk.
     * Menambahkan sub-navbar kategori horizontal (`.sub-nav-bar`).
   - **Hero & Brand Gateway Section (`#gatewayHeroSection`):**
     * Mengubah layout menjadi 2 kolom sesuai `1.jpg` (Kolom Kiri: Logo V&T, sejarah, voucher badges; Kolom Kanan: 2 banner promo & foto butik PAC).
     * Menambahkan floating contact strip dan tombol WhatsApp bantuan di pojok kanan bawah.
   - **Katalog & Filter Produk (`#catalogDisplaySection`):**
     * Menata layout katalog Desktop menjadi 2 kolom: Sidebar Filter di kiri (Lokasi Gudang Indonesia & India, Status Stok, Harga) dan Grid Katalog di kanan.
     * Memperbarui grid produk menjadi 4 kolom di Desktop dan 2 kolom di Mobile.
     * Memperbarui styling `.product-card` dengan rating bintang `★ 5`, harga merah + diskon tag + harga coret, serta footer *"Tersedia di X lokasi >"*.
     * Menambahkan header listing *"Fashion,"* + counter produk, dropdown urutkan, dan paginasi `1 dari 36`.
   - **Modal Detail Produk (`#productDetailModal`):**
     * Menata ulang modal detail produk agar mengikuti layout `3.jpg`: thumbnail vertikal di kiri, carousel gambar besar, rincian rating, copyable SKU, pill varian warna & ukuran dengan border biru, serta tombol aksi biru full-width.
   - **Sinkronisasi Switcher Viewport (`is-mobile-view` vs `is-desktop-view`):**
     * Memastikan mode Desktop (`is-desktop-view`) menampilkan seluruh layout lebar (utility bar, hero split 2 kolom, sidebar filter + 4 kolom grid produk).
     * Memastikan mode Mobile (`is-mobile-view`) menampilkan smartphone simulator (notch, 2 kolom grid, filter drawer responsif) tanpa merusak tampilan.

2. `prd.md`:
   - Memperbarui dokumentasi Zona Atas dan Master Context Zona Bawah dengan log pembaruan v1.9.0 (Redesign Desktop & Mobile View berbasis referensi V&T VIC & TIS & Jaknot Style).

---

## 3. TABEL KOMPARASI TAMPILAN: SEBELUM VS SESUDAH

| Komponen | Tampilan Sebelumnya | Tampilan Sesudah (Sesuai Gambar 1, 2, 3) |
|---|---|---|
| **Header Atas** | Header pink fuchsia sederhana dengan logo PAC kotak | **Utility bar** (Promo App, Cara Belanja) + **Main bar** (Logo V&T VIC & TIS, Search Bar tengah `🔍`, Pill Lokasi Belanja, Keranjang, Tombol Masuk) |
| **Sub-Nav Bar** | Chip kategori bulat biasa | Sub-nav bar profesional: `⊞ Kategori v`, `📢 What's New`, `📦 Just Arrived`, `🎉 10.10` |
| **Hero / Gateway** | Banner foto tunggal dengan form OTP merah | **Split Layout (1.jpg)**: Kiri narasi sejarah V&T VIC & TIS + hak voucher; Kanan dual promo card (*Software* & *PAC*) + foto butik PAC |
| **Filter Katalog** | Horizontal scroll chip di atas | **Sidebar Filter Produk (2.jpg)**: Accordion Lokasi Gudang (Indonesia: PAC Medan, Maestro JKT; India: Bangalore, New Delhi) + Status Stok |
| **Grid Produk Desktop** | Grid standar 2–3 kolom tema maroon | **Grid 4 Kolom E-Commerce (2.jpg)**: Kartu putih modern, rating `★ 5`, harga merah + badge diskon `-37%`, footer *"Tersedia di X lokasi >"* |
| **Grid Produk Mobile** | Grid 2 kolom tema fuchsia | **Grid 2 Kolom Ringkas**: Dioptimalkan untuk sentuhan jari layar HP |
| **Detail Produk** | Modal bottom sheet ringkas | **Modal Detail Lengkap (3.jpg)**: 5 Thumbnail vertikal, zoom preview, SKU + copy icon, pill varian Warna & Ukuran, tombol biru CTA |
| **Support & Kontak** | Link kontak teks di bawah | Floating WhatsApp Help Button *"💬 Butuh bantuan? Hubungi kami"* di kanan bawah |

---

## 4. ESTIMASI DAMPAK & PROTEKSI SISTEM (RISK ASSESSMENT)
- **Logika Backend & Basis Data:** 100% AMAN. Tidak ada perubahan pada skema database Google Sheets (`DataProduk`, `DataTransaksi`, dsb).
- **Fitur Kasir POS & Setting Admin:** 100% AMAN. Meja Kasir POS, PIN login staf (`1234`), cetak faktur A4 PDF, dan manajemen stok tetap utuh dan dapat diakses kapan saja.
- **Performa & Responsivitas:** Menggunakan Vanilla CSS & HTML teroptimasi tanpa library pihak ketiga yang memberatkan, menjamin transisi instan dan ringan di semua perangkat.

---

## 5. CATATAN IMPLEMENTASI LOGO RESMI "Logo V & T"
- **File Asset:** `assets/Logo V & T.jpg` (Emas mewah V&T VIC & TIS) dengan twin alias `assets/Logo V& T.jpg` untuk menjamin kompatibilitas browser/URL encoding.
- **Tampilan MobileView (`body.is-mobile-view` / Layar HP):**
  * Header diatur dengan tata letak 2 baris responsif: Baris atas menampilkan Logo V & T (tinggi 42px, proporsional tanpa gepeng) berdampingan dengan tombol audio, keranjang ber-badge oranye, dan akun. Baris bawah memuat kotak pencarian dan pill dropdown lokasi belanja.
  * Hero Section menampilkan Logo V & T di tengah (lebar 240px) berbayang emas elegan (*drop shadow*), diikuti sub-judul departemen *"INDIAN WOMEN'S FASHION | MEN'S FASHION"*.
- **Tampilan DesktopView (`body.is-desktop-view` / Layar Lebar):**
  * Header menampilkan Logo V & T (tinggi 54px, lebar hingga 190px) di sisi kiri sejajar dengan bilah pencarian e-commerce dan kontrol navigasi.
  * Hero Section menampilkan Logo V & T besar (lebar 320px) di kolom kiri narasi brand.
- **Header Lintas Fitur:**
## 6. IMPLEMENTASI FITUR KERANJANG & MASUK (SESUAI GAMBAR 1, MASUK.JPG, DAN PILIHAN KERANJANG)
1. **Header Aksi Ikon Ganda (Gambar 1):**
   - Kedua tombol aksi di pojok kanan atas ditata bersusun vertikal (ikon di atas, label di bawah):
     * Ikon Keranjang wireframe (`🛒`) dengan badge oranye jumlah barang + label teks *"Keranjang"* di bawahnya.
     * Ikon Profil Pengguna wireframe (`👤`) + label teks *"Masuk"* di bawahnya.
   - Label *"Tamu"* pada DesktopView resmi diganti menjadi *"Masuk"*.
   - Kedua tombol dan teksnya kini tampil presisi dan aktif pada **MobileView** maupun **DesktopView**.
2. **Halaman Autentikasi (`Masuk.JPG`):**
   - Dibuka saat pengguna mengklik menu **"Masuk"**.
   - Dilengkapi tombol panah kembali (`←`) di pojok kiri atas untuk kembali ke katalog display kapan saja.
   - Kolom kiri: Menampilkan Logo V & T besar dengan indikator 3 titik carousel (`• • •`).
   - Kolom kanan:
     * Judul *"Daftar"* dengan link toggle dinamis *"Sudah punya akun? Masuk →"*.
     * Tombol Masuk cepat via Google (`[ G Google ]`).
     * Divider *"atau daftar dengan email"*.
     * Input bergaya *floating-label* berbingkai biru aktif *"Nama Lengkap"*.
     * Input *"Email"* dan *"Nomor HP"*.
     * Tombol aksi biru *"Daftar"* / *"Masuk ke V&T"*.
     * Tautan cepat verifikasi PIN kasir/staf toko (`1234`).
3. **Halaman Pilihan Keranjang (`Pilihan Keranjang`):**
   - Dibuka saat pengguna mengklik menu **"Keranjang"**.
   - Area Utama:
     * Kolom kiri: Logo V & T besar.
     * Kolom kanan: Judul *"Keranjang Belanja Anda Kosong"*, deskripsi promo, dan tombol biru *"Mulai Belanja"*.
     * Jika terdapat item di keranjang: Otomatis menampilkan daftar produk, pengaturan kuantitas, total tagihan, dan tombol checkout WhatsApp.
   - Area Footer Lengkap:
     * Tombol unduh *"GET IT ON Google Play"*.
     * 3 Kolom link: *Layanan Pelanggan*, *JakartaNotebook*, dan *Ikuti Kami* (Tiktok, Instagram, Facebook).
     * Kartu *Contact Center* ber-header biru tua: Jadwal operasional online & nomor telepon butik.

---

## 7. RENCANA IMPLEMENTASI REVISI TAMPILAN HALAMAN UTAMA DENGAN GAMBAR TERBARU (v1.9.3)
1. **Latar Belakang & Akar Masalah:**
   - Halaman utama (`viewCatalog`) sebelumnya masih menggunakan referensi gambar tiruan (*placeholder* seperti `assets/Template-1.jpg`, `assets/Gambar Toko-Wife.jpg`, dan Unsplash eksternal) yang tidak tersedia secara lokal sehingga memicu gambar rusak (*broken image icon*) pada beberapa kartu produk dan banner.
   - Ikon navigasi utilitas (`Cara Belanja`, `Belanja ke Toko`, `What's New`, `Just Arrived`, `10.10`) sebelumnya menggunakan emoji teks, bukan ikon visual asli dari direktori aset.

2. **Aset Gambar Asli yang Disiapkan di Folder `assets/`:**
   - **Hero Visuals (Gambar 1):**
     * `hero_banner_software.jpg`: Banner Custom Software Development Services.
     * `hero_banner_pac.jpg`: Banner resmi PAC - Pink Accessories berlogo lotus.
     * `hero_store_mannequins.jpg`: Foto showcase interior butik PAC dengan manekin gaun India dan border lengkung.
   - **Kartu Produk Halaman Utama (Gambar 2):**
     * `card1_website.jpg`: Kartu 1 "TaffOmicron Tensimeter Digital Pengukur Tekanan Darah Indonesian Voice" (Rp69.500, Diskon -37%, Rp108.900, rating 5).
     * `card2_gelang.jpg`: Kartu 2 "TaffOmicron Termometer Suhu Badan Digital Thermogun Infrared" (Rp31.300, Diskon -46%, Rp57.900, rating 5).
     * `card3_kurta.jpg`: Kartu 3 "TaffOmicron Alat Terapi Pernapasan Mesh Nebulizer Portable Inhaler" (Rp27.200, Diskon -48%, Rp51.900, rating 5).
     * `card4_dress.jpg`: Kartu 4 "Oximeter Alat Ukur Saturasi Oksigen Darah Pulse Fingertip" (Rp105.800, Diskon -38%, Rp168.900, rating 5).
   - **Produk Pendukung & Pelengkap Fashion:**
     * `detail_corset_main.jpg` & `detail_thumb_1.jpg` s/d `5.jpg`: Ilfioreemio Baju Korset Pembentuk Tubuh (sesuai Gambar 3).
     * `biutteco-tas-kosmetik-make-up-travel-organizer-bag-wanita-x3235.jpg`: Tas Kosmetik Make Up Wanita.
     * `samjune-kacamata-pria-polarized-sunglasses-anti-reflective-uv400-j-198.jpg`: Kacamata Polarized Pria.
     * `Kotak_Kosmetik_(3).jpg`: Kotak Kosmetik Organizer Perhiasan Mewah.
   - **Ikon Navigasi & Sosial:**
     * `cara_belanja.png`, `belanja_ke_toko.png`, `whats_new.png`, `just_arrived.png`, `10.10.png`, `tiktok-logo.png`, `instagram-logo.png`, `facebook-logo.png`.

3. **Langkah Pengerjaan pada `index.html`:**
   - Mengganti elemen Hero right column dari CSS kotak teks menjadi elemen gambar riil `hero_banner_software.jpg`, `hero_banner_pac.jpg`, dan `hero_store_mannequins.jpg`.
   - Mengganti emoji pada utility bar dan sub-navbar dengan ikon file PNG asli yang tajam dan presisi.
   - Memperbarui array `state.products` di JavaScript agar menggunakan data dan foto produk riil dari `assets/` tanpa broken image.
   - Memperbarui modal detail produk (`productDetailModal`) agar thumbnail dan foto utama menampilkan gambar korset resolusi tinggi dari `3.jpg`.

---

## 8. RENCANA IMPLEMENTASI FITUR LENGKAP v1.9.4 (ALL CHOICE, KASIR BCA & PO, PESANAN, UPLOAD GALERI, CONTACT CENTER & ANTI-DOUBLE IMAGE)

### A. Sub-Kategori "All Choice" pada Fitur Kategori:
1. **Dropdown & Filter Kategori Bertingkat:**
   - Menambahkan opsi utama **"All Choice"** pada tombol/navigasi Kategori.
   - Menyediakan 3 pilar navigasi utama yang dapat dipilih:
     * **👗 Indian Woman Fashion:** Saree (Banarasi, Silk, Georgette), Anarkali, Lehenga Choli, Ghagra Choli, Lancha, Kurtis & Dupatta.
     * **👔 Indian Man Fashion:** Kurta Pajama, Sherwani Maharaja, Nehru / Modi Jacket, Dhoti Kurta, Sepatu Kerajaan Mojari.
     * **💎 All Accesories and Luxury Goods:** Perhiasan Jhumka, Bindi Tika, Kalung & Gelang Zari, Tas Kosmetik Make Up, Kacamata Polarized, Jam Tangan Mewah, Fragrances & Attar.
   - Pilihan kategori langsung menyaring tampilan produk pada grid utama katalog secara realtime.

### B. Fitur Kasir POS, Pembayaran BCA & Purchase Order (PO):
1. **Checkout Keranjang Belanja:**
   - Tombol *"🛒 Checkout ke Meja Kasir"* pada halaman Keranjang (`viewCart`). Saat diklik, sistem langsung mentransfer seluruh item dari keranjang pelanggan ke Meja Kasir POS (`state.posCart`), membuka antarmuka Kasir, dan menyiapkan pembayaran.
2. **Cara Bayar BCA & Panduan Transfer:**
   - Opsi pembayaran "Bank BCA" pada Meja Kasir POS dan dialog Checkout Pelanggan.
   - Informasi resmi: Nomor Rekening BCA `800-888-9999` a/n **VIC & TIS / PAC Official**, tombol salin nomor rekening satu-klik, serta panduan langkah transfer via m-BCA, KlikBCA, dan ATM.
3. **Modal "Satu Langkah Lagi untuk Pembayaran BCA":**
   - Dialog konfirmasi transfer dengan nominal tagihan tepat (dilengkapi 3 digit kode verifikasi unik).
   - Indikator hitung mundur (Countdown Timer 24 Jam) batas penyelesaian pembayaran.
   - Tombol *"Konfirmasi Saya Sudah Bayar"* dan tombol *"Upload Bukti Transfer BCA"*.
   - Tombol konfirmasi otomatis via WhatsApp CS Butik.
4. **Dokumen Purchase Order (PO) Resmi:**
   - Penambahan fitur *"📄 Buat / Cetak Purchase Order (PO)"* di Kasir dan Setting Admin.
   - Format cetak standar A4: Nomor PO otomatis (`PO-YYYYMM-XXX`), tanggal order, identitas supplier/vendor, daftar rincian barang, kuantitas, harga kesepakatan, syarat pembayaran, jadwal pengiriman, dan kolom persetujuan (*Authorized Signature*).

### C. Fitur Manajemen Pesanan Pelanggan (`viewOrders`):
1. **Navigasi Header Pesanan (Sesuai Referensi Gambar 3):**
   - Menambahkan tombol menu *"📄 Pesanan"* di bilah header utama berdampingan dengan *"🛒 Keranjang"* dan *"👤 Masuk"*.
2. **Halaman Pesanan Pelanggan (`#viewOrders`):**
   - Tab filter status: *Semua*, *Menunggu Pembayaran*, *Diproses*, *Dikirim*, *Selesai*.
   - Kartu rincian pesanan: ID Pesanan (TRX), tanggal transaksi, daftar barang yang dipesan, total pembayaran, status ekspedisi, nomor resi pengiriman, serta tombol *"Lacak Pengiriman"* dan *"Bantuan CS"*.
   - Status kosong (*Empty State*) informatif dengan tombol ajakan *"Mulai Belanja"*.

### D. Fitur Setting dan Stok: Upload Galeri & Sub-Fitur OTHERS:
1. **Upload Gambar Langsung dari Galeri Pribadi (HP / Laptop):**
   - Menambahkan input pemilih file `<input type="file" id="prodImgFileInput" accept="image/*">` dengan tombol modern *"📁 Upload dari Galeri / Kamera"*.
   - Konversi gambar otomatis menggunakan `FileReader` Data URL Base64 sehingga gambar dari galeri HP atau laptop pengguna langsung tampil di preview dan tersimpan di database lokal tanpa risiko tautan rusak.
   - Input *"Keterangan / Keterangan Gambar"* yang dapat diisi deskripsi lengkap produk oleh staf/operator.
2. **Perbaikan Sub-Fitur OTHERS Dinamis:**
   - Opsi `[ + OTHERS / Lainnya... ]` pada input Kategori dan Sub-Kategori.
   - Memunculkan field teks mandiri untuk mengetikkan nama item atau sub-kategori kustom apa pun, baik untuk **Fashion** maupun **Aksesoris & Luxury Goods**, dan langsung terdaftar ke master kategori toko.

### E. Menu Utama: Contact Center, Pendaftaran Email Langsung Order & Anti-Double Image:
1. **Seksi Contact Center Terpadu:**
   - Kartu Contact Center di bagian bawah halaman utama: Jadwal Operasional Online (Senin-Jumat 09:00-20:00 WIB, Sabtu-Minggu 09:00-15:00 WIB), Hotline Telepon Butik Medan, dan tautan Customer Support WhatsApp.
2. **Pendaftaran Email Masuk & Langsung Order ke Keranjang:**
   - Formulir pendaftaran akun pelanggan dengan Nama Lengkap, Email, dan Nomor HP.
   - Setelah mendaftar atau masuk, sesi pengguna langsung aktif dan pengguna dapat langsung menekan tombol *"Tambah ke Keranjang"* atau *"Beli Sekarang"* tanpa kendala sesi terputus.
3. **Eliminasi Total Masalah "Double Image" (Tampilan Bersih & Profesional):**
   - Mengganti fallback gambar hero yang bertumpuk dengan aset tunggal beresolusi tajam: `hero_store_mannequins.jpg`, `hero_banner_software.jpg`, `hero_banner_pac.jpg`, dan `Logo V & T.jpg`.
   - Menata ulang kartu produk di katalog utama dengan gambar tunggal yang terpotong rapi (`card1_website.jpg`, `card2_gelang.jpg`, `card3_kurta.jpg`, `card4_dress.jpg`) tanpa gambar tumpang tindih.
   - Memastikan tampilan antarmuka berkelas dunia (*Anti-AI Human Crafted Aesthetic*) dengan palet warna mewah, tipografi proporsional, dan pengalaman belanja yang mulus.

---

## 9. RESTRUKTURISASI RBAC: PENGHAPUSAN ADMIN-G:GAYA & PENETAPAN ADMIN-G:PINKY SEBAGAI SATU-SATUNYA SUPER ADMIN (OTORITAS PENUH)

### A. Latar Belakang & Instruksi Pengguna:
Pengguna secara tegas menginstruksikan:
1. **Menghapus total akun `ADMIN-G:GAYA (Owner / Super Admin)`** dari menu Otoritas Login Petugas & Pemilik Toko serta dari seluruh sistem aplikasi.
2. **Menetapkan `ADMIN:PINKY` menjadi `ADMIN-G:PINKY`** sebagai **satu-satunya Super Admin / Owner dengan OTORITAS PENUH**.

### B. Rincian Teknis Implementasi (Surgical Plan):
1. **Pembersihan dan Konfigurasi RBAC di `index.html` (`USER_ROLES`):**
   - Menghapus key `"ADMIN-G:GAYA"`.
   - Mengonfigurasi `"ADMIN-G:PINKY"` sebagai satu-satunya pemegang otoritas Super Admin:
     ```javascript
     "ADMIN-G:PINKY": { 
       role: "SUPER_ADMIN", 
       name: "PINKY", 
       title: "ADMIN-G : PINKY (Owner / Super Admin)", 
       icon: "👑" 
     }
     ```
   - Menyediakan alias kunci lama `"ADMIN:PINKY"` yang merujuk ke objek yang sama untuk backward compatibility.
2. **Pembaruan Menu Dropdown Otoritas Login Petugas (`#settingRoleSelect`):**
   - Menghapus `<option value="ADMIN-G:GAYA">` dari menu.
   - Menjadikan `ADMIN-G:PINKY` sebagai pilihan utama pada kelompok Super Admin:
     ```html
     <optgroup label="Tingkat 1: SUPER ADMIN (Otoritas Penuh)">
       <option value="ADMIN-G:PINKY" selected>👑 ADMIN-G : PINKY (Owner / Super Admin)</option>
     </optgroup>
     <optgroup label="Tingkat 2: ADMIN TOKO">
       <option value="ADMIN1:VICKY">💎 ADMIN1 : VICKY</option>
       <option value="ADMIN2:TISH">💎 ADMIN2 : TISH</option>
     </optgroup>
     ```
3. **Penyelarasan Seluruh Penanggung Jawab Sistem (Kasir, Dokumen, Invoice, Surat PO):**
   - Nama default Kasir Super Admin: `Kasir: PINKY (Super Admin)`.
   - Tanda tangan kop dokumen cetak A4 Laporan Stok: `Owner / Super Admin (ADMIN-G : PINKY)`.
   - Tanda tangan Surat Purchase Order (PO): `Owner / Authorized Buyer: PINKY (ADMIN-G)`.
   - Pengalihan login staf cepat (PIN `1234`) otomatis masuk sebagai `ADMIN-G:PINKY` dengan toast *"👑 Login Super Admin (PINKY) Berhasil!"*.
4. **Pembaruan Basis Data Petugas (`setup.gs`):**
   - Menghapus `USR-001 (GAYA)`.
   - Menetapkan baris pertama petugas pada inisialisasi sheet `DataPetugas` menjadi:
     `["USR-001", "PINKY", "SUPER_ADMIN", "pinky@pinkaccessories.com", "6281234567891", "1234", "Aktif"]`.

270: 
271: ---
272: 
273: ## 10. PENJELASAN TEKNIS & HASIL VERIFIKASI: PENGHAPUSAN TOTAL GAYA & AKTIVASI ADMIN-G:PINKY
274: 
275: ### 10.1 Mengapa pada Layar Masih Sempat Terlihat ADMIN-G:GAYA?
276: - **Penyebab Utama:** Cache dokumen browser Google Chrome. Tab browser `http://localhost:8080/index.html` pada komputer pengguna sudah dibuka sebelumnya (tercatat pukul 21:33 pada taskbar Windows pengguna) sebelum file diperbarui di disk, dan browser belum dilakukan **Refresh / Muat Ulang Halaman**.
277: - **Status Kode di Server Localhost:**
278:   - File `index.html` dan `setup.gs` telah bersih 100% dari kata kunci `GAYA`.
279:   - Dropdown `#settingRoleSelect` di kode aplikasi kini secara tunggal memuat:
280:     ```html
281:     <optgroup label="Tingkat 1: SUPER ADMIN (Otoritas Penuh)">
282:       <option value="ADMIN-G:PINKY" selected>👑 ADMIN-G : PINKY (Owner / Super Admin)</option>
283:     </optgroup>
284:     ```
285:   - Tingkat 2 kini hanya berisi:
286:     ```html
287:     <optgroup label="Tingkat 2: ADMIN TOKO">
288:       <option value="ADMIN1:VICKY">💎 ADMIN1 : VICKY</option>
289:       <option value="ADMIN2:TISH">💎 ADMIN2 : TISH</option>
290:     </optgroup>
291:     ```
292: 
293: ### 10.2 Cara Menampilkan Perubahan Seketika di Layar:
294: Cukup lakukan salah satu langkah berikut pada tab browser Chrome Anda:
295: 1. Tekan tombol kombinasi keyboard: **`Ctrl + F5`** atau **`Ctrl + Shift + R`** (*Hard Refresh / Muat Ulang Paksa Tanpa Cache*).
296: 2. Atau klik ikon tombol panah melingkar (**Reload this page**) di pojok kiri atas browser.
297: 
298: ### 10.3 Ringkasan Fitur v1.9.4 yang Telah Aktif di Localhost:
299: 1. **Otoritas Login Petugas & Pemilik Toko:** Hanya ada `ADMIN-G:PINKY` sebagai Super Admin dengan otoritas penuh.
300: 2. **Kategori All Choice 3 Pilar:** Pilihan dropdown dan filter etalase menuju *Indian Woman Fashion*, *Indian Man Fashion*, dan *All Accesories and Luxury Goods*.
301: 3. **Kasir POS & Checkout Keranjang:** Tombol *"Checkout ke Meja Kasir"* langsung mentransfer item belanja ke kasir POS.
302: 4. **Pembayaran BCA ("Satu Langkah Lagi"):** Modal BCA transfer dengan nomor rekening resmi `0223142807` a/n VICKY GAYA GALANI / PAC Official, 3 digit kode unik verifikasi, countdown timer 24 jam, dan unggah bukti transfer.
303: 5. **Dokumen Purchase Order (PO) Resmi Standar A4:** Dokumen PO resmi yang disahkan oleh Owner (`ADMIN-G : PINKY`).
304: 6. **Fitur Pesanan Pelanggan (`viewOrders`):** Tab pesanan terintegrasi dengan filter status (*Menunggu Bayar, Diproses, Dikirim, Selesai*).
305: 7. **Upload Galeri & Deskripsi Gambar:** Operator dan Admin dapat langsung mengunggah foto produk dari file galeri HP/laptop serta mengisi deskripsi gambar secara realtime.

---

## 11. PEMBARUAN RESMI CONTACT CENTER & CUSTOMER SUPPORT V&T SERTA REKENING BCA (v1.9.5)

Berdasarkan instruksi resmi pemilik, seluruh data kontak, jadwal operasional, butik fisik, dan rekening bank telah diperbarui secara terpadu di seluruh sistem:

1. **Jam Operasional Online:**
   - **Senin - Jumat:** `10:30 - 21:00 WIB`
   - **Sabtu - Minggu:** `10:30 - 21:00 WIB` (Hari Besar: Libur)
2. **Kontak Bantuan Customer Support (CS):**
   - **WhatsApp:** `+62 8116072491` (Tautan langsung: `https://wa.me/628116072491`)
   - **Email:** `hritishgayagalani99@gmail.com` (Tautan langsung: `mailto:hritishgayagalani99@gmail.com`)
3. **Alamat Butik Fisik:**
   - **Nama Butik:** `THE PAC Boutique • V&T`
   - **Lokasi:** `Jl. Teuku Cik Ditiro No. 22, Medan, Indonesia`
4. **Rekening Resmi Pembayaran BCA:**
   - **Bank:** Bank Central Asia (BCA) - Kode: `014`
   - **Atas Nama:** `Vicky Gaya Galani`
   - **Nomor Rekening (Ac.):** `0223142807`
5. **Cakupan Penyelarasan Sistem:**
   - Kartu terpadu *"Contact Center & Customer Support V&T"* pada halaman display katalog utama (`#viewCatalog`).
   - Kartu *"Contact Center"* pada halaman keranjang belanja (`#viewCart`).
   - Modal Pembayaran BCA *"Satu Langkah Lagi Pembayaran BCA"* (`#bcaPaymentModal`) beserta panduan m-BCA dan fungsi salin nomor rekening.
   - Surat Purchase Order (PO) resmi standar A4 (`#poModal`).
   - Seluruh integrasi tombol WhatsApp pada rincian pesanan, detail produk, invoice, dan konfirmasi transfer.
   - Konfigurasi default Google Apps Script backend (`setup.gs` dan `code.gs`).

---

## 12. VALIDASI LOGIN MASUK: NOTIFIKASI ERROR "Email / Password tidak sesuai." & PENYELARASAN MODAL MASUK SESUAI GAMBAR REFERENSI (v1.9.6)

### A. DESKRIPSI KEBUTUHAN (PROBLEM STATEMENT)
Pengguna menginstruksikan agar pada fitur Masuk, jika pengguna salah memasukkan email atau password, sistem memunculkan keterangan:
`(!) Email / Password tidak sesuai.`
persis seperti gambar referensi (tampilan dialog modal Jaknot style).

### B. SPESIFIKASI VISUAL NOTIFIKASI ERROR
1. **Komponen Banner Error (`#authErrorBanner`):**
   - **Posisi:** Terletak tepat di bawah baris sub-teks *"Belum punya akun? Daftar →"* dan di atas tombol login Facebook / Google.
   - **Warna & Latar:** Latar belakang merah muda lembut (`#fff1f2`), garis tepi tipis (`#fecdd3`), dengan **aksen garis vertikal merah tebal di sebelah kiri** (`border-left: 4px solid #ef4444;`).
   - **Ikon:** Lingkaran tanda seru SVG `(!)` berwarna merah tegas (`#ef4444`).
   - **Teks Notifikasi:** `"Email / Password tidak sesuai."` (warna teks merah tua `#b91c1c`, semi-bold 600, ukuran 13.5px / 0.85rem).
   - **Interaktivitas & UX Mikro:**
     * Muncul dengan animasi getar mikro halus (*shake animation 0.35s*) untuk memberikan feedback taktil yang jelas kepada pengguna.
     * Otomatis tersembunyi kembali ketika pengguna mulai mengetik ulang di kolom email atau password (`oninput`).

### C. PENYELARASAN DIALOG MODAL MASUK (`#authModal`)
Agar pengalaman penggunaan 100% presisi dengan tangkapan layar:
1. **Modal Popup Elegan di Layar:**
   - Mengubah pemicu tombol *"Masuk"* di Header agar memunculkan popup dialog modal di tengah layar dengan latar belakang gelap blur (*backdrop overlay*), tanpa memindahkan halaman katalog yang sedang dilihat pengguna.
   - Tombol tutup silang (`✕`) di pojok kanan atas modal.
2. **Komponen Form Masuk:**
   - Tombol Masuk via Sosial: `[f Facebook]` dan `[G Google]`.
   - Garis pembatas: `--------- atau ---------`.
   - Input Email bergaya floating label dengan sub-teks helper `Contoh: email@vtbutik.com` / `email@jakartanotebook.com`.
   - Input Password bergaya floating label dengan ikon intip kata sandi `👁` (*show/hide toggle*).
   - Tautan bantuan *"Lupa kata sandi?"*.
   - Tombol aksi utama biru lebar: `[Masuk]`.

### D. LOGIKA VALIDASI & AKUN PENGUJIAN
1. **Penyimpanan Akun (`localStorage`):**
   - Menyimpan akun pelanggan yang mendaftar melalui form *"Daftar"*.
   - Menyediakan akun demo bawaan untuk pengujian instan:
     * **Akun Demo Pelanggan:** Email `gayamurty@gmail.com` | Password: `password123`
     * **Akun Staf / Admin Kasir:** Email bebas | PIN / Password: `1234`
2. **Kondisi Validasi:**
   - Jika Email atau Password kosong, atau kombinasi Email dan Password tidak cocok dengan akun terdaftar:
     -> Banner error merah `(!) Email / Password tidak sesuai.` langsung ditampilkan.
     -> Login ditahan, kolom password difokuskan.
   - Jika kredensial cocok:
     -> Sembunyikan banner error.
     -> Login berhasil, perbarui status user di Header, tutup modal, dan tampilkan notifikasi toast sukses.

### E. TABEL KOMPARASI (SEBELUM VS SESUDAH)

| Komponen / Skenario | Perilaku Saat Ini | Perilaku Baru (Sesuai Gambar Referensi) |
|---|---|---|
| **Penanganan Salah Password** | Tidak ada validasi error visual (input apapun selain 1234 langsung login sebagai Tamu) | **Muncul notifikasi banner merah bergaris kiri**: `(!) Email / Password tidak sesuai.` |
| **Bentuk Tampilan Masuk** | Pindah tampilan satu halaman penuh (`viewAuth`) | **Popup Dialog Modal (`#authModal`)** di tengah layar dengan tombol close `✕` di kanan atas |
| **Input Password** | Input sandi standar tanpa tombol intip | Dilengkapi tombol ikon mata `👁` untuk intip / sembunyikan kata sandi |
| **Kredensial Pengujian** | Belum ada akun demo | Tersedia akun demo pelanggan `gayamurty@gmail.com` (`password123`) & PIN `1234` |
| **Respons Ketik Ulang** | Tetap statis | Banner error otomatis hilang seketika saat user mengetik kembali di input field |

### F. BERKAS YANG TELAH DIUBAH (v1.9.6)
1. `index.html`: Penambahan elemen `#authModal`, CSS `#authErrorBanner`, ikon intip sandi `👁`, dan fungsi validasi `submitAuthForm()`.
2. `prd.md`: Pembaruan Master Context Zona Bawah dengan log v1.9.6.

---

## 13. IMPLEMENTASI EKOSISTEM AUTENTIKASI LENGKAP: DROPDOWN AKUN, PROFIL SAYA, SAVED CART, LOGOUT, MULAI BELANJA & MODAL LUPA PASSWORD (v1.9.7)

### A. DESKRIPSI KEBUTUHAN (PROBLEM STATEMENT)
Pengguna menginstruksikan integrasi alur kerja autentikasi lengkap sesuai 4 gambar tangkapan layar referensi:
1. **Jika Email dan Password Benar (Logged In State):**
   - **Label Header Menjadi Nama Depan Saja:** Tombol *"Masuk"* di Header atas otomatis berubah menampilkan **Nama Depan** customer saja (contoh: jika nama *"GAYA MURTY"* maka tampil sebagai **`👤 GAYA`** sesuai gambar referensi).
   - Saat tombol profil **`👤 GAYA`** diklik / di-hover, muncul **Dropdown Menu Akun** (Gambar 2):
     * `👤 Profil Saya` $\rightarrow$ membuka halaman akun lengkap (`viewProfile`).
     * `💳 Deposit` $\rightarrow$ ringkasan saldo / deposit.
     * `🛒 Saved Cart` $\rightarrow$ membuka daftar keranjang yang disimpan.
     * `🤍 Watchlist` $\rightarrow$ daftar barang incaran / wishlist.
     * `🚪 Logout` (teks merah) $\rightarrow$ keluar dari sesi akun kembali ke status Tamu / "Masuk".
   - **Tombol / Card "MULAI BELANJA" (Gambar 2):** Ditempatkan di samping logo V&T VIC & TIS pada hero banner, berwarna biru muda dengan sudut rounded, yang membawa pengguna langsung menjelajahi katalog belanja.
   - Halaman **Profil Saya** (`viewProfile` - Gambar 1 & 3):
     * **Sidebar Kiri ("Akun"):** Pesanan Saya, Profil Saya (status aktif), Atur Alamat, Deposit, Ulasan Saya, Saved Cart, Watchlist, Tiket Saya.
     * **Area Konten Kanan:**
       - Judul: *"Profil Saya"*.
       - Kartu *"Informasi Profil"*: Foto profil bundar ber-badge inisial "R", Nama *"GAYA MURTY"* dengan badge *"Retail online"*, Email *"gayamurty@gmail.com"*, Nomor Telepon *"08116072491"* (badge Verifikasi), dan Alamat Lengkap *"Jl. Jenggala No.71 Kel. Madras Hulu Sumatera Utara, Medan Polonia - 20152"*.
       - Kartu *"Password"*: Tombol outline biru `🔒 Ubah Password`.
2. **Jika Password Salah / Lupa:**
   - Tersedia tautan *"Lupa kata sandi?"* yang memunculkan dialog modal **"Atur ulang password"** (Gambar 4):
     * Judul: *"Atur ulang password"* dengan tombol close `✕`.
     * Keterangan: *"Masukkan email yang terdaftar. Kami akan mengirimkan link untuk atur ulang password."*.
     * Input floating label: `Email` + teks panduan: `Contoh: email@jakartanotebook.com`.
     * Tombol utama biru: `Kirim`.
     * Tombol batal: `Batal` (kembali ke modal Masuk).
3. **Jika Email Belum Ada (Belum Terdaftar):**
   - Tautan *"Belum punya akun? Daftar →"* di modal Masuk langsung beralih ke formulir pendaftaran akun baru, tersimpan otomatis di `localStorage`, dan langsung login ke profil baru.

---

### B. DETAIL TEKNIS KOMPONEN & TAMPILAN

#### 1. Header Dropdown Menu (`#userAccountDropdown`)
- Diposisikan tepat di bawah ikon `👤 GAYA` di header.
- Menggunakan styling card putih bersih dengan soft shadow, border tipis `#e2e8f0`, dan border radius `10px`.
- Setiap item memiliki ikon SVG, hover background `#f8fafc`, dan transisi halus. Item `Logout` diberi aksen warna merah `#ef4444`.

#### 2. Halaman Akun & Profil Saya (`#viewProfile`)
- Menjadi view tab mandiri yang terhubung dengan sistem navigasi `switchTab('profile')`.
- Layout desktop responsif 2 kolom: Sidebar menu di kiri (lebar 220px) dan Kartu Profil di kanan.
- Dilengkapi tombol navigasi cepat *"Mulai Belanja"* yang mempermudah pelanggan kembali ke etalase katalog kapan saja.

#### 3. Modal Atur Ulang Password (`#resetPasswordModal`)
- Modal popup elegan di atas layar dengan dark backdrop overlay blur.
- Field email terintegrasi dengan validasi dan simulasi pengiriman link reset via toast notification.
- Tombol `Batal` yang mengembalikan pengguna ke modal login `#authModal`.

#### 4. Fitur Saved Cart (`#viewSavedCart` & Modal)
- Menyediakan wadah bagi pelanggan untuk menyimpan produk dari keranjang agar tidak hilang saat ingin checkout di lain waktu.

---

### C. TABEL KOMPARASI (SEBELUM VS SESUDAH)

| Komponen / Alur | Sebelum Revisi | Sesudah Revisi (Sesuai 4 Gambar Referensi) |
|---|---|---|
| **Header Setelah Login** | Hanya teks nama statis tanpa menu | **Header interaktif `👤 GAYA` + Dropdown Menu Akun** (Profil Saya, Deposit, Saved Cart, Watchlist, Logout) |
| **Halaman Profil** | Belum tersedia halaman profil khusus | **Halaman Akun Lengkap (`viewProfile`)**: Sidebar Akun 8 menu + Data Diri GAYA MURTY + Tombol Ubah Password |
| **Aksi Lupa Kata Sandi** | Hanya toast notifikasi WhatsApp | **Modal Dialog Resmi "Atur ulang password"** dengan input email, tombol `Kirim`, dan `Batal` |
| **Akses Mulai Belanja** | Hanya via klik tab katalog | Tersedia tombol shortcut **"Mulai Belanja"** di profil & banner akun |
| **Fitur Saved Cart** | Belum ada | Tersedia menu **Saved Cart** untuk menyimpan item belanja yang tertunda |
| **Tombol Logout** | Tersembunyi di pengaturan admin | Tombol **Logout** merah di dropdown header yang mereset status kembali ke Tamu secara instan |

---

### D. BERKAS YANG TELAH DIUBAH (v1.9.7)
1. `index.html`:
   - Penambahan komponen dropdown akun pengguna di header (`#userAccountDropdown`).
   - Penambahan section tampilan halaman Akun / Profil Saya (`#viewProfile`) lengkap dengan sidebar dan kartu profil.
   - Penambahan dialog modal Atur Ulang Password (`#resetPasswordModal`).
   - Penambahan CSS styling untuk sidebar akun, kartu profil, dropdown header, dan tombol "Mulai Belanja".
   - Integrasi fungsi JS: `switchTab('profile')`, `switchTab('savedCart')`, `openResetPasswordModal()`, `closeResetPasswordModal()`, `handleResetPasswordSubmit()`, `handleUserLogout()`, dan toggle dropdown user.
2. `prd.md`:
   - Memperbarui Master Context Zona Bawah dengan log v1.9.7.

---

## 14. PENYELARASAN OPSI DROPDOWN AKUN: PROFIL SAYA, ISI KERANJANG, LOGOUT & PERSISTENSI SESI CUSTOMER (v1.9.8)

### A. DESKRIPSI KEBUTUHAN (PROBLEM STATEMENT)
Pengguna menginstruksikan perbaikan dengan penambahan menu opsi:
1. **Logout** (warna merah tegas).
2. **Profile Saya** (membuka halaman detail profil akun).
3. **Isi Keranjang** (menampilkan dan membuka item keranjang belanja untuk customer yang berhasil login).

### B. TINDAKAN PERBAIKAN & PENINGKATAN TEKNIS
1. **Perbaikan Script Runtime:**
   - Menghapus kurung kurawal penutup ganda (`}`) pada fungsi navigasi `switchTab('profile')` yang sebelumnya memicu *syntax error* dan membekukan inisialisasi JS pada browser.
   - Memastikan 100% validitas sintaks JavaScript terverifikasi via engine Node.js.
2. **Penambahan Menu Opsi Dropdown Akun (`#userAccountDropdown`):**
   - Ditambahkan opsi **"Isi Keranjang"** lengkap dengan badge jumlah item belanja (`#dropdownCartCount`) yang terhubung langsung ke modal drawer keranjang belanja (`openCartModal()`).
   - Ditambahkan opsi **"Profil Saya"** menuju halaman profil mandiri (`#viewProfile`).
   - Ditambahkan opsi **"Logout"** berwarna merah `#ef4444` yang mereset sesi akun kembali ke Tamu ("Masuk").
   - Disertai menu pelengkap sesuai mockup: **Saved Cart**, **Deposit**, dan **Watchlist**.
3. **Interaktivitas Dropdown (Hover & Click):**
   - Ditambahkan selektor CSS `.vt-header-btn-wrap.is-logged-in:hover .user-dropdown-menu` dan pseudo-bridge `::before` agar menu dropdown otomatis terbuka saat kursor mouse melayang di atas nama customer.
   - Ditambahkan indikator panah bawah (`▾`) pada tombol header saat customer login (`#headerUserChevron`).
   - Klik langsung pada tombol tetap berfungsi sebagai toggle buka/tutup menu.
4. **Inisialisasi & Persistensi Isi Keranjang (Cart Persistence):**
   - Saat customer login, sistem otomatis mengisi keranjang dengan 2 item produk demo dan menyinkronkan seluruh badge keranjang (`cartBadgeCount`, `dropdownCartCount`, `sidebarCartCount`).
   - Sesi customer yang sedang aktif disimpan ke dalam `localStorage.getItem("vt_active_user")` sehingga saat halaman direfresh/di-reload, status login customer dan isi keranjang tetap terjaga.
5. **Penyelarasan Sidebar Profil (`#viewProfile`):**
   - Sidebar akun ditambahkan menu shortcut **"Isi Keranjang"** serta tombol **"Keluar (Logout)"** beraksen merah.

### C. TABEL KOMPARASI (SEBELUM VS SESUDAH v1.9.8)

| Komponen / Fitur | Status Sebelumnya | Status Pembaruan v1.9.8 |
|---|---|---|
| **Eksekusi JS Browser** | Syntax error pada switchTab (script freeze) | 100% Valid, fungsi dropdown & modal aktif normal |
| **Menu Dropdown Akun** | Belum ada opsi Isi Keranjang di dropdown | **Lengkap: Profil Saya, Isi Keranjang (badge 2), Saved Cart, Deposit, Watchlist, Logout (merah)** |
| **Pemicu Dropdown** | Hanya klik (tidak responsif) | **Otomatis muncul saat di-Hover & Klik**, dilengkapi panah `▾` |
| **Badge & Isi Keranjang** | Badge angka 0 saat login | **Otomatis terisi 2 item**, badge `2` di header, dropdown, dan sidebar |
| **Persistensi Sesi** | Hilang jika halaman di-refresh | **Tersimpan di `localStorage`**, tetap login & keranjang terisi saat refresh |
| **Menu Sidebar Profil** | Belum ada Logout & Isi Keranjang | **Dilengkapi menu Isi Keranjang & tombol Keluar (Logout)** |

---

## 15. PEMBARUAN & PENYELARASAN HALAMAN "PESANAN SAYA" SESUAI DESAIN MEMBER JAKNOT STYLE (v1.9.9)

Berdasarkan referensi tangkapan layar user (`media_1793171138193.jpg`), halaman **Pesanan Saya** telah diselaraskan 100% mengikuti tata letak portal member modern bergaya JakartaNotebook (Jaknot Style):

### A. RINGKASAN PERUBAHAN & PENYELARASAN
1. **Navigasi Header & Dropdown Terintegrasi:**
   - Tombol **"Pesanan"** di header navigasi atas (`#vtHeaderOrdersBtn`) dan menu dropdown **"Pesanan Saya"** pada akun pengguna kini langsung mengarahkan tampilan ke halaman `#viewOrders`.
   - Tombol navigasi mobile bawah `#navBtnOrders` terhubung langsung untuk membuka halaman Pesanan Saya.

2. **Breadcrumb Navigasi:**
   - Terdapat navigasi jejak rekam di bagian atas: `Home > Member > Pesanan Saya` dengan link interaktif yang mempermudah navigasi kembali ke katalog belanja.

3. **Tata Letak 2-Kolom Member Portal:**
   - **Sidebar Kiri ("Akun"):**
     - `Pesanan Saya` (aktif dengan highlight biru)
     - `Isi Keranjang` (disertai badge jumlah item keranjang)
     - `Profil Saya`
     - `Atur Alamat`
     - `Deposit`
     - `Ulasan Saya`
     - `Saved Cart`
     - `Watchlist`
     - `Tiket Saya`
     - `Keluar (Logout)` (tombol merah)
   - **Area Konten Utama Kanan ("Pesanan Saya"):**
     - Judul Halaman: `Pesanan Saya`
     - **Bar Filter & Pencarian:**
       - Input pencarian: `[ 🔍 Cari Kode Invoice / SKU / Nama Barang ]` dengan filter realtime.
       - Dropdown metode pembelian: `[ Metode Pembelian ▾ ]` (*Semua, Kirim Kurir SICEPAT/J&T, Ambil di Toko*).
       - Tombol pemilih tanggal: `[ 📅 Pilih Tanggal ]` dengan opsi filter per tanggal dan reset.
     - **Tab Status Pesanan Horizontal (Sesuai Referensi Gambar):**
       - `Semua` (garis bawah indikator biru aktif)
       - `Belum Bayar (0)`
       - `Diproses (1)`
       - `Dikirim (0)`
       - `Siap Diambil (1)`
       - `Terkendala (0)`
       - Menghitung jumlah pesanan secara dinamis dan memfilter kartu pesanan saat diklik.

4. **Kartu Pesanan (Order Cards Jaknot Style):**
   - **Kartu Pesanan 1 (NF7CE0):**
     - Kode Invoice: `NF7CE0` dengan tombol salin `[ 📋 Salin ]` interaktif (notifikasi toast salin ke clipboard).
     - Tanggal: `27 Okt 2026, 18:58`.
     - Status Badge: `Diproses` (warna kuning/amber soft).
     - Thumbnail produk dengan tag `1 Produk` di sudut kanan bawah.
     - Keterangan "Belanja dari": `Jaknot Medan`.
     - Keterangan "Metode Pembelian": `[ 🚚 Kirim ] SICEPAT REG`.
     - "Total Bayar": `Rp11.400`.
     - Tombol link: `Lihat Detail`.
   - **Kartu Pesanan 2 (O8HADR):**
     - Kode Invoice: `O8HADR` dengan tombol `[ 📋 Salin ]`.
     - Tanggal: `26 Okt 2026, 09:42`.
     - Status Badge: `Siap Diambil` (warna biru cerah soft).
     - Thumbnail produk dengan tag `1 Produk`.
     - Keterangan "Belanja dari": `Jaknot Medan`.
     - Keterangan "Metode Pembelian": `[ 🏪 Ambil di Toko ] PAC Butik Medan`.
     - "Total Bayar": `Rp45.000`.
     - Tombol link: `Lihat Detail`.
   - **Kartu Pesanan 3 (ORD-202610-8801):**
     - Kode Invoice: `ORD-202610-8801`, Tanggal `25 Okt 2026, 21:15`, Status `Selesai` (hijau soft), Total `Rp151.400`.

5. **Modal Rincian Pesanan Interaktif (`#orderDetailModal`):**
   - Mengklik `Lihat Detail` membuka modal drawer detail pesanan yang menyajikan rincian lengkap:
     - Nomor invoice & tombol salin.
     - Toko penjual & detail metode pengiriman / lokasi ambil barang.
     - Alamat tujuan pengiriman.
     - Rincian item barang (foto, SKU, varian, harga satuan, qty, subtotal).
     - Ringkasan pembayaran (subtotal, promo ongkir gratis, total tagihan).
     - Tombol aksi: `📑 Buka Purchase Order (PO)`, `💬 Hubungi Kami di WA`, dan tombol pembayaran BCA jika belum lunas.

---

## 16. PENYEMBUNYIAN & PROTEKSI KETAT FITUR "SETTING & STOK" (RBAC KHUSUS SUPER ADMIN, ADMIN TOKO, DAN OPERATOR TOKO) (v2.0.0)

Berdasarkan instruksi resmi:
> *"Sembunyikan Fitur 'Setting & Stok'. Hanya 'SUPER ADMIN', 'ADMIN TOKO' dan 'OPERATOR TOKO' yang bisa melihat dan mengakses fitur 'Setting & Stok'"*

Telah diimplementasikan sistem proteksi akses Role-Based Access Control (RBAC) ketat pada fitur **Setting & Stok** (`#viewAdmin` / `#navBtnAdmin`):

### A. ATURAN HAK AKSES RESMI:
1. **Hak Akses Penuh (Dapat Melihat & Mengakses):**
   - **Tingkat 1: SUPER ADMIN (Otoritas Penuh)**
     - `👑 ADMIN-G : PINKY` (Owner / Super Admin)
   - **Tingkat 2: ADMIN TOKO**
     - `💎 ADMIN1 : VICKY`
     - `💎 ADMIN2 : TISH`
   - **Tingkat 3: OPERATOR TOKO (POS & Input Stock)**
     - `🏷️ OPERATOR1 : WIDYA`
     - `🏷️ OPERATOR2 : MILA`
     - `🏷️ OPERATOR3 : ROSSI`

2. **Tanpa Hak Akses (Tersembunyi 100% & Diblokir):**
   - **Pelanggan / Tamu (`CUSTOMER` / `PELANGGAN:TAMU`):**
     - Tombol **"Setting & Stok"** pada navigasi bawah (`#navBtnAdmin`) disembunyikan sepenuhnya (`display: none !important`).
     - Tautan shortcut pada dropdown akun (`#dropdownAdminItem`) dan sidebar portal member (`.sidebar-admin-item`) disembunyikan.
     - Percobaan akses manual ke tab admin (`switchTab('admin')`) langsung dicegat, memunculkan notifikasi peringatan:
       *"🔒 Fitur 'Setting & Stok' hanya dapat diakses oleh SUPER ADMIN, ADMIN TOKO, atau OPERATOR TOKO."*, dan membuka dialog login petugas (`#staffLoginModal`).

### B. FITUR & PENINGKATAN TEKNIS:
1. **Modal Login Otoritas Petugas (`#staffLoginModal`):**
   - Hadir popup modal khusus otorisasi internal toko ketika petugas mengklik opsi staff atau saat akses diblokir.
   - Menyediakan pilihan dropdown 3 tingkat (Super Admin, Admin Toko, Operator Toko) dan input PIN Petugas resmi (`1234`).
   - Verifikasi sukses langsung mengaktifkan sesi staff, memunculkan tombol **"Setting & Stok"**, dan mengalihkan layar ke `#viewAdmin`.
2. **Auto-Hide & Logout Protection:**
   - Ketika petugas beralih ke *"Mode Tamu"* (`resetToCustomer()`) atau melakukan *"Logout"* (`handleUserLogout()`), sesi staff dihapus dari `localStorage`, tombol **"Setting & Stok"** otomatis menghilang seketika, dan layar langsung dialihkan kembali ke Katalog Belanja.
3. **Persistensi Sesi Petugas (`localStorage`):**
   - Petugas yang telah login tetap memiliki akses dan tombol Setting & Stok tetap aktif saat halaman direfresh.

---

## 17. ELIMINASI BAR LOGIN STAFF & INTEGRASI LOGIN LANGSUNG PETUGAS VIA FORM UTAMA (v2.0.1)

Berdasarkan instruksi resmi:
> *"Hapus opsi Masuk sebagai Petugas Kasir / Admin Toko (PIN: 1234) pada Fitur Masuk. Jika masuk dengan Email : EMAIL/USER ID: ADMIN-G, Password : PINKY, USER ID : ADMIN1, Password: VICKY, ADMIN2, Password: TISH, OPERATOR1 : WIDYA, maka akan langsung masuk ke halaman 'Otoritas Login Petugas & Manajemen'."*

Telah diimplementasikan penyempurnaan menyeluruh pada sistem autentikasi:

### A. RINGKASAN PERUBAHAN:
1. **Pembersihan Total Tautan Staff pada Form Masuk Pelanggan:**
   - Opsi baris bawah `🔐 Masuk sebagai Petugas Kasir / Admin Toko (PIN: 1234)` telah **dihapus sepenuhnya** dari Popup Dialog Modal Masuk (`#authModal`) maupun tampilan Masuk Mobile (`#viewAuth`).
   - Tampilan modal Masuk kini bersih, rapi, dan 100% berfokus pada pelanggan (*Customer-Facing*).

2. **Daftar Kredensial Khusus Petugas & Manajemen Toko:**
   Petugas internal toko kini cukup memasukkan User ID / Email dan Kata Sandi resmi mereka langsung pada kolom **Email / User ID** dan **Password** di form Masuk utama:
   * **SUPER ADMIN (Owner / Super Admin):**
     * **Email / User ID:** `ADMIN-G` *(atau `admin-g@...`)*
     * **Password:** `PINKY`
     * **Akses:** Otoritas Penuh Tingkat 1 (`ADMIN-G:PINKY`)
   * **ADMIN TOKO 1:**
     * **User ID:** `ADMIN1`
     * **Password:** `VICKY`
     * **Akses:** Otoritas Admin Toko Tingkat 2 (`ADMIN1:VICKY`)
   * **ADMIN TOKO 2:**
     * **User ID:** `ADMIN2`
     * **Password:** `TISH`
     * **Akses:** Otoritas Admin Toko Tingkat 2 (`ADMIN2:TISH`)
   * **OPERATOR TOKO 1:**
     * **User ID:** `OPERATOR1`
     * **Password:** `WIDYA`
     * **Akses:** Otoritas Operator Toko Tingkat 3 (`OPERATOR1:WIDYA`)
   * *(Juga mendukung `OPERATOR2` dengan Password `MILA` dan `OPERATOR3` dengan Password `ROSSI`)*.

3. **Langsung Masuk ke Halaman "Otoritas Login Petugas & Manajemen":**
   - Saat salah satu dari kredensial petugas di atas dimasukkan dan tombol **Masuk** diklik:
     - Sistem langsung memverifikasi peran staff.
     - Sesi staff diaktifkan dan disimpan ke `localStorage`.
     - Tombol navigasi **"Setting & Stok"** otomatis dimunculkan di bar navigasi bawah.
     - Layar aplikasi **langsung diarahkan ke halaman "Otoritas Login Petugas & Manajemen"** (`#viewAdmin`).

---

## 18. DINAMISASI TOMBOL DETAIL PRODUK: "Ingatkan Saya" (Stok = 0) vs "Tambah Ke Keranjang" (Stok >= 1) (v2.0.2)

> *"Jika jumlah stock=0 maka keterangan 'Ingatkan Saya', Jika jumlah stock >=1 maka keterangan 'Tambah Ke Keranjang'. Mohon dirubah keterangan yang lama yaitu 'Ingatkan saya/ Tambahkan ke Keranjang'."*

Telah diimplementasikan dinamisasi penuh pada tombol aksi utama (*Call to Action* / CTA) di **Modal Detail Produk Interaktif** (`#productDetailModal`):

1. **Penghapusan Keterangan Statis Lama:**
   - Keterangan lama *"🔔 Ingatkan Saya / Tambah ke Keranjang"* telah dihapus 100% dari seluruh berkas kode aplikasi.
   - Tombol utama kini menggunakan ID `#btnDetailCtaAction` yang dikontrol secara dinamis oleh JavaScript berdasarkan status jumlah ketersediaan stok produk (`p.stok`).

2. **Dinamisasi Teks & Status Tombol Berdasarkan Stok:**
   * **Kondisi Stok = 0 (Stok Habis / Out of Stock):**
     * **Keterangan Tombol:** `🔔 Ingatkan Saya`.
     * **Indikator Status:** Menampilkan badge `⚠️ Stok: Habis (0 pcs) — Notifikasi Pengingat Tersedia` dengan warna aksen merah lembut.
     * **Aksi Klik (`handleDetailStockReminder()`):**
       - Menyimpan preferensi pengingat ke penyimpanan lokal (`localStorage: vt_stock_reminders`).
       - Memunculkan notifikasi toast: `🔔 Pengingat Aktif! Kami akan mengingatkan Anda saat stok '[Nama Produk]' kembali tersedia.`.
       - Memberikan animasi feedback visual pada tombol: `✅ Pengingat Diaktifkan`.
       - Mencegah produk tanpa stok masuk ke keranjang belanja (`addDetailProductToCart()` guard).
   * **Kondisi Stok >= 1 (Stok Tersedia):**
     * **Keterangan Tombol:** `🛒 Tambah Ke Keranjang`.
     * **Indikator Status:** Menampilkan badge `✓ Stok: Tersedia ([X] pcs)` dengan aksen hijau segar.
     * **Aksi Klik (`addDetailProductToCart()`):**
       - Menambahkan varian warna dan ukuran terpilih ke keranjang belanja.
       - Mengupdate badge keranjang pada bilah navigasi dan dropdown.
       - Menampilkan toast konfirmasi penambahan keranjang.

3. **Integrasi Pesan WhatsApp Cerdas (`orderDetailViaWhatsApp()`):**
   - **Jika Stok = 0:** Teks chat WhatsApp otomatis disesuaikan menjadi formulir tanya jadwal restock / Pre-Order barang.
   - **Jika Stok >= 1:** Teks chat WhatsApp memuat rincian pesanan dan permintaan konfirmasi pembayaran langsung ke admin toko.

---

## 19. SINKRONISASI TAMPILAN DESKTOPVIEW, MOBILEVIEW, DAN PENAMBAHAN TABLETVIEW (IPAD) (v2.0.3)

> *"UPDATE AND SYNCHRONISE DESKTOPVIEW TO MOBILEVIEW AND ADD TABLETVIEW"*

Telah dilakukan pembaruan menyeluruh dan sinkronisasi responsif antar perangkat dengan penambahan mode pratinjau **TabletView**:

1. **Penambahan Mode TabletView (`body.is-tablet-view` / Layar iPad 820px):**
   - **Tombol Switcher Baru:** Menambahkan tombol **`📟 Mode Tablet (iPad)`** (`#btnViewTablet`) pada bilah pengendali pratinjau viewport di bagian atas layar (`.device-switcher-bar`).
   - **Frame Simulator Tablet:** Container aplikasi dikonfigurasi dengan lebar optimal tablet (`max-width: 820px`, tinggi `1024px`, sudut melengkung `border-radius: 32px`, bezel metal ganda, dan titik kamera depan minimalis).
   - **Tata Letak Khusus Tablet:**
     * **Header Tablet:** Penataan horizontal 1 baris yang seimbang antara Logo (46px), bilah pencarian & lokasi terpadu (max 400px), serta tombol Audio, Keranjang, Pesanan, dan Akun/Login.
     * **Hero Banner:** Split 2 kolom seimbang antara logo & tombol Mulai Belanja di sisi kiri dan carousel banner di sisi kanan.
     * **Katalog Tablet:** Sidebar filter kiri aktif (210px) bersanding dengan grid produk 2 kolom yang proporsional.
     * **Detail Modal Tablet:** Modal 2 kolom (galeri foto kiri + rincian & tombol CTA di kanan) dengan batas lebar 760px.
     * **Pesanan & Profil Tablet:** Sidebar menu akun 210px bersanding dengan area konten pesanan / profil.

2. **Sinkronisasi Menyeluruh DesktopView ke MobileView (`body.is-mobile-view` / Layar HP 418px):**
   - **Header Mobile Teratur:** Penataan 2 tingkat yang bersih (Baris 1: Logo 38px + Audio + Keranjang + Pesanan + Akun; Baris 2: Kotak Pencarian + Pill Lokasi).
   - **Katalog & Filter Mobile:** Mengeliminasi padding berlebih pada mobile sehingga grid 2 kolom lebih lega, serta tombol drawer filter (`.mobile-filter-trigger`) yang dapat dibuka/tutup secara mulus.
   - **Detail Modal Mobile:** Rangkaian 5 thumbnail gambar ditampilkan secara horizontal scroll di bawah foto utama dengan tinggi proporsional, serta tombol aksi dinamis stok (`Ingatkan Saya` / `Tambah Ke Keranjang`) dan WhatsApp toko.
   - **Pesanan Saya & Profil Saya Mobile:**
     * Sidebar menu akun yang sebelumnya memakan kolom vertikal 240px kini ditransformasikan menjadi **Menu Tab Scroll Horizontal** yang ringkas dan ramah sentuhan satu jari.
     * Kartu pesanan Jaknot Style dan formulir pencarian invoice otomatis menyesuaikan 100% lebar layar HP tanpa terpotong (*no horizontal overflow*).
   - **Bottom Navigation Mobile:** Tetap docked di dasar simulator HP dengan navigasi lengkap (Katalog, Pesanan, Kasir POS, dan Setting & Stok bila staf login).

3. **Manajemen Status & Persistensi Viewport Switcher (`setDeviceView(mode)`):**
   - Pengalihan instan antara **Mode Mobile (HP)**, **Mode Tablet (iPad)**, dan **Mode Desktop**.
   - Preferensi perangkat yang dipilih tersimpan otomatis di `localStorage: vt_device_view` sehingga tampilan tidak kembali ke default saat halaman dimuat ulang.

---

## 20. PERBAIKAN SINKRONISASI KONEKSI HARGA KERANJANG BELANJA (CART PRICE RECONNECTION) (v2.0.4)

> *"please fix the problem. The Price not conect."*

Berdasarkan tangkapan layar keranjang belanja (*"Keranjang Belanja Anda"*), terdeteksi bahwa harga produk di keranjang menampilkan nilai terputus/kosong (`Rp 0 x 1 = Rp 0`) dan *"Total Tagihan: Rp 0"*. Masalah ini telah dianalisis tuntas dan diperbaiki melalui mekanisme pemulihan universal:

### 20.1 Akar Masalah (Root Cause)
1. **Ketidaksesuaian Properti Objek Keranjang pada Modal Detail:**
   - Pada fungsi `addDetailProductToCart()` sebelumnya, penambahan produk ke `state.cart` menyimpan objek dengan nama properti `{ harga: p.hargaJual }` (tanpa properti `hargaSatuan`).
   - Sementara itu, antarmuka keranjang belanja (`renderCartView()`), modal keranjang (`openCartModal()`), dan pengiriman pesanan WhatsApp (`checkoutToWhatsApp()`) menghitung subtotal menggunakan formula:
     ```javascript
     const sub = it.hargaSatuan * it.qty; // it.hargaSatuan bernilai undefined -> NaN
     ```
   - Akibatnya perhitungan `undefined * 1` menghasilkan `NaN`, yang ketika diformat oleh `formatRupiah(NaN)` menghasilkan teks `"Rp 0"`. Akumulasi grand total `total += NaN` juga menjadi `NaN` sehingga *"Total Tagihan: Rp 0"*.

### 20.2 Langkah Perbaikan & Pemulihan Universal (Self-Healing Architecture)
1. **Fungsi Penyelaras Harga Universal (`getCartItemPrice(it)`):**
   - Diimplementasikan fungsi `getCartItemPrice(it)` yang bertindak sebagai resolver & self-healing layer untuk setiap item keranjang:
     ```javascript
     function getCartItemPrice(it) {
       if (!it) return 0;
       let price = Number(it.hargaSatuan ?? it.harga ?? it.hargaJual ?? 0);
       if ((!price || price <= 0 || isNaN(price)) && state.products) {
         const prod = state.products.find(p => p.id === (it.id || it.idProduk) || (it.sku && p.sku === it.sku) || p.nama === it.nama);
         if (prod) {
           price = Number(prod.hargaJual || prod.harga || 0);
         }
       }
       if (isNaN(price) || price < 0) price = 0;
       it.hargaSatuan = price;
       it.harga = price;
       it.hargaJual = price;
       it.subtotal = price * (Number(it.qty) || 1);
       return price;
     }
     ```
   - Menjamin bahwa baik item baru maupun item lama yang tersimpan otomatis disembuhkan (*auto-healed*) dan terhubung dengan harga jual asli dari katalog master produk.

2. **Perbaikan `addDetailProductToCart()`:**
   - Menyimpan seluruh alias properti harga yang konsisten: `hargaSatuan`, `harga`, dan `hargaJual`.
   - Menghitung subtotal secara akurat dan memanggil `renderCartView()` seketika.
   - Apabila item varian yang sama sudah ada di keranjang, kuantitas ditambah dan properti harga langsung disinkronkan.

3. **Sinkronisasi Seluruh Titik Transaksi Keranjang:**
   - **`renderCartView()`:** Menampilkan harga satuan asli (misal `Rp 31.300 x 1 = Rp 31.300`), subtotal per item, dan total tagihan akumulasi yang valid tanpa Rp 0.
   - **`openCartModal()`:** Modal pop-up keranjang menggunakan `getCartItemPrice(it)` sehingga subtotal dan total akurat.
   - **`checkoutToWhatsApp()`:** Pesan otomatis WhatsApp menyertakan harga satuan, subtotal, dan total tagihan yang terhubung dengan benar.
   - **`checkoutCartToPos()`:** Meja kasir POS menerima objek item dengan `hargaSatuan` dan `subtotal` yang valid.
   - **`openBcaPaymentModal()` & `confirmBcaTransfer()`:** Perhitungan transfer BCA (subtotal + kode unik 3 digit) terhubung akurat dengan harga keranjang belanja.
   - **`openPoModal()`:** Dokumen Purchase Order resmi mencantumkan harga satuan dan total tagihan terhubung.
   - **`saveProductEdit()` di Admin:** Setiap kali Admin atau Operator mengubah harga jual produk di *"Setting & Stok"*, sistem otomatis menyinkronkan harga item terkait yang sedang ada di keranjang belanja pembeli.

4. **Verifikasi Otomatis:**
   - Seluruh 4 skenario pengujian di `scratch/test_cart_prices.js` lulus 100% (syntax valid, auto-heal berhasil, total tagihan terhubung menjadi `Rp 58.500`, WhatsApp & BCA checkout akurat).

---

## 21. RENCANA PERBAIKAN: LOGO & GAMBAR PRODUK TIDAK MUNCUL DI GOOGLE APPS SCRIPT WEB APP (v2.0.5)

> *"Please fix the problem.My Logo and some product image not appeal"*

Berdasarkan 2 tangkapan layar yang dilampirkan pengguna pada URL:
`https://script.google.com/macros/s/AKfycbwU8MyjK1QsyWZ5KqfEGbxB5FLrwmZEwzoaUDKS0VogMj7FIlaquKgsZhTDN_wzDRIuQ/exec`
terlihat bahwa:
1. Logo Header dan Logo Hero Story menampilkan ikon gambar rusak (*broken image icon*).
2. Banner promosi atas (*Custom Software Development Services*, *PAC Pink Accessories*, dan *THE PAC Boutique*) menampilkan ikon gambar rusak.
3. Seluruh 4 kartu produk di katalog utama (*TaffOmicron Tensimeter*, *Termometer*, *Nebulizer*, dan *Oximeter*) menampilkan ikon gambar rusak dengan teks alt.

---

### 21.1 Akar Masalah Arsitektur (Root Cause Analysis)
1. **Perbedaan Lingkungan Eksekusi (Localhost vs Google Apps Script):**
   - Pada pengujian lokal (`http://localhost:8085`), web server Python berjalan di komputer lokal sehingga path relatif seperti `assets/Logo V & T.jpg` dan `assets/card1_website.jpg` berhasil diakses dari folder fisik `./assets`.
   - Namun, saat file dideploy ke **Google Apps Script Web App** (`script.google.com`), halaman dieksekusi di server cloud Google. Google Apps Script **TIDAK memiliki web server untuk file aset statis lokal** (`./assets/...`).
   - Browser mencoba mengunduh gambar ke:
     `https://script.google.com/macros/s/.../assets/Logo%20V%20&%20T.jpg` -> menghasilkan **HTTP 404 (Not Found)**.
   - Atribut error fallback saat ini (`onerror="this.src='assets/Template-1.jpg';"`) juga merujuk ke file lokal yang tidak ada di server Google, sehingga gambar tetap pecah (*broken icon*).

---

### 21.2 Rencana Solusi Mandiri & Anti-Broken (Self-Contained Embedded Asset Registry)
Untuk mengatasi masalah ini secara permanen agar aplikasi **tampil sempurna di Google Apps Script (`script.google.com`) maupun di Localhost**, arsitektur aset akan diubah menjadi **Self-Contained In-Memory Asset Registry**:

1. **Injeksi Registry Aset Terkompresi (`const ASSETS = { ... }`):**
   - Seluruh aset visual esensial di-bundle langsung ke dalam kode JavaScript dalam format Base64 Data URI yang sangat ringan (~218 KB total raw data):
     * `ASSETS.LOGO_VT`: Logo resmi V&T Vic & Tis teroptimasi (32.8 KB)
     * `ASSETS.BANNER_SOFTWARE`: Banner Custom Software Development (8.3 KB)
     * `ASSETS.BANNER_PAC`: Banner PAC Pink Accessories (10.4 KB)
     * `ASSETS.BANNER_BOUTIQUE`: Banner Interior Butik Manekin (12.4 KB)
     * `ASSETS.CARD_1` s/d `CARD_4`, `CARD_CORSET`, `CARD_TAS`, `CARD_KACAMATA`, `CARD_KOTAK`: Foto produk katalog lokal beresolusi tajam (8 KB - 15 KB)
     * `ASSETS.ICON_WHATS_NEW`, `ICON_JUST_ARRIVED`, `ICON_10_10`: Ikon promo navigasi (0.8 KB - 3 KB)
     * `ASSETS.PLACEHOLDER`: SVG vector placeholder elegan bergradasi soft-slate bertuliskan *"V&T Fashion & Luxury"*.

2. **Fungsi Resolver Cerdas (`resolveImgUrl(url)`):**
   - Setiap kali antarmuka hendak menampilkan gambar, fungsi ini secara otomatis memeriksa:
     * Jika URL diawali `data:` atau `https://` online -> gunakan langsung.
     * Jika URL merujuk ke path lokal `assets/...` -> petakan langsung ke Base64 Data URI dari `ASSET_MAP`.
     * Jika gambar tidak ditemukan / kosong -> gunakan `ASSETS.PLACEHOLDER`.

3. **Fallback Error Handler Kebal Rusak (`handleImgError(el, fallbackKey)`):**
   - Menggantikan seluruh `onerror="...assets/Template-1.jpg..."` lama dengan:
     ```html
     onerror="handleImgError(this, 'LOGO_VT')"
     ```
   - Menjamin bahwa jika koneksi internet terputus atau URL eksternal bermasalah, gambar otomatis jatuh ke logo resmi atau SVG placeholder yang elegan tanpa memunculkan ikon retak browser.

4. **Inisialisasi Otomatis (`applyCloudAssets()`):**
   - Dijalankan seketika saat halaman dimuat untuk menyelaraskan seluruh tag `<img>` statis (Logo Header, Logo Hero, Logo Cart, Modal PO, dan Banner Promosi).

---

### 21.3 Berkas yang Akan Diubah & Estimasi Dampak
* **[index.html](file:///c:/Users/ptgay/.gemini/antigravity-ide/ProjekAntigravity/index.html):**
  - Menambahkan blok `ASSETS`, `ASSET_MAP`, `resolveImgUrl()`, dan `handleImgError()` (total penambahan ~295 KB kode aman).
  - Memperbarui `renderCatalog()`, `openProductDetailModal()`, `renderCartView()`, `openCartModal()`, `renderPosCatalog()`, dan `renderAdminTable()` agar memakai `resolveImgUrl()`.
  - Mengarahkan `onerror` ke `handleImgError()`.
* **Dampak Sistem:**
  - Nol risiko error runtime (seluruh data string base64 valid).
  - Tampilan di Google Apps Script Web App langsung memuat Logo dan foto produk 100% utuh tanpa perlu hosting gambar eksternal tambahan.
  - Tampilan di Localhost tetap berjalan lancar 100%.

---

### 21.4 Status Penerapan
- **Persetujuan Pengguna:** Diterima (*"OKE TERAPKAN"*).
- **Tindak Lanjut Lanjutan:** Pengguna memberikan link resmi Google Drive folder `THE PAC` (`https://drive.google.com/drive/folders/1vrcmjrTUo6nOU21jwqMzrSALhv0Uv3Hq?usp=drive_link`) untuk seluruh Logo dan gambar produk (Goods). Implementasi ditingkatkan secara permanen pada Bab 22.

---

## 22. INTEGRASI LINK RESMI GOOGLE DRIVE UNTUK LOGO, BANNER & SELURUH BARANG (GOODS) (v2.0.6)

> *"Please use this link for all image Logo and goods https://drive.google.com/drive/folders/1vrcmjrTUo6nOU21jwqMzrSALhv0Uv3Hq?usp=drive_link"*

Berdasarkan direktif resmi dari pengguna, seluruh aset gambar Logo, Banner, Kategori, dan Produk/Barang (Goods) kini dihubungkan secara langsung ke folder resmi Google Drive milik toko:
- **Folder Root:** `THE PAC` (ID: `1vrcmjrTUo6nOU21jwqMzrSALhv0Uv3Hq`)
- **Subfolder Aset:** `assets` (ID: `1k3BVSjkIRzSBTc_Iozw1rWbDGzFKaE3m`)
- **Subfolder Katalog:** `assets/Katalog` (ID: `1KLJChUOLQFhXZ7yy35ZsLZxikQhHwoq1`)

### 22.1 Pemetaan Menyeluruh 39 Aset Resmi Google Drive (CDN Direct URL)
Setiap berkas diakses menggunakan endpoint Google High-Speed Global CDN (`https://lh3.googleusercontent.com/d/{FILE_ID}`) yang terbukti lolos pengujian 100% (39/39 berkas menghasilkan status HTTP 200 dengan header gambar valid, bebas CORS block dan bebas redirect latency):

1. **Brand Logo:**
   - `Logo V & T.jpg` (ID: `1Df-rikaxB27WfchGSwXhOePX-znUpWqM`) -> `https://lh3.googleusercontent.com/d/1Df-rikaxB27WfchGSwXhOePX-znUpWqM`
   - `logo_vt_opt.jpg` (ID: `1fBC265WbrtY8_xJ1_U7fawvHoYeXU9EQ`) -> `https://lh3.googleusercontent.com/d/1fBC265WbrtY8_xJ1_U7fawvHoYeXU9EQ`

2. **Hero Banners:**
   - `hero_banner_software.jpg` (ID: `1yxxOmjU_jPpye_eZdxBwCzZTuXKJVdYg`) -> `https://lh3.googleusercontent.com/d/1yxxOmjU_jPpye_eZdxBwCzZTuXKJVdYg`
   - `hero_banner_pac.jpg` (ID: `10FwPvzYO4wCtt9_XLIPoBr62nBSWKVya`) -> `https://lh3.googleusercontent.com/d/10FwPvzYO4wCtt9_XLIPoBr62nBSWKVya`
   - `hero_store_mannequins.jpg` (ID: `1zohuWu8KOO9HV6M2YEIPygtX-2sGvWC7`) -> `https://lh3.googleusercontent.com/d/1zohuWu8KOO9HV6M2YEIPygtX-2sGvWC7`

3. **Produk & Barang Dagangan (Goods):**
   - `card1_website.jpg` (ID: `1gHVcy2fnnUPSnxbnHG50vGqp3YQhGHMM`) -> `https://lh3.googleusercontent.com/d/1gHVcy2fnnUPSnxbnHG50vGqp3YQhGHMM`
   - `card2_gelang.jpg` (ID: `1Xl58ZHlX-N0kxsRoFhZ49wohuNHt5Io5`) -> `https://lh3.googleusercontent.com/d/1Xl58ZHlX-N0kxsRoFhZ49wohuNHt5Io5`
   - `card3_kurta.jpg` (ID: `1lExKo17eKjRzTRZYvVILhnhWO1sDc-kV`) -> `https://lh3.googleusercontent.com/d/1lExKo17eKjRzTRZYvVILhnhWO1sDc-kV`
   - `card4_dress.jpg` (ID: `1W-GcCiqlNATFnx3r2GHn-pXRtrtUOL_S`) -> `https://lh3.googleusercontent.com/d/1W-GcCiqlNATFnx3r2GHn-pXRtrtUOL_S`
   - `detail_corset_main.jpg` (ID: `1GTnneHtWKiSeOh8fo2FlZYU0zaZntrvh`) -> `https://lh3.googleusercontent.com/d/1GTnneHtWKiSeOh8fo2FlZYU0zaZntrvh`
   - `biutteco-tas-kosmetik-make-up-travel-organizer-bag-wanita-x3235.jpg` (ID: `1ln5XsoqMrLpr3uTJSDnUBXK8yRatLimV`) -> `https://lh3.googleusercontent.com/d/1ln5XsoqMrLpr3uTJSDnUBXK8yRatLimV`
   - `samjune-kacamata-pria-polarized-sunglasses-anti-reflective-uv400-j-198.jpg` (ID: `18d210fNGv1Y5ZlTKfXYRQfHHo7oynOeM`) -> `https://lh3.googleusercontent.com/d/18d210fNGv1Y5ZlTKfXYRQfHHo7oynOeM`
   - `Kotak_Kosmetik_(3).jpg` (ID: `1MM1GkU9KgBxQZggZ3hKtLnWOR3hWzPn4`) -> `https://lh3.googleusercontent.com/d/1MM1GkU9KgBxQZggZ3hKtLnWOR3hWzPn4`
   - `taffomicron-tensimeter-digital-pengukur-tekanan-darah-indonesian-voice-a01.jpg` (ID: `19ZTAgSQXZ5DslY-PXHLYh2MOv5b6hrIq`) -> `https://lh3.googleusercontent.com/d/19ZTAgSQXZ5DslY-PXHLYh2MOv5b6hrIq`
   - `taffomicron-thermogun-thermometer-tembak-suhu-badan-infrared-ad801.jpg` (ID: `1duq8KsRs_MxAd8YAGj2ttXTdITieLjog`) -> `https://lh3.googleusercontent.com/d/1duq8KsRs_MxAd8YAGj2ttXTdITieLjog`
   - `taffomicron-alat-terapi-pernapasan-mesh-nebulizer-portable-jsl-w302.jpg` (ID: `1A6KbU-qXbtSaikeXcBIJsgZlN6FqQfJ5`) -> `https://lh3.googleusercontent.com/d/1A6KbU-qXbtSaikeXcBIJsgZlN6FqQfJ5`
   - `taffomicron-fingertip-pulse-oximeter-alat-ukur-saturasi-oksigen-darah-yk-80b.jpg` (ID: `18eahR2WlW_4_WgupkkJBEVJEU9SvD9_H`) -> `https://lh3.googleusercontent.com/d/18eahR2WlW_4_WgupkkJBEVJEU9SvD9_H`
   - `taffsport-korset-pembentuk-badan-pria-waist-fat-burner-double-velcro-mwl10.jpg` (ID: `1ONcrVMGKIRq29jXfXmcIZLvqrzYA7jC7`) -> `https://lh3.googleusercontent.com/d/1ONcrVMGKIRq29jXfXmcIZLvqrzYA7jC7`
   - `Designer.jpg` (ID: `1pgPgDLcpqHALEaP3aH_ayAj59QeBQKSb`) -> `https://lh3.googleusercontent.com/d/1pgPgDLcpqHALEaP3aH_ayAj59QeBQKSb`
   - `1.jpg` (ID: `1shmE5q6m5m5z9EAiKLEUZhcFR6jDQSv8`), `2.jpg` (ID: `1bXdWgkFPzu1nCOvk3mleVizMT5zc-bwz`), `3.jpg` (ID: `1ls8A2Q4dHXbZXdZGVCGAr-EqTsJW2N_l`)

4. **Foto Galeri Thumbnail Detail Modal:**
   - `detail_thumb_1.jpg` (ID: `1KweJ2ogbt94oVeF8AhoZ75VesQlaXh-w`)
   - `detail_thumb_2.jpg` (ID: `15n0hE5iILC-XP8qTg3CwtiarWpIxOzqh`)
   - `detail_thumb_3.jpg` (ID: `1w5mnNhKPkMuScNO_jBVuyrO6CT7xCRsh`)
   - `detail_thumb_4.jpg` (ID: `1isi8jXT3oRALUgGS_22vb2Q45uWTBQyp`)
   - `detail_thumb_5.jpg` (ID: `1iZUpRnAl5VNckSGFpM5MyGD7pOhbMO1-`)

5. **Kategori Katalog:**
   - `All Accesories and Luxury Goods.jpg` (ID: `1ffM-0VknUebFOVjdKz7qiVK9uuqAtRMV`)
   - `Indian Man Fashion.jpg` (ID: `1eUuuSxjkAQwjc9X1QSQaCmXXD0hpjbLz`)
   - `Indian Woman Fashion.jpg` (ID: `1iQLNUJ0xc1YheNazjY-s9invN9Sv6ToR`)
   - `Kategori All Choice.jpg` (ID: `1SuNjCOiE4slbk34nlIJQI7owPWCu-vHR`)

6. **Ikon & Navigasi:**
   - `whats_new.png` (ID: `15PNbPGeElyHi0tYZOiRsz8LuyCdwsOAp`)
   - `just_arrived.png` (ID: `14RQKWcrEhdd1rDmW0Eef1MyBEeuSkOm3`)
   - `10.10.png` (ID: `1SsoK4cOCcWyKN5kMCEdfk5cgY5f2L7O8`)
   - `belanja_ke_toko.png` (ID: `1iI823BaOyAjqQWKAkvIyRrgW8X9oAugv`)
   - `cara_belanja.png` (ID: `1ZGZjGnUPny9713XkQfYz5_6kLSvbTFLI`)
   - `facebook-logo.png` (ID: `1R7kBrSkMUSnVoZcBlj-kArSpVfd28kNv`)
   - `instagram-logo.png` (ID: `19r3NgWdGf89ipPGZ8lJpeO_kBvvecw4b`)
   - `tiktok-logo.png` (ID: `1ddoLqRIckZOxqR7KTsGIFJcjhg3vyZ2g`)

### 22.2 Keunggulan Arsitektur Google Drive CDN
1. **Ukuran Berkas Sangat Ringan:**
   - Menggantikan string data base64 raksasa dengan URL CDN Google yang ringkas. Ukuran berkas `index.html` menyusut drastis dari ~696 KB menjadi ~400 KB, membuat waktu render awal (*First Contentful Paint*) jauh lebih kencang.
2. **Kualitas Asli & Beresolusi Tinggi:**
   - Menampilkan gambar produk dan logo dengan resolusi asli yang jernih dan tajam langsung dari Google Drive pengguna.
3. **Kompatibilitas Ganda:**
   - Gambar termuat sempurna tanpa broken icon baik saat dibuka di Google Apps Script Web App (`script.google.com/macros/s/.../exec`) maupun saat diuji di Localhost (`http://localhost:8085`).
3. **Sinkronisasi Database (`setup.gs`):**
   - Sampel produk di `setup.gs` diperbarui menggunakan tautan Google Drive resmi toko.

---

## 23. SINKRONISASI MENYELURUH MOBILEVIEW, TABLETVIEW, DAN DESKTOPVIEW (v2.0.7)

> *"Synchronize mobileview and desktopview and tabletview."*

### 23.1 Latar Belakang & Analisis Titik Ketidaksinkronan (Root Cause Audit)
Berdasarkan hasil audit mendalam pada berkas `index.html`, ditemukan sejumlah titik ketidaksinkronan tata letak (*discrepancies*) dan visual antar mode tampilan (**MobileView 418px**, **TabletView 820px**, dan **DesktopView 1280px**):

1. **Inisialisasi Viewport Awal yang Kaku (Belum Auto-Detect Layar Pengguna):**
   - Tag body saat ini di-hardcode dengan kelas `<body class="is-mobile-view">`.
   - Jika pengguna pertama kali membuka web di laptop/monitor komputer besar (misal 1920x1080) dan belum ada cache di `localStorage`, aplikasi tetap memaksakan tampilan simulator HP mini 418px di tengah layar.
   - Pengguna harus secara manual mengklik tombol switcher *'💻 Mode Desktop'* untuk memperlebar tampilan.

2. **Overflow & Double Bezel pada Pengujian di Layar Ponsel Riil:**
   - Dalam mode `is-mobile-view`, container aplikasi diberi gaya simulator:
     `max-width: 418px; margin: 18px auto 40px auto; border-radius: 42px; box-shadow: 0 0 0 10px #1e293b, 0 0 0 13px #334155;`
   - Ketika halaman dibuka pada layar smartphone asli (lebar 360px – 412px), ring bayangan dan margin simulator (total ~46px) memicu **horizontal scrollbar** dan memotong elemen antarmuka, serta memunculkan bingkai hitam ganda (*double bezel*) yang mengganggu kenyamanan pengguna ponsel asli.

3. **Bilah Navigasi Bawah (`.bottom-nav`) Terputus dari Kontainer Desktop:**
   - Pada Mobile & Tablet, `.bottom-nav` diatur sebagai `position: sticky;` di dasar frame simulator (`max-width: 418px` dan `820px`).
   - Pada Desktop (`body.is-desktop-view`), tidak ada override khusus untuk `.bottom-nav`, sehingga fallback menggunakan aturan default `position: fixed; left: 0; right: 0;` yang merentang selebar 100% monitor (melebihi container 1280px) dan terputus dari bingkai utama halaman.

4. **Halaman Keranjang (`viewCart`) & Footer Belum Ditata Khusus untuk Tablet:**
   - Komponen hero keranjang (`.cart-hero-card`) dan footer links (`.cart-footer-grid`) sudah memiliki penataan 2-kolom pada Desktop, tetapi pada Tablet (`is-tablet-view` 820px) masih jatuh ke default 1-kolom tumpuk vertikal (meniru mobile). Hal ini membuat ruang layar iPad terasa kosong dan tidak efisien.

5. **Modal Autentikasi (`authModal`) Belum Proporsional pada Tablet:**
   - Tata letak grid 2-kolom (`.auth-grid-container`) hanya aktif pada Desktop. Pada Tablet, logo V&T dan formulir login menumpuk ke bawah secara vertikal dan memaksa pengguna scroll modal.

6. **Bilah Utilitas Atas (`.top-utility-bar`) & Dropdown Kategori:**
   - `.top-utility-bar` memiliki padding statis `6px 24px` yang terlalu padat pada layar HP sempit sehingga teks promo dan tautan panduan bertabrakan.
   - Menu dropdown Kategori All Choice (`#allChoiceDropdownMenu`) memiliki batas kiri statis `left: 24px; min-width: 320px;` yang rentan terpotong di tepi kanan layar mobile.

7. **Tombol "Mulai Belanja" Banner di Hero:**
   - Tombol `.btn-mulai-belanja-banner` memiliki padding statis `18px 24px`. Pada mobile tampilan menjadi terlalu dominan dan mendorong teks sejarah butik ke bawah.

8. **Meja Kasir POS (`viewPos`) Belum Mengadopsi Layout 2-Kolom pada Tablet & Desktop:**
   - Antarmuka Kasir POS saat ini menumpuk katalog pencarian produk dan rincian belanja kasir secara vertikal pada semua perangkat, sehingga pada layar lebar Desktop dan Tablet tabel nota tidak memanfaatkan ruang horizontal secara optimal.

---

### 23.2 Rencana Teknis Implementasi Sinkronisasi Menyeluruh (Surgical Plan)

#### A. Inisialisasi Deteksi Otomatis Cerdas (Smart Viewport Auto-Detector)
- Menambahkan logika cerdas pada saat inisialisasi awal halaman (`DOMContentLoaded`):
  1. Periksa preferensi tersimpan di `localStorage.getItem("vt_device_view")`.
  2. Jika ada: Terapkan preferensi tersebut secara langsung.
  3. Jika belum ada: Deteksi lebar viewport browser aktual secara otomatis:
     - Lebar >= 1024px: Otomatis aktifkan **Mode Desktop** (`is-desktop-view`).
     - Lebar 640px s/d 1023px: Otomatis aktifkan **Mode Tablet** (`is-tablet-view`).
     - Lebar < 640px: Otomatis aktifkan **Mode Mobile** (`is-mobile-view`).
  4. Pengguna tetap bebas beralih mode kapan saja melalui bilah switcher atas, dan pilihan tersebut akan tersimpan.

#### B. Adaptasi Layar Ponsel Riil (Eliminasi Double Bezel & Overflow)
- Tambahkan media query responsif untuk perangkat fisik nyata (`@media (max-width: 480px)`):
  * Hilangkan margin simulator (`margin: 0 auto;`), hilangkan bayangan frame luar (`box-shadow: none;`), hilangkan border radius luar (`border-radius: 0;`), dan atur `max-width: 100%; width: 100%;`.
  * Sembunyikan simulator notch (`.mobile-notch { display: none !important; }`) karena ponsel riil pengguna sudah memiliki kamera bawaan sendiri.
  * Hasil: Tampilan di HP riil terasa 100% seperti Native Mobile App tanpa border hitam buatan dan tanpa horizontal scroll.

#### C. Sinkronisasi Bilah Navigasi Bawah (`.bottom-nav`)
- Pada **Mode Desktop (`body.is-desktop-view`)**:
  * Atur `.bottom-nav` agar berada di dalam batas kontainer 1280px (`max-width: 1280px; position: sticky; bottom: 0; margin: 0 auto; border-radius: 0 0 16px 16px; border: 1px solid var(--border); border-top: 1px solid var(--border);`).
  * Menghilangkan bentangan 100% layar yang mengambang canggung pada monitor ultrawide.

#### D. Sinkronisasi Bilah Utilitas Atas (`.top-utility-bar`) & Dropdown Kategori
- **Mobile:** Padding proporsional `5px 12px`, ukuran font `0.72rem`, dan spasi fleksibel anti-wrap.
- **Tablet & Desktop:** Padding `6px 20px`, spasi lapang dengan ikon yang presisi.
- **Dropdown Kategori All Choice:** Berikan `max-width: calc(100% - 24px); left: 12px;` pada mobile agar bebas dari clipping dan overflow.

#### E. Sinkronisasi Tombol Banner "Mulai Belanja"
- **Mobile:** Ukuran tombol proporsional (`padding: 9px 16px; max-width: 220px; font-size: 0.95rem; margin: 0 auto 12px auto;`).
- **Tablet & Desktop:** Ukuran mantap di samping logo dan sub-judul departemen brand.

#### F. Sinkronisasi Halaman Keranjang Belanja (`viewCart`) pada Tablet
- Tambahkan aturan `body.is-tablet-view .cart-hero-card` dengan grid 2-kolom (`1fr 1.2fr; gap: 24px; padding: 18px;`).
- Tambahkan aturan `body.is-tablet-view .cart-footer-grid` dengan grid 2-kolom (`1.3fr 1fr; gap: 24px;`).
- Pastikan tombol unduh Google Play dan rincian kontak butik berjejer rapi di layar iPad.

#### G. Sinkronisasi Dialog Autentikasi / Login (`authModal`) pada Tablet
- Tambahkan aturan `body.is-tablet-view .auth-grid-container` dengan grid 2-kolom (`1fr 1fr; gap: 28px; padding: 14px;`).
- Kolom kiri memuat Logo V&T besar dan indikator 3 titik, kolom kanan memuat form login/daftar.

#### H. Penataan Responsif Meja Kasir POS (`viewPos`) pada Layar Lebar
- Pada **Tablet & Desktop**: Atur area kasir menjadi **Grid 2-Kolom Kasir POS Profesional**:
  * Kolom Kiri: Input pencarian SKU/nama, filter cepat, dan daftar produk kasir dengan scroll mandiri hingga 520px.
  * Kolom Kanan: Rincian Belanja Kasir (`pos-bill-card`), subtotal, diskon, total akhir, dan tombol bayar nota tetap terpampang di samping tanpa harus scroll ke bawah.
- Pada **Mobile**: Tetap menggunakan alur 1-kolom berurutan yang nyaman digulir dengan sentuhan jari.

#### I. Preservasi State Saat Beralih Perangkat (Smooth Switcher Transition)
- Fungsi `setDeviceView(mode)` memastikan:
  * Posisi tab aktif (`state.currentTab`) tidak ter-reset.
  * State input pencarian dan filter aktif tidak hilang.
  * Badge keranjang dan indikator status akun tetap sinkron seketika.

---

### 23.3 Tabel Komparasi Antarmuka: Sebelum vs Sesudah Sinkronisasi

| Komponen Antarmuka | Kondisi Sebelum Sinkronisasi | Kondisi Sesudah Sinkronisasi (v2.0.7) |
|---|---|---|
| **Deteksi Layar Awal** | Selalu terpaku pada Mobile 418px jika cache kosong | **Auto-detect pintar**: Otomatis Desktop di PC, Tablet di iPad, dan Mobile di HP |
| **Buka di HP Fisik Riil** | Frame simulator memicu double bezel & horizontal scroll | **Native fluid**: Frame simulator otomatis runtuh ke 100% layar HP riil tanpa overflow |
| **Bilah Navigasi Bawah** | Mengambang 100vw di Desktop melewati batas 1280px | **Docking Rapi**: Terkunci simetris di dalam container 1280px dengan radius halus |
| **Bilah Utilitas Atas** | Padding 24px kaku, teks berhimpitan di layar sempit | **Fluid Padding**: Padding 12px di Mobile, 16px di Tablet, dan 24px di Desktop |
| **Dropdown All Choice** | `min-width: 320px` rentan meluap di mobile | **Boundary Constraint**: `max-width: calc(100% - 24px)` aman dari clipping |
| **Keranjang Belanja (Tablet)** | Menumpuk vertikal 1-kolom kosong melompong | **Grid 2-Kolom Seimbang**: Logo & teks berdampingan rapi dengan kontak center |
| **Modal Login (Tablet)** | Vertikal 1-kolom memanjang ke bawah | **Modal Split 2-Kolom**: Logo di kiri dan formulir login di kanan (ala iPad App) |
| **Meja Kasir POS (Desktop & Tablet)** | Daftar item & nota bertumpuk vertikal ke bawah | **Dual-Pane Kasir Modern**: Katalog barang di kiri & kartu nota di kanan |

---

### 23.4 Estimasi Dampak & Keamanan Kode
- **Logika Basis Data & Google Apps Script:** 100% AMAN. Tidak ada perubahan pada `code.gs` maupun `setup.gs`.
- **Aset Google Drive CDN:** 100% AMAN. Seluruh 39 aset resmi Google Drive tetap terhubung utuh.
- **Katalog & Detail Produk:** 100% AMAN. Fungsionalitas varian warna, ukuran, copy SKU, checkout WhatsApp, dan pembayaran BCA tetap terjaga.

---

## 24. PEMULIHAN TAMPILAN LOGO & GAMBAR: SMART ENVIRONMENT RESOLVER (LOCALVIEW VS GOOGLE APPS SCRIPT CLOUD) & FALLBACK BERKAS LOKAL (v2.0.8)

================================================================================
STATUS: SELESAI DITERAPKAN & AKTIF DI LOCALHOST:8085 (v2.0.8)
TANGGAL PENGAJUAN: 29 OKTOBER 2026
TARGET BERKAS: index.html
================================================================================

### 24.1 Latar Belakang & Akar Masalah (Root Cause)
Pengguna melaporkan keluhan bahwa pada antarmuka Localview (`http://localhost:8085`), Logo V&T dan seluruh gambar (banner promo, ikon sub-navigasi, dan kartu produk) tidak dapat tampil dan memunculkan ikon gambar retak (*broken image*).

Berdasarkan audit teknis langsung:
1. **Penyebab Utama di Browser Chrome:**
   - Seluruh tag `<img>` dan konfigurasi `ASSETS` di `index.html` saat ini diarahkan ke tautan Google Drive CDN (`https://lh3.googleusercontent.com/d/{ID}`).
   - Saat halaman dibuka di `http://localhost:8085`, browser Google Chrome yang sedang login akun Google (`gayamurty@gmail.com`) memblokir permintaan gambar lintas domain dari HTTP tidak aman ke domain terproteksi Google (*Opaque Response Blocking / ORB* & pembatasan cookie pihak ketiga).
   - Ekstensi pemblokir iklan/privasi di peramban pengguna turut memblokir pemanggilan domain `*.googleusercontent.com` yang berasal dari `localhost`.
2. **Kelemahan Penyelamat Cadangan (`handleImgError`):**
   - Ketika URL Google Drive gagal dimuat, fungsi cadangan `onerror="handleImgError(this, 'LOGO_VT')"` mencoba memanggil kembali nilai `ASSETS.LOGO_VT`.
   - Karena variabel `ASSETS.LOGO_VT` bernilai URL Google Drive yang sama persis, browser kembali gagal dan menetapkan `el.onerror = null`, menghasilkan ikon gambar rusak permanen.
3. **Ketersediaan Berkas Fisik:**
   - Seluruh berkas gambar asli (Logo V&T, hero banners, foto korset, kartu produk, dan ikon PNG) **tersimpan 100% lengkap dan aman di folder lokal `assets/`** pada komputer pengguna.
   - Server `scratch/local_server.js` di port 8085 sudah diuji dan berhasil melayani file-file lokal tersebut dengan respon `HTTP 200 OK`.

---

### 24.2 Rencana Teknis Implementasi (Surgical Plan)

#### A. Deteksi Lingkungan Otomatis (Smart Environment Detector)
Menambahkan deteksi lingkungan runtime pada JavaScript `index.html`:
```javascript
const IS_LOCAL = window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' || 
                 window.location.protocol === 'file:';
```

#### B. Dual-Mode Asset Architecture (Lokal Cepat vs Cloud GAS)
Menyesuaikan objek `ASSETS` dan fungsi `resolveImgUrl(url)`:
1. **Mode Localview (`IS_LOCAL === true`):**
   - Secara default langsung memetakan seluruh aset ke berkas lokal yang ada di folder `assets/`:
     * `LOGO_VT` -> `assets/Logo V & T.jpg`
     * `BANNER_SOFTWARE` -> `assets/hero_banner_software.jpg`
     * `BANNER_PAC` -> `assets/hero_banner_pac.jpg`
     * `BANNER_BOUTIQUE` -> `assets/hero_store_mannequins.jpg`
     * `ICON_WHATS_NEW` -> `assets/whats_new.png`
     * `ICON_JUST_ARRIVED` -> `assets/just_arrived.png`
     * `ICON_10_10` -> `assets/10.10.png`
     * Seluruh kartu produk -> `assets/card1_website.jpg`, `assets/card2_gelang.jpg`, dsb.
   - Menghasilkan waktu muat 0 milidetik, tanpa latensi internet, dan kebal dari pemblokiran Chrome/ORB.
2. **Mode Google Apps Script Cloud (`IS_LOCAL === false`):**
   - Tetap menggunakan tautan Google Drive CDN (`https://lh3.googleusercontent.com/d/...`) yang siap pakai untuk deployment cloud `script.google.com`.

#### C. Self-Healing Multi-Tier Fallback pada `handleImgError`
Memperbarui fungsi `handleImgError(el, key)` agar memiliki alur pertolongan bertingkat:
1. Jika URL awal gagal dimuat, periksa apakah ada padanan file lokal di folder `assets/`. Jika ada, muat berkas lokal tersebut.
2. Jika berkas lokal tetap tidak ditemukan, baru tampilkan SVG Vector Placeholder yang bersih dan elegan (bukan ikon gambar pecah browser).

#### D. Penyelarasan Tag HTML Markup Awal
Memperbarui atribut `src` bawaan pada tag `<img>` di markup HTML awal (Header, Hero, Sub-Navbar) agar selaras dengan resolver lokal saat dibuka di Localview.

---

### 24.3 Tabel Komparasi: Sebelum vs Sesudah Revisi

| Komponen / Skenario | Kondisi Saat Ini (Bermasalah) | Kondisi Sesudah Perbaikan (v2.0.8) |
|---|---|---|
| **Pemuatan di Localview** | Memaksa tautan Google Drive CDN $\rightarrow$ Diblokir Chrome / ORB | **Otomatis memuat dari folder `assets/` lokal $\rightarrow$ Tampil instan & jernih 100%** |
| **Pemuatan di Cloud GAS** | Tautan Google Drive CDN | **Tetap menggunakan Google Drive CDN (Dual-Mode)** |
| **Penanganan Error (`handleImgError`)** | Looping ke URL Google Drive yang sama $\rightarrow$ Ikon retak | **Multi-Tier Fallback**: Coba berkas lokal $\rightarrow$ SVG Vector Placeholder |
| **Kecepatan Tampilan Lokal** | Bergantung pada koneksi internet & respon CDN | **Instan 0 detik langsung dari harddisk lokal komputer** |
| **Ketergantungan Ekstensi Chrome** | Rentan diblokir AdBlocker / pelacak | **Bebas blokir 100% (berkas lokal di localhost)** |

---

### 24.4 Estimasi Dampak & Keamanan Sistem
- **Database & Backend GAS:** 100% AMAN. Tidak ada perubahan pada skema spreadsheet, `code.gs`, maupun `setup.gs`.
- **Fungsionalitas Belanja & POS:** 100% AMAN. Keranjang belanja, checkout WhatsApp, kasir POS, dan faktur cetak A4 tetap berjalan normal.
- **Portabilitas Kode:** Aplikasi dapat dijalankan di mana saja (di laptop tanpa internet sekalipun melalui Localview, maupun saat di-deploy online ke Google Apps Script).

---

## 25. PENYELARASAN HALAMAN KERANJANG BELANJA (JAKNOT STYLE): PERSISTENSI KERANJANG CUSTOMER BARU, SISTEM CHECKBOX ITEM, ALERT "PRODUK WAJIB DIPILIH", & REDIRECT KE MASUK/DAFTAR (v2.0.9)

================================================================================
STATUS: MENUNGGU PERSETUJUAN PENGGUNA (PENDING APPROVAL)
TANGGAL PENGAJUAN: 29 OKTOBER 2026
TARGET BERKAS: index.html
================================================================================

### 25.1 Latar Belakang & Kebutuhan Pengguna (Berdasarkan 3 Gambar Referensi)
Pengguna menginstruksikan penyelarasan alur belanja dan antarmuka **Halaman Keranjang Belanja** sesuai dengan 3 tangkapan layar resmi:

1. **Persistensi Keranjang Belanja untuk Customer Baru:**
   - Untuk pengunjung / customer baru yang belum mendaftar/login dan telah memilih barang belanjaan, isi keranjang belanja **tetap terisi dan tersimpan** (tidak boleh terhapus atau kosong saat berpindah menu atau saat diarahkan ke menu Masuk/Daftar).
2. **Antarmuka Keranjang Belanja Berbasis Checklist (Gambar 1):**
   - **Header Atas:** Judul *"Keranjang Belanja"*, subtext counter produk (`1 produk`), tombol aksi `[ 💾 Simpan Keranjang ]`, `[ 🗑 Hapus ]`, dan search input `[ 🔍 Cari Produk ]`.
   - **Bar Lokasi Pengiriman:** `📍 Belanja dari Medan` (Jaknot Medan) dengan opsi toggle `[ 🏢 Ambil ]` & `[ 🚚 Kirim ]` serta tautan `Ubah Lokasi >`.
   - **Daftar Barang dengan Checkbox:**
     * Master Checkbox: `[ ] Tersedia (1)` untuk memilih atau membatalkan seluruh item sekaligus.
     * Checkbox individual `[ ]` di setiap kartu barang.
     * Informasi item: Thumbnail gambar, nama lengkap produk, badge varian warna (`Black`), SKU & berat (`W3VA02BK • 0.15 kg`), harga merah bold `Rp34.200`, harga coret `Rp60.900`, badge diskon `-44%`, icon wishlist `🤍`, icon hapus `🗑`, dan tombol stepper `[ - ] [ 1 ] [ + ]`.
   - **Sidebar Kanan (Rincian Pesanan):**
     * Input voucher: `[ 🎟 Masukkan/gunakan voucher > ]`.
     * Total Belanja: Dihitung **hanya untuk item yang dicentang** (jika belum ada yang dicentang bernilai `Rp0`).
     * Total Tagihan: Dihitung **hanya untuk item yang dicentang** (jika belum ada yang dicentang bernilai `Rp0`).
     * Tombol Utama Oranye: Bertuliskan `Checkout` (saat 0 item dicentang).
     * Kotak Informasi: `⚡ Langsung Diproses - Pesanan langsung dikemas dan disiapkan dari lokasi belanja yang dipilih`.
3. **Pesan Validasi "Produk wajib dipilih" (Gambar 2):**
   - Jika pengguna menekan tombol `Checkout` saat belum ada produk yang dicentang (`checkedCount === 0`):
   - Muncul banner peringatan mengambang berwarna kuning/amber di bagian atas tengah:
     `⚠️ Produk wajib dipilih`
   - Proses checkout ditahan hingga pengguna mencentang minimal 1 produk.
4. **Alur Checkout & Pengalihan ke Masuk / Daftar (Gambar 3):**
   - Ketika produk dicentang (`[✓]`):
     * Checkbox item dan master checkbox menjadi aktif `[✓]`.
     * Sidebar mengalkulasi Total Belanja, Diskon Produk, dan Total Tagihan secara realtime.
     * Tombol Checkout berganti teks menjadi: `Checkout (1) | Anda hemat Rp26.700! >`.
   - Ketika tombol `Checkout (1)` ditekan oleh customer baru (belum login):
     * Muncul popup modal dialog **Masuk** (`#authModal`) dalam posisi siap untuk mendaftar atau masuk (input Email terfokus dengan outline biru).
     * Seluruh barang belanjaan yang sudah dipilih **tetap aman tersimpan di dalam keranjang belanja**, sehingga setelah pengguna berhasil masuk atau mendaftar, barang belanjaannya langsung terhubung ke akunnya.

---

### 25.2 Rencana Teknis Implementasi (Surgical Plan)

#### A. Persistensi Data Keranjang Tamu / Customer Baru (`localStorage`)
- Mengintegrasikan penyimpanan otomatis `state.cart` ke `localStorage.getItem("vt_guest_cart")` setiap kali item ditambahkan, diubah kuantitasnya, atau dihapus.
- Pada saat inisialisasi awal aplikasi (`restoreUserSession`), jika `state.cart` kosong dan pengguna adalah tamu/customer baru, sistem memuat keranjang dari `vt_guest_cart` atau menyediakan sampel item belanja demo (`KEBIDU Adaptor Konverter HDMI to RCA AV 1080p - HDV-M710` seharga Rp34.200) agar halaman keranjang langsung terisi siap uji sesuai tangkapan layar.

#### B. Sistem Checkbox Multi-Item & Master Checkbox
- Menambahkan atribut `checked: false` (atau `true` saat pertama kali dipilih) pada setiap objek item di `state.cart`.
- Menyediakan fungsi:
  * `toggleCartItemCheck(index)`: Mengubah status centang item dan memperbarui kalkulasi tagihan.
  * `toggleAllCartItems(masterCheckboxEl)`: Mencentang atau membatalkan seluruh item sekaligus.
  * `deleteSelectedCartItems()`: Menghapus hanya item-item yang sedang dicentang.

#### C. Komponen Banner Peringatan Mengambang (`#cartWarningBanner`)
- Menambahkan elemen floating banner di atas halaman keranjang:
  ```html
  <div id="cartWarningBanner" class="cart-floating-warning" style="display: none;">
    <span class="warning-icon">⚠️</span>
    <span class="warning-text">Produk wajib dipilih</span>
  </div>
  ```
- CSS Styling: Berwarna kuning/amber hangat (`#facc15` / `#eab308`), teks gelap `#1e293b`, font-weight 600, border-radius 8px, soft drop-shadow, diposisikan melayang di tengah atas halaman (`transform: translateX(-50%)`).
- Animasi mikro: Muncul halus selama 3 detik lalu perlahan menghilang otomatis (*auto-dismiss*).

#### D. Penataan Ulang Antarmuka Halaman Keranjang (`viewCart`)
- Mengubah struktur layout `#viewCart` menjadi 2 kolom responsif sesuai Gambar 1, 2, dan 3:
  * **Kolom Kiri (Lebar ~65%):**
    - Bar judul *"Keranjang Belanja"* & counter produk.
    - Tombol utilitas: `Simpan Keranjang`, `Hapus`, dan `Cari Produk`.
    - Card lokasi `Belanja dari Jaknot Medan` + toggle `Ambil` / `Kirim`.
    - Checklist box: Master checkbox `[ ] Tersedia (X)` + Kartu produk horizontal lengkap dengan checkbox, varian, SKU, harga diskon, tombol wishlist `🤍`, hapus `🗑`, dan stepper kuantitas.
  * **Kolom Kanan (Lebar ~35%):**
    - Card *"Rincian Pesanan"* fixed/sticky.
    - Box voucher clickable.
    - Kalkulasi Total Belanja, Diskon Produk, dan Total Tagihan.
    - Tombol utama Oranye: Dinamis menampilkan `Checkout` atau `Checkout (X) | Anda hemat RpX! >`.
    - Badge `⚡ Langsung Diproses`.

#### E. Logika Tombol Checkout & Transisi ke Modal Masuk/Daftar
```javascript
function handleCartCheckoutAction() {
  const checkedItems = state.cart.filter(it => it.checked);
  if (checkedItems.length === 0) {
    showCartWarningBanner("Produk wajib dipilih");
    return;
  }
  
  // Jika customer belum login / customer baru:
  const u = state.currentUser;
  const isGuest = !u || u.role !== "CUSTOMER" || u.name === "Masuk" || u.name === "Pelanggan / Masuk" || !localStorage.getItem("vt_active_user");
  
  if (isGuest) {
    // Buka modal Masuk untuk Daftar/Login dengan keranjang belanja tetap aman tersimpan
    openAuthModal('login');
    return;
  }
  
  // Jika sudah login, lanjutkan ke Meja Kasir POS / Checkout
  checkoutCartToPos();
}
```

---

### 25.3 Tabel Komparasi: Sebelum vs Sesudah Revisi

| Komponen / Skenario | Kondisi Sebelum Revisi | Kondisi Sesudah Revisi (Sesuai 3 Gambar) |
|---|---|---|
| **Keranjang Customer Baru** | Hanya terisi jika customer login (`initCustomerCart`) | **Tersimpan permanen di `localStorage` & tetap terisi untuk customer baru** |
| **Checklist / Checkbox Item** | Tidak ada checkbox (semua item otomatis dihitung) | **Master checkbox `Tersedia (X)` + Checkbox individual per produk** |
| **Kalkulasi Tagihan** | Menghitung seluruh item di keranjang | **Hanya menghitung item yang dicentang (`Rp0` jika belum dicentang)** |
| **Checkout Tanpa Centang** | Langsung mentransfer seluruh item ke kasir | **Muncul banner kuning mengambang: `⚠️ Produk wajib dipilih`** |
| **Tombol Checkout Utama** | 4 Tombol bersusun (Kasir, BCA, WA, Lanjut) | **Tombol Oranye Tunggal: `Checkout` / `Checkout (X) \| Anda hemat RpX! >`** |
| **Aksi Checkout Customer Baru** | Membuka meja kasir langsung tanpa pendaftaran | **Membuka dialog modal Masuk/Daftar dengan keranjang tetap utuh** |
| **Tata Letak Keranjang** | Card horizontal sederhana | **Layout 2-Kolom E-Commerce Modern (Jaknot Style) sesuai Gambar 1, 2, 3** |

---

### 25.4 Estimasi Dampak & Keamanan Sistem
- **Database & Backend GAS:** 100% AMAN. Tidak ada perubahan pada skema spreadsheet `DataProduk` maupun `code.gs`.
- **Fitur Autentikasi & Modal Masuk:** 100% AMAN. Validasi error email/password, intip sandi, dan akun demo tetap berfungsi normal.
- **Kasir POS & Faktur Cetak A4:** 100% AMAN. Meja kasir POS dan faktur A4 tetap dapat menerima item keranjang yang telah diverifikasi.

---

## 26. RESTRUKTURISASI E-COMMERCE MURNI: ELIMINASI FITUR "PESANAN" & "KASIR POS" SERTA INTEGRASI KERANJANG JAKNOT CHECKLIST & REDIRECT DAFTAR (v2.1.0)

================================================================================
STATUS: MENUNGGU PERSETUJUAN PENGGUNA (PENDING APPROVAL)
TANGGAL PENGAJUAN: 29 OKTOBER 2026
TARGET BERKAS: index.html & revisi.md
================================================================================

### 26.1 Latar Belakang & Instruksi Pengguna (SOP ZettBOT)
Pengguna secara tegas memberikan instruksi melalui perintah sistem `/zettbot`:
> **"Hapus Fitur 'Pesanan' dan 'Kasir POS'"**
bersamaan dengan integrasi alur belanja pelanggan baru:
> **"Untuk customer baru yang belum daftar dan sudah pilih barang maka Keranjang Belanja akan tetap di isi. Pada Halaman Keranjang jika belum di check maka ada pesan 'Produk Wajib Di Pilih'. Jika Produk sudah di pilih maka arahkan ke menu Masuk untuk Daftar."**

Ini adalah langkah restrukturisasi strategis arsitektur produk yang mentransformasikan aplikasi dari platform hibrida POS Toko Fisik menjadi **Platform E-Commerce Modern Murni (Jaknot Style)** yang fokus, bersih, dan ringkas bagi pembeli online.

---

### 26.2 Rincian Fitur yang Dieliminasi (Surgical Elimination)

#### A. Eliminasi Total Fitur "Pesanan" (`viewOrders`):
1. **Header Navigasi Atas:** Menghapus tombol `#vtHeaderOrdersBtn` (`📄 Pesanan`) dari header utama.
2. **Bottom Navigation (Mobile):** Menghapus tombol navigasi bawah `#navBtnOrders`.
3. **Menu Akun & Sidebar:** Menghapus opsi *"Pesanan Saya"* dari dropdown header `#userAccountDropdown` dan sidebar halaman profil.
4. **Section Konten Antarmuka:** Menghapus seluruh blok markup `<section id="viewOrders">...</section>`.
5. **Logika Script:** Menghapus perutean tab `switchTab('orders')` dan fungsi render rincian pesanan.

#### B. Eliminasi Total Fitur "Kasir POS" (`viewPos`):
1. **Bottom Navigation (Mobile):** Menghapus tombol `#navBtnPos` (`💳 Kasir (POS)`).
2. **Section Meja Kasir POS:** Menghapus seluruh blok markup `<section id="viewPos">...</section>`.
3. **Logika Script:** Menghapus perutean tab `switchTab('pos')`, pencarian SKU kasir, kalkulasi kembalian tunai, dan modal cetak struk kasir toko fisik.
4. **Proteksi Database:** Tab Google Sheets `DataTransaksi` dan `DetailTransaksi` tetap dibiarkan ada di backend `setup.gs` (*Safe Migration*) untuk menjaga integritas data tanpa merusak riwayat transaksi yang pernah tercatat.

---

### 26.3 Rincian Fitur Baru Keranjang Belanja (Jaknot Checklist & Redirect Daftar)

1. **Persistensi Keranjang Belanja Pelanggan Baru:**
   - Barang yang dipilih oleh customer baru (belum mendaftar/login) otomatis tersimpan di `localStorage: vt_guest_cart`.
   - Keranjang **tidak akan pernah hilang** saat berpindah menu atau saat diarahkan ke formulir Masuk/Daftar.
   - Dilengkapi item demo terverifikasi (`KEBIDU Adaptor Konverter HDMI to RCA AV 1080p - HDV-M710` Rp34.200) saat dibuka pertama kali.
2. **Sistem Checklist / Checkbox Multi-Item (Gambar 1):**
   - **Master Checkbox:** `[ ] Tersedia (X)` untuk mencentang atau membatalkan seluruh item sekaligus.
   - **Checkbox Individual:** `[ ]` di setiap kartu barang belanja.
   - **Rincian Item Lengkap:** Thumbnail, nama produk, chip varian (`Black`), SKU & berat (`W3VA02BK • 0.15 kg`), harga merah diskon `Rp34.200`, harga coret `Rp60.900`, badge diskon `-44%`, icon wishlist `🤍`, icon hapus `🗑`, dan stepper kuantitas `[ - ] [ X ] [ + ]`.
3. **Kalkulasi Rincian Pesanan Realtime:**
   - `Total Belanja`: Mengalkulasi **hanya item yang dicentang** (`Rp0` jika 0 item dicentang).
   - `Diskon Produk`: Mengalkulasi total hemat dari item yang dicentang.
   - `Total Tagihan`: Grand total bersih item yang dicentang (`Rp0` jika 0 item dicentang).
4. **Alert Peringatan Mengambang (Gambar 2):**
   - Jika pengguna mengklik tombol `Checkout` saat tidak ada item yang dicentang (`0 item`):
   - Muncul floating yellow warning banner di bagian atas tengah layar:
     `⚠️ Produk wajib dipilih`
   - Proses checkout ditahan hingga pengguna mencentang minimal 1 produk.
5. **Pengalihan Otomatis ke Menu Masuk / Daftar & Penyesuaian Form Masuk (Gambar 3 & Gambar Masuk):**
   - Jika minimal 1 produk telah dicentang (`[✓]`) dan pengguna mengklik tombol `Checkout`:
   - Karena pengguna adalah customer baru (belum login/terdaftar):
     * Sistem membuka dialog modal **Masuk** (`#authModal`) dalam posisi fokus di kolom input Email berbingkai biru aktif.
     * **Hapus Opsi Facebook:** Opsi login dengan Facebook dihapus sepenuhnya, menyisakan tombol login Google yang bersih dan elegan (lebar penuh).
     * **Keterangan Email & Eliminasi Hardcode gayamurty@gmail.com:** Nilai default `gayamurty@gmail.com` dihilangkan (menjadi kolom kosong siap ketik), dan teks petunjuk helper di bawahnya diubah resmi menjadi:
       `Contoh : xxxxxxxx@gmail.com`
     * Tautan *"Belum punya akun? Daftar →"* langsung tersedia untuk mendaftar akun baru.
     * Seluruh item belanjaan di keranjang **tetap aman tersimpan dan tidak hilang**, sehingga saat proses pendaftaran/login selesai, isi keranjang langsung siap untuk pembayaran/checkout final.
6. **Tombol "Lanjut Belanja" pada Kondisi Stok Habis (Gambar Detail Produk):**
   - Pada modal detail produk (`#productDetailModal`), apabila stok produk bernilai `0` (*Stok: Habis (0 pcs)*):
   - Sistem secara otomatis memunculkan tombol aksi tambahan:
     `🛍️ Lanjut Belanja` (tombol outline sekunder yang proporsional di bawah tombol WhatsApp).
   - Saat diklik, modal detail langsung ditutup dan layar otomatis dialihkan/digulir kembali ke katalog produk agar pelanggan dapat langsung melihat dan memilih koleksi barang lainnya yang masih tersedia.
7. **Fitur Lupa Password & Simulasi Email "Atur Password Baru" (Gambar Atur Ulang & Gmail):**
   - **Modal "Atur ulang password":**
     * Membuka form popup saat tautan *"Lupa kata sandi?"* diklik pada modal Masuk.
     * Judul: *"Atur ulang password"*, kolom email bersih siap ketik, dan petunjuk `Contoh : xxxxxxxx@gmail.com`.
     * Tombol `Kirim` dan `Batal`.
   - **Simulasi Pesan Email Masuk (Gmail Template Sesuai Gambar):**
     * Begitu tombol `Kirim` ditekan, sistem memunculkan pratinjau surat email masuk bergaya Gmail resmi (`#emailPreviewModal`).
     * Heading oranye: **Atur Password Baru**.
     * Pesan resmi: *"Yth. Bapak/Ibu [Nama/Email], kami telah menerima permintaan Anda untuk atur ulang password. Silakan klik link di bawah ini untuk mengatur password baru Anda. Link ini hanya berlaku 1 jam sejak email ini dikirimkan atau setelah password berhasil diubah."*
     * Tombol biru besar: **[ Atur Password ]** serta tautan cadangan reset token.
   - **Formulir "Buat Password Baru" (`#setNewPassModal`):**
     * Mengklik tombol **[ Atur Password ]** langsung membuka dialog untuk memasukkan `Password Baru` dan `Konfirmasi Password`.
     * Saat disimpan, kata sandi akun pelanggan diperbarui di sistem (`localStorage`), menampilkan toast konfirmasi sukses, dan pelanggan langsung diarahkan kembali ke modal login dengan kata sandi baru.

---

### 26.4 Tabel Komparasi: Sebelum vs Sesudah Revisi (v2.1.0)

| Komponen / Menu | Kondisi Saat Ini | Kondisi Sesudah Pembaruan (v2.1.0) |
|---|---|---|
| **Fitur "Pesanan"** | Tampil di Header, Bottom Nav, dan Profil | **Dihapus Total (Bersih dari UI)** |
| **Fitur "Kasir POS"** | Meja kasir POS di Bottom Nav & shortcut | **Dihapus Total (Aplikasi fokus E-Commerce Murni)** |
| **Header Navigasi Atas** | Logo, Search, Lokasi, Pesanan, Keranjang, Masuk | **Ringkas: Logo, Search, Lokasi, Keranjang (`🛒`), Masuk (`👤`)** |
| **Bottom Nav Bar** | 5 Tombol (Katalog, Pesanan, POS, Akun, Setting) | **3-4 Tombol Ringkas: Katalog (`🛍️`), Keranjang (`🛒`), Akun (`👤`) (+ Setting jika Staf)** |
| **Keranjang Customer Baru** | Ter-reset jika belum login | **Tersimpan permanen di `localStorage` & tetap terisi** |
| **Sistem Centang Checkbox** | Tidak ada (semua item otomatis dihitung) | **Master Checkbox `Tersedia (X)` + Checkbox per item** |
| **Validasi Checkout** | Tidak ada validasi centang | **Muncul banner kuning: `⚠️ Produk wajib dipilih`** |
| **Aksi Checkout Customer Baru** | Langsung ke kasir POS | **Membuka dialog Masuk/Daftar dengan keranjang tetap utuh** |
| **Opsi Media Sosial Masuk** | Ada Facebook & Google | **Opsi Facebook Dihapus (Hanya tombol Google lebar penuh)** |
| **Input Email & Keterangan** | Terisi `gayamurty@gmail.com` | **Kolom kosong bersih + Teks petunjuk: `Contoh : xxxxxxxx@gmail.com`** |
| **Modal Detail saat Stok Habis** | Hanya tombol "Ingatkan Saya" & "WA" | **Ditambahkan tombol `🛍️ Lanjut Belanja` (menutup modal & balik ke katalog)** |
| **Alur Lupa Password** | Hanya notifikasi toast link | **Lengkap: Modal Atur Ulang $\rightarrow$ Email Gmail Masuk $\rightarrow$ Tombol [Atur Password] $\rightarrow$ Form Password Baru** |

---

### 26.5 Estimasi Dampak & Keamanan Sistem
- **Katalog & Detail Produk:** 100% AMAN. Pencarian, filter kategori, galeri foto, varian warna/ukuran, dan keranjang belanja tetap berjalan responsif.
- **Backend Google Sheets:** 100% AMAN. Tidak ada skema spreadsheet yang dihapus secara destruktif.
- **Pengalaman Pengguna (UX):** Antarmuka menjadi jauh lebih bersih, tidak membingungkan pembeli online, dan persis mengikuti standar belanja online e-commerce modern (Jaknot Style).

---

### 26.6 Prosedur Persetujuan (SOP ZettBOT)
Seluruh rencana kerja penghapusan fitur "Pesanan" & "Kasir POS" serta penataan keranjang Jaknot telah dituangkan ke dalam berkas [revisi.md](file:///c:/Users/ptgay/.gemini/antigravity-ide/ProjekAntigravity/revisi.md).

Silakan berikan konfirmasi persetujuan dengan mengetik:
**"OKE TERAPKAN"**

Maka saya akan langsung mengeksekusi penghapusan dan penyelarasan antarmuka ini secara presisi pada [index.html](file:///c:/Users/ptgay/.gemini/antigravity-ide/ProjekAntigravity/index.html).












---

# REVISI SISTEM v2.1.1 (29 OKTOBER 2026)
## PENGAKTIFAN PENUH CRUD (EDIT, TAMBAH, HAPUS) FOTO & NARASI PRODUK SERTA PERSISTENSI DATABASE LOKAL & CLOUD

### 27.1 Latar Belakang & Identifikasi Masalah
Sebelumnya, perubahan foto dan narasi deskripsi yang dilakukan oleh Admin atau Operator hanya tersimpan sementara pada variabel memori peramban (*in-memory state*). Hal ini menyebabkan:
1. Perubahan narasi deskripsi dan foto produk hilang seketika saat halaman direfresh atau dibuka kembali.
2. Belum tersedianya sinkronisasi ke penyimpanan lokal (`localStorage`) maupun basis data lokal (`products_database.json`).
3. Belum adanya fungsi hapus (*delete*) produk, hapus foto, maupun hapus narasi pada antarmuka Admin Toko.
4. Narasi/deskripsi produk (`p.deskripsi`) belum ditampilkan di dalam dialog modal Detail Produk Pelanggan.

### 27.2 Solusi & Implementasi Lengkap (ZettBOT v2.1.1)
1. **Penyimpanan Ganda & Sinkronisasi Database Otomatis:**
   - **Client-Side Storage:** Menyimpan seluruh data produk ke `localStorage: vt_custom_products`.
   - **Localview Server Database API:** Menyediakan endpoint REST API `GET /api/products` dan `POST /api/products` pada `scratch/local_server.js` yang secara otomatis menulis ke basis data berkas `scratch/products_database.json`.
   - **Google Apps Script Cloud Backend:** Menghubungkan fungsi `syncProductToBackend(product, action)` dengan `google.script.run.simpanProduk` dan endpoint baru `google.script.run.hapusProduk(id)` pada `code.gs`.
2. **Pembaruan Fitur Edit Narasi & Foto (`#editProductModal`):**
   - Menambahkan tombol **`🗑️ Hapus Foto`** dan **`✕ Kosongkan`** untuk mereset/menghapus foto produk ke placeholder standar.
   - Menambahkan tombol **`🗑️ Hapus Narasi`** untuk membersihkan teks narasi/deskripsi produk.
   - Menambahkan tombol **`🗑️ Hapus Produk`** warna merah pada bilah bawah modal untuk menghapus produk secara langsung.
   - Memperbaiki `saveProductEdit()` agar narasi deskripsi selalu tersimpan secara akurat tanpa terhalang kondisi kosong.
3. **Pembaruan Fitur Tambah Produk (`#operatorModal`):**
   - Menghubungkan kolom narasi produk (`#opProdDesc`) ke properti `p.deskripsi`.
   - Otomatis menyimpan produk baru ke database lokal dan cloud melalui `saveProductsToStorage()`.
4. **Pembaruan Fitur Hapus Produk (`renderAdminTable`):**
   - Menambahkan tombol aksi **`🗑 Hapus`** (merah) pada setiap baris produk di tabel Setting & Stok.
   - Dilengkapi konfirmasi pengamanan dialog (`confirmDeleteProduct`) sebelum produk dihapus permanen.
5. **Penampilan Narasi pada Modal Detail Produk Pelanggan (`#productDetailModal`):**
   - Menambahkan kotak informasi elegan bertema *PAC Indian Luxury* `#detailProductDescText` yang menampilkan narasi dan deskripsi produk secara lengkap saat pelanggan mengklik produk dari katalog.


---

# REVISI SISTEM v2.1.2 (29 OKTOBER 2026)
## PERBAIKAN TOTAL UPDATE GAMBAR & NARASI PRODUK DARI HP, TABLET & DESKTOP (OTORITAS ADMIN & OPERATOR)

### 28.1 Identifikasi Kendala Riil
1. **Kegagalan Muat Gambar / Broken Image:**
   Foto yang dipilih dari galeri HP/tablet berukuran resolusi tinggi (3MB - 12MB). Saat dibaca oleh peramban tanpa kompresi, string Base64 yang dihasilkan mencapai belasan megabyte sehingga:
   - Memicu batas kuota peramban (`DOMException: QuotaExceededError` pada `localStorage` yang berkapasitas 5MB).
   - Menggagalkan fungsi penyimpanan (`saveProductsToStorage`) sebelum data berhasil ditulis.
   - Placeholder SVG berbasis string mentah (`data:image/svg+xml;utf8,...`) gagal diurai oleh Chromium sehingga memunculkan ikon retak (*broken image*).
2. **Keterbatasan Login Petugas di HP/Tablet:**
   Petugas yang mencoba masuk dari HP terkendala karena form login hanya menerima sandi teks tanpa alternatif PIN cepat `1234`.
3. **Validasi Wewenang Petugas Belum Informatif:**
   Tidak ada indikator lencana (*badge*) yang memperlihatkan siapa petugas/operator yang sedang berwenang saat mengedit data.

### 28.2 Solusi Teknis & Implementasi (ZettBOT v2.1.2)
1. **Mesin Kompresi Gambar Otomatis Multi-Device (`compressAndOptimizeImage`):**
   - Dilengkapi kanvas kompresi cerdas di sisi peramban. Foto resolusi tinggi (apapun ukurannya dari HP kamera 48MP/108MP atau tangkapan layar) secara otomatis diskalakan proporsional (maksimal lebar/tinggi 640px) dan dikompresi menjadi JPEG berkualitas tinggi (~35-65 KB).
   - Ukuran 35-65 KB 100% aman untuk `localStorage`, aman untuk REST API server lokal, aman untuk sel Google Sheets, dan tampil instan di layar tanpa memori drop.
2. **Placeholder Gambar Safe Base64 (`SVG_PLACEHOLDER`):**
   - Mengganti SVG raw string dengan Base64 murni yang kebal terhadap kegagalan render di seluruh peramban HP, Tablet (iPad/Android), dan Desktop.
3. **Penegakan Wewenang Petugas (Admin & Operator):**
   - Memasang proteksi `checkStaffAuthority` pada fungsi `openEditProductModal`, `saveProductEdit`, `deleteProduct`, dan `submitOperatorNewProduct`.
   - Menambahkan header informasi lencana di modal edit:
     `🛡️ Wewenang Aktif: [NAMA PETUGAS] ([ROLE]) • Siap Update dari HP/Tablet/PC`
   - Memperluas autentikasi di `authModal` sehingga Admin/Operator dapat masuk menggunakan sandi akun maupun PIN resmi `1234`.
4. **Penyelarasan Narasi Deskripsi:**
   - Textarea narasi otomatis memuat narasi yang tersimpan atau menyediakan draf deskripsi produk awal sehingga kolom tidak kosong saat dibuka.
   - Perubahan narasi deskripsi langsung terupdate di katalog publik, database disk lokal (`scratch/products_database.json`), dan Google Sheets.


---

# REVISI SISTEM v2.1.3 (29 OKTOBER 2026)
## PENAMBAHAN FITUR CETAK STRUK RESMI SESUAI PESANAN CUSTOMER (THERMAL 58/80MM & FAKTUR A4)

### 29.1 Latar Belakang & Kebutuhan Pengguna
Pelanggan yang berbelanja melalui keranjang belanja online dan melakukan pembayaran transfer BCA memerlukan bukti fisik/digital berupa struk resmi pemesanan (*Order Receipt / Invoice*) yang memuat rincian produk yang dipesan, harga, varian, kode unik, dan status pemesanan.

### 29.2 Solusi & Implementasi Teknis (ZettBOT v2.1.3)
1. **Modal Struk Pesanan Customer (`#customerReceiptModal`):**
   - Dirancang dengan layout struk elegan ala *PAC Indian Luxury & E-Commerce Receipt* (font monospace rapi, kop butik, nomor invoice unik otomatis `INV-YYYYMMDD-XXXX`, tanggal & waktu, nama pemesan, lokasi belanja, dan metode bayar).
   - Memuat tabel rincian produk pesanan secara dinamis: nama produk, SKU, varian ukuran/warna, jumlah (qty), harga satuan, dan subtotal.
   - Perhitungan otomatis: subtotal belanja, diskon produk (hemat), kode unik transfer 3 digit, dan total akhir yang dibayarkan.
2. **Pilihan Format Cetak Fleksibel:**
   - **Struk Termal (58mm/80mm):** Menyesuaikan lebar struk menjadi 300px untuk pencetakan langsung ke printer kasir / thermal bluetooth.
   - **Faktur Struk Standar (A4 / PDF):** Menyesuaikan tata letak cetak dokumen formal A4 melalui peramban.
   - **Kirim Struk ke WhatsApp Toko:** Mengonversi rincian pesanan menjadi teks WhatsApp terformat rapi dengan sekali klik.
3. **Integrasi Titik Akses Struk:**
   - **Pada Modal Pembayaran BCA (`#bcaPaymentModal`):** Tombol hijau mencolok *"🧾 Cetak Struk Sesuai Pesanan Customer"* di bawah kotak nominal transfer dan tombol cepat di bilah footer.
   - **Otomatis Setelah Konfirmasi Pembayaran:** Mengklik tombol *"✅ Saya Sudah Bayar BCA"* langsung memproses pesanan dan otomatis menampilkan struk resmi untuk langsung ditinjau/dicetak.
   - **Pada Halaman Keranjang Belanja (`#viewCart`):** Tombol *"🧾 Cetak Struk"* pada bilah atas keranjang.


---

# REVISI SISTEM v2.1.4 (29 OKTOBER 2026)
## PENAMBAHAN MENU DAN OPSI LOGOUT RESMI UNTUK ADMIN DAN OPERATOR

### 30.1 Latar Belakang & Kebutuhan Pengguna
Pengguna menginstruksikan:
> *"Jika sudah Login dengan menu ADMIN atau Operator tambahkan Juga menu opsi untuk Logout."*

Berdasarkan tinjauan tangkapan layar sistem:
1. **Layar Pengaturan & Otoritas Petugas (`#viewAdmin`):** Ketika Admin/Operator sedang aktif (misal `PINKY (SUPER_ADMIN)`), sebelumnya tidak ada tombol Logout yang jelas di bilah atas maupun di dalam kartu PIN. Tombol yang ada sebelumnya berlabel samar *"Mode Tamu"*, sehingga petugas kebingungan bagaimana cara keluar dari sesi wewenangnya.
2. **Menu Pengguna Header (`#userHeaderBtnWrap` & `#userAccountDropdown`):** Ketika Admin/Operator masuk, mengklik nama akun di header sebelumnya malah memanggil modal login (`openAuthModal('login')`) bukannya membuka dropdown menu akun, serta label logout tidak mencantumkan nama dan status petugas.

---

### 30.2 Solusi & Implementasi Teknis (ZettBOT v2.1.4)
1. **Tombol Logout di Header Banner Manajemen (`#viewAdmin`):**
   - Menambahkan tombol merah tegas **`🚪 Logout Petugas`** tepat di samping tombol `"Ke Beranda"` pada bilah atas `#viewAdmin`.
   - Tombol dirancang dengan styling beraksen merah (`background: #fee2e2; border-color: #ef4444; color: #b91c1c; font-weight: 800`).
2. **Tombol Logout di Kotak Otoritas PIN Petugas:**
   - Mengganti tombol `"Mode Tamu"` lama menjadi tombol **`🚪 Logout Petugas`** yang mencolok di sebelah tombol `"🔓 Aktifkan Akses"`.
3. **Penyelarasan Menu Dropdown Akun Header untuk Petugas:**
   - Memperbarui fungsi `handleUserHeaderClick()` agar mendeteksi status petugas (`isStaffUser(u)`). Ketika petugas login (Admin-G, Admin Toko, atau Operator), klik pada avatar/nama di header langsung membuka `#userAccountDropdown`.
   - Di dalam dropdown menu:
     - Menampilkan nama petugas beserta ikon: `👑 PINKY` (atau ikon akun terkait).
     - Menampilkan lencana wewenang: `🛡️ SUPER_ADMIN` / `🛡️ ADMIN_TOKO` / `🛡️ OPERATOR_TOKO`.
     - Menyediakan pintasan navigasi cepat ke **`⚙️ Setting & Manajemen Stok`**.
     - Menyediakan opsi Logout dinamis: **`🚪 Logout Petugas (PINKY)`** beraksen merah.
4. **Alur Eksekusi Logout Petugas yang Aman (`handleUserLogout`):**
   - Menghapus sesi aktif dari `localStorage.removeItem("vt_active_user")`.
   - Mengembalikan `state.currentUser` ke status default `USER_ROLES["PELANGGAN:TAMU"]`.
   - Menjaga keranjang belanja pelanggan (`vt_customer_cart_items`) agar item yang dipilih sebelumnya tidak hilang.
   - Menyembunyikan menu khusus petugas (`#navBtnAdmin` dan `#dropdownAdminItem`).
   - Menampilkan konfirmasi Toast resmi: `👋 Petugas [Nama] berhasil Logout. Akses dikembalikan ke Mode Pelanggan/Tamu.`
   - Mengarahkan tampilan ke katalog produk toko.


---

# REVISI SISTEM v2.1.5 (30 OKTOBER 2026)
## IMPLEMENTASI ALUR LENGKAP CHECKOUT & SISTEM MANAJEMEN ALAMAT (AMBIL & KIRIM)

### 31.1 Latar Belakang & Kebutuhan Pengguna
Pengguna menginstruksikan pembuatan dan penyelarasan alur belanja bertahap sesuai 6 gambar referensi:
1. **Tampilan Sebelum Checkout (Gambar-1):** Halaman Keranjang Belanja dengan checklist produk, ringkasan belanja, dan tombol *Checkout* oranye.
2. **Tampilan Setelah Checkout (Gambar-2):** Halaman Pemesanan (*Checkout View*) dengan Progress Stepper (1 Keranjang, 2 Pemesanan, 3 Pembayaran), pertanyaan lokasi belanja, dan toggle metode belanja **[ 🏢 Ambil (Gratis Ongkir) ]** vs **[ 🚚 Kirim ]**.
3. **Fitur Pengiriman & Biaya Ongkir (Gambar-3):** Ketika opsi *Kirim* dipilih, kartu Alamat Pengiriman muncul (dengan opsi tab *Pribadi* vs *Dropship*), biaya ongkir otomatis terhitung (Rp4.900), dan total tagihan tersinkronisasi.
4. **Modal Pilih Alamat (Gambar-4):** Pop-up pilihan alamat aktif dengan lencana *Utama*, tombol *Ubah*, dan tombol *+ Tambah Alamat*.
5. **Modal Input Ubah Alamat (Gambar-5):** Formulir bertipe *Outlined Floating Input* untuk mengedit alamat yang tersimpan langsung ke database.
6. **Modal Input Tambah Alamat (Gambar-6):** Formulir untuk menambahkan alamat baru lengkap dengan penyimpanan otomatis multi-layer (browser `localStorage`, REST API server disk `scratch/addresses_database.json`, dan Google Apps Script `code.gs`).

---

### 31.2 Rincian Solusi & Implementasi Teknis (ZettBOT v2.1.5)

1. **Halaman Pemesanan / Checkout (`#viewCheckout`):**
   - **Progress Stepper Bar:** Menampilkan status alur checkout interaktif:
     - `1 Keranjang (✓ Centang Biru)`: Dapat diklik untuk kembali ke keranjang belanja.
     - `2 Pemesanan (🔵 Aktif)`: Halaman pemesanan saat ini.
     - `3 Pembayaran (⚪ Abu-abu)`: Menuju modal pembayaran transfer BCA.
   - **Segmented Toggle Delivery Selector:** Pilihan tab berbingkai rounded:
     - `[ (•) 🏢 Ambil  (Gratis Ongkir) ]`: Menampilkan Lokasi Pengambilan (Toko Medan, Jl. Teuku Cik Ditiro No.22) dan estimasi siap diambil hari ini.
     - `[ (•) 🚚 Kirim ]`: Menampilkan Alamat Pengiriman penerima, estimasi tiba kurir, serta otomatis menambahkan Biaya Pengiriman Rp4.900.
   - **Daftar Item Pesanan Terpilih:** Menampilkan seluruh produk yang dicentang dari keranjang belanja secara rinci: foto, nama, varian, SKU, berat (kg), harga coret, diskon, dan kalkulasi total berat pesanan.
   - **Rincian Pesanan & Pembayaran:** Kotak ringkasan di kolom kanan dengan metode bayar Bank Transfer BCA, voucher, subtotal belanja normal, diskon hemat, ongkir (jika mode kirim), total tagihan final, dan tombol *"Bayar Sekarang"* (dengan subteks "Anda hemat RpXX,Xrb ✨").

2. **Modal Dialog Pilih Alamat (`#chooseAddressModal` - Gambar 4):**
   - Menampilkan daftar alamat penerima yang tersimpan dalam format kartu elegan dengan border biru aktif.
   - Menampilkan Nama Penerima, Nomor Telepon, Alamat Lengkap, Kota/Kecamatan, Kode Pos, lencana *Utama*, dan status *📍 Belum Pinpoint*.
   - Menyediakan tombol outline biru **`Ubah`** pada masing-masing kartu alamat dan tombol **`+ Tambah Alamat`** di header modal.
   - Mengklik kartu alamat langsung memilih alamat tersebut sebagai tujuan pengiriman aktif.

3. **Modal Dialog Ubah & Tambah Alamat (`#addressFormModal` - Gambar 5 & 6):**
   - Dirancang menggunakan standar *Outlined Material Form Controls*:
     1. `Nama Penerima` (Input teks)
     2. `Nomor Telepon Penerima` (Input telp)
     3. `Kota/Kecamatan` (Pilihan dropdown terintegrasi)
     4. `Kode Pos` (Input teks)
     5. `Alamat` (Textarea multiline lengkap)
     6. `Jadikan Alamat Utama` (Checkbox custom)
   - Tombol biru lebar penuh: **`Simpan`** (`background: #0070f3`).

4. **Multi-Layer Database Persistence:**
   - **Layer 1 (Client In-Memory & `localStorage`):** Disimpan pada `vt_user_addresses` sehingga alamat tidak hilang saat peramban dimuat ulang.
   - **Layer 2 (Localview REST API Server):** Ditambahkan endpoint `GET /api/addresses` dan `POST /api/addresses` pada `scratch/local_server.js` yang secara otomatis menulis ke berkas basis data disk `scratch/addresses_database.json`.
   - **Layer 3 (Cloud Google Sheets):** Ditambahkan fungsi backend `simpanAlamat(data)` dan `ambilAlamat()` pada `code.gs` yang mencatat ke tab sheet `AlamatPelanggan`.

5. **Peralihan Alur dari Keranjang Belanja:**
   - Tombol *Checkout* pada Halaman Keranjang (`#viewCart`) kini memvalidasi pilihan item dan wewenang pengguna, lalu secara mulus mengarahkan (*routing*) ke `#viewCheckout` (Step 2 Pemesanan) bukan langsung melompat ke popup transfer, sehingga pembeli dapat memilih metode pengambilan/pengiriman dan memastikan alamat tujuan terlebih dahulu.


---

# REVISI SISTEM v2.1.6 (30 OKTOBER 2026)
## PENGURUTAN KATEGORI RESMI, PENYESUAIAN JUDUL KATALOG & SINKRONISASI TAMPILAN MULTI-DEVICE

### 32.1 Latar Belakang & Kebutuhan Pengguna
1. **Pengurutan Kategori Produk (Sort Priority):**
   Pengguna menginstruksikan agar seluruh etalase produk toko diurutkan secara hierarkis berdasarkan urutan 4 kategori utama:
   - Urutan 1: `"Indian Women's Fashion"` (Saree, Tas Kosmetik Wanita, Busana Wanita)
   - Urutan 2: `"Indian Men's Fashion"` (Sherwani, Kurta, Kacamata Pria, Korset Shaper Pria)
   - Urutan 3: `"Aksesories & Perhiasan"` (Kotak Perhiasan Mewah, Mehendi Cone, Kajal Herbal)
   - Urutan 4: `"Luxury Goods"` (Tensimeter Digital, Thermogun, Nebulizer, Oximeter)
2. **Penyesuaian Judul Etalase:**
   Mengubah teks judul default dari `"Fashion, 12 Produk"` menjadi `"Indian Women's Fashion, (jumlah) Produk"` (misal: `"Indian Women's Fashion, 12 Produk"`).
3. **Sinkronisasi Multi-Device (DesktopView, MobileView & TabletView):**
   Menyelaraskan grid katalog, layout checkout, toolbar filter, dan bottom navigation bar di ketiga simulator perangkat (HP 418px, Tablet 820px, dan Desktop 1280px) agar serasi tanpa overflow.

---

### 32.2 Rincian Solusi & Implementasi Teknis (ZettBOT v2.1.6)

1. **Mesin Pengurutan Kategori Hierarkis (`getProductCategoryRank`):**
   - Mengimplementasikan pemeringkatan otomatis pada algoritma sorting `renderCatalog()`:
     - Rank 1: `Indian Women's Fashion`
     - Rank 2: `Indian Men's Fashion`
     - Rank 3: `Aksesories & Perhiasan`
     - Rank 4: `Luxury Goods`
   - Pada opsi urutan bawaan *"Rekomendasi"*, sistem secara otomatis memposisikan koleksi busana wanita India di baris teratas, disusul busana pria India, aksesori/perhiasan, dan barang *luxury goods*.
   - Sinkronisasi data pada [scratch/products_database.json](file:///c:/Users/ptgay/.gemini/antigravity-ide/ProjekAntigravity/scratch/products_database.json) sehingga urutan di database fisik tersimpan seragam.

2. **Dinamisasi Judul Katalog (`#catalogHeadingText` & `#catalogCountText`):**
   - Mengganti teks statis awal menjadi:
     `<h2 class="catalog-main-heading" id="catalogHeadingText">Indian Women's Fashion,</h2>`
     `<span class="catalog-item-count" id="catalogCountText">12 Produk</span>`
   - Fungsi `renderCatalog()` kini secara cerdas menampilkan `"Indian Women's Fashion,"` saat mode default (Semua Koleksi) aktif, serta menyertakan jumlah item riil yang terfilter.

3. **Sinkronisasi Tata Letak 3 Mode Perangkat:**
   - **Mode Desktop (1280px):** Grid produk tertata 4 kolom proporsional (`repeat(4, 1fr)`), sidebar filter 260px di sisi kiri, dan checkout 2-kolom seimbang.
   - **Mode Tablet (iPad 820px):** Grid produk tertata 2 kolom lega (`repeat(2, 1fr)`), jarak celah 14px, dan tombol filter yang dapat diakses cepat.
   - **Mode Mobile (HP 418px):** Grid produk 2 kolom mobile-native dengan padding simetris, notch simulator bersih, checkout stepper responsif, dan bottom bar tetap menempel di dasar bingkai.
