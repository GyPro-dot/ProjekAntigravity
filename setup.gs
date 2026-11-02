// Safe guard for Google Apps Script GitHub Assistant
if (typeof Assistant === 'undefined') {
  var Assistant = {};
}

/**
 * ============================================================================
 * PAC (Pink ACcessories) • Butik V&T - Indian Fashion & Accessories
 * File: setup.gs
 * Fungsi: Inisialisasi Database Google Sheets & Safe Migration (Idempoten)
 * ============================================================================
 * Standar Rekayasa Sistem ZettBOT:
 * 1. Idempoten & Safe Migrate: Tidak pernah menggunakan clear() atau menghapus
 *    baris data pengguna yang sudah ada.
 * 2. Menambahkan kolom header baru di posisi paling kanan jika belum ada.
 * 3. Data sampel awal (14 kolom presisi) hanya diisikan jika sheet baru dibuat
 *    dan masih kosong.
 */

function setupDatabase(ssOptional) {
  var ss = ssOptional;
  if (!ss) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {}
  }
  if (!ss && typeof getAppSpreadsheet === "function") {
    ss = getAppSpreadsheet();
  }
  if (!ss) {
    try {
      var props = PropertiesService.getScriptProperties();
      var sheetId = props.getProperty("SPREADSHEET_ID");
      if (sheetId) {
        ss = SpreadsheetApp.openById(sheetId);
      }
    } catch (e) {}
  }
  if (!ss) {
    try {
      ss = SpreadsheetApp.create("Database PAC (Pink ACcessories) • V&T");
      PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", ss.getId());
    } catch (e) {}
  }
  if (!ss) {
    throw new Error("Skrip harus terhubung ke Google Spreadsheet yang aktif!");
  }

  // 1. Inisialisasi Tab DataProduk (14 Kolom Presisi)
  initSheet(ss, "DataProduk", [
    "IdProduk",
    "SkuBarcode",
    "NamaProduk",
    "KategoriUtama",
    "SubKategori",
    "JenisKain",
    "VarianWarna",
    "VarianUkuran",
    "HargaModal",
    "HargaJual",
    "Stok",
    "FotoUrl",
    "Deskripsi",
    "Status"
  ], getSampleProduk());

  // 2. Inisialisasi Tab DataTransaksi (12 Kolom POS Kasir)
  initSheet(ss, "DataTransaksi", [
    "IdTransaksi",
    "Tanggal",
    "NamaKasir",
    "NamaPelanggan",
    "TotalItem",
    "TotalBelanja",
    "Diskon",
    "TotalAkhir",
    "MetodeBayar",
    "JumlahBayar",
    "Kembalian",
    "Catatan"
  ], []);

  // 3. Inisialisasi Tab DetailTransaksi (10 Kolom Rincian Item POS)
  initSheet(ss, "DetailTransaksi", [
    "IdDetail",
    "IdTransaksi",
    "IdProduk",
    "NamaProduk",
    "VarianDipilih",
    "HargaSatuan",
    "Jumlah",
    "Subtotal",
    "HargaModalSatuan",
    "LabaKotor"
  ], []);

  // 4. Inisialisasi Tab PESANAN (12 Kolom E-Commerce Checkout)
  initSheet(ss, "PESANAN", [
    "NoPesanan",
    "TanggalWaktu",
    "NamaPelanggan",
    "NoWhatsApp",
    "AlamatCatatan",
    "RincianItem",
    "TotalItem",
    "TotalBelanja",
    "MetodeBayar",
    "StatusBayar",
    "StatusOrder",
    "Petugas"
  ], getSamplePesanan());

  // 5. Inisialisasi Tab DataPengguna (7 Kolom RBAC Petugas & Admin)
  initSheet(ss, "DataPengguna", [
    "IdPengguna",
    "Nama",
    "LevelRole",
    "Email",
    "NoWhatsApp",
    "PinAkses",
    "Status"
  ], getSamplePengguna());

  // 6. Inisialisasi Tab AlamatPelanggan (8 Kolom Buku Alamat)
  initSheet(ss, "AlamatPelanggan", [
    "IdAlamat",
    "NamaPenerima",
    "NoTelepon",
    "KotaKecamatan",
    "KodePos",
    "AlamatLengkap",
    "IsUtama",
    "Tanggal"
  ], getSampleAlamat());

  // 7. Inisialisasi Tab PengaturanToko (2 Kolom Konfigurasi)
  initSheet(ss, "PengaturanToko", [
    "Kunci",
    "Nilai"
  ], getSamplePengaturan());

  SpreadsheetApp.flush();
  Logger.log("Inisialisasi Database PAC Indian Fashion & Accessories Berhasil Sempurna!");
  return "Database berhasil diinisialisasi dengan Safe Migrate!";
}

/**
 * Helper Safe Migration untuk Inisialisasi Sheet Idempoten (Non-Destruktif)
 */
function initSheet(ss, sheetName, expectedHeaders, sampleData) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();

  if (lastRow === 0 || lastCol === 0) {
    // Sheet baru dan kosong: pasang seluruh header dan data sampel awal
    sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
    formatHeaderRow(sheet, expectedHeaders.length);

    if (sampleData && sampleData.length > 0) {
      sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
    }
  } else {
    // Sheet sudah berisi data: DILARANG menggunakan clear(), cukup tambahkan header baru di kanan
    var existingHeaders = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
    for (var i = 0; i < expectedHeaders.length; i++) {
      var headerName = expectedHeaders[i];
      if (existingHeaders.indexOf(headerName) === -1) {
        lastCol++;
        sheet.getRange(1, lastCol).setValue(headerName);
        Logger.log("Safe Migration: Menambahkan kolom baru '" + headerName + "' pada tab " + sheetName);
      }
    }
    formatHeaderRow(sheet, sheet.getLastColumn());
  }
}

/**
 * Format Styling Baris Header Spreadsheet
 */
function formatHeaderRow(sheet, colCount) {
  var headerRange = sheet.getRange(1, 1, 1, colCount);
  headerRange.setBackground("#c2185b");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}

/**
 * Daftar Akun Resmi Toko PAC (Hierarki Hak Akses RBAC)
 */
function getSamplePengguna() {
  return [
    ["USR-001", "PINKY", "SUPER_ADMIN", "pinky@pinkaccessories.com", "6281234567891", "1234", "Aktif"],
    ["USR-002", "VICKY", "ADMIN", "vicky@pinkaccessories.com", "6281234567892", "1234", "Aktif"],
    ["USR-003", "TISH", "ADMIN", "tish@pinkaccessories.com", "6281234567893", "1234", "Aktif"],
    ["USR-004", "WIDYA", "OPERATOR", "widya@pinkaccessories.com", "6281234567894", "1234", "Aktif"],
    ["USR-005", "MILA", "OPERATOR", "mila@pinkaccessories.com", "6281234567895", "1234", "Aktif"],
    ["USR-006", "ROSSI", "OPERATOR", "rossi@pinkaccessories.com", "6281234567896", "1234", "Aktif"]
  ];
}

/**
 * Sampel Master Produk Busana & Aksesoris India PAC (Presisi 14 Kolom)
 */
function getSampleProduk() {
  var baseCdn = "https://cdn.jsdelivr.net/gh/GyPro-dot/ProjekAntigravity@main/assets/";
  return [
    [
      "PRD-001",
      "7CAD1TBK",
      "TaffOmicron Tensimeter Digital Pengukur Tekanan Darah Indonesian Voice",
      "All Accesories and Luxury Goods",
      "Tensimeter Digital",
      "Digital Sensor",
      "Black, White",
      "All Size Arm Cuff",
      42000,
      69500,
      24,
      baseCdn + "card1_website.jpg",
      "Tensimeter digital otomatis dengan panduan suara Bahasa Indonesia dan layar LCD jelas.",
      "Aktif"
    ],
    [
      "PRD-002",
      "7CSE2PUR",
      "TaffOmicron Termometer Suhu Badan Digital Thermogun Infrared Non-Contact",
      "All Accesories and Luxury Goods",
      "Thermogun Infrared",
      "Infrared Optical",
      "Purple, White",
      "Standard Handheld",
      18000,
      31300,
      18,
      baseCdn + "card2_gelang.jpg",
      "Termometer inframerah tanpa sentuh dengan sensor presisi tinggi dan layar LED.",
      "Aktif"
    ],
    [
      "PRD-003",
      "7CNEB3WHT",
      "TaffOmicron Alat Terapi Pernapasan Mesh Nebulizer Portable Inhaler",
      "All Accesories and Luxury Goods",
      "Nebulizer Portable",
      "Medical Grade Mesh",
      "White",
      "Portable Pocket",
      16000,
      27200,
      32,
      baseCdn + "card3_kurta.jpg",
      "Alat terapi pernapasan portable ultrasonic mesh nebulizer yang hening dan praktis.",
      "Aktif"
    ],
    [
      "PRD-004",
      "7COXI4WHT",
      "Oximeter Alat Ukur Saturasi Oksigen Darah Pulse Fingertip SpO2",
      "All Accesories and Luxury Goods",
      "Oximeter Saturasi",
      "Optical Sensor",
      "White, Blue",
      "Fingertip",
      65000,
      105800,
      15,
      baseCdn + "card4_dress.jpg",
      "Fingertip pulse oximeter pengukur saturasi oksigen SpO2 dan detak jantung akurat.",
      "Aktif"
    ],
    [
      "PRD-005",
      "7CSE2TBK",
      "Ilfioreemio Baju T-Shirt Korset Pembentuk Tubuh Body Shaper L - YS107",
      "Indian Man Fashion",
      "Korset & Shaper",
      "Elastic Spandex Mesh",
      "Black, White",
      "M, L, XL",
      38000,
      63600,
      20,
      baseCdn + "detail_corset_main.jpg",
      "Baju kaos korset pembentuk tubuh pria berbahan spandex bernapas yang nyaman dipakai harian.",
      "Aktif"
    ],
    [
      "PRD-006",
      "SKU-TAS-006",
      "Biutteco Tas Kosmetik Make Up Travel Organizer Bag Wanita X3235",
      "All Accesories and Luxury Goods",
      "Tas Kosmetik",
      "Waterproof Oxford & Satin",
      "Pink, Rose Gold, Black",
      "Medium Travel",
      28000,
      45000,
      4,
      baseCdn + "biutteco-tas-kosmetik-make-up-travel-organizer-bag-wanita-x3235.jpg",
      "Tas kosmetik travel organizer tahan air dengan sekat fleksibel untuk peralatan make up.",
      "Aktif"
    ],
    [
      "PRD-007",
      "SKU-GLS-007",
      "Samjune Kacamata Pria Polarized Sunglasses Anti-Reflective UV400",
      "Indian Man Fashion",
      "Kacamata Polarized",
      "Polarized UV400 Metal Frame",
      "Black Metallic, Gold",
      "Standard All Size",
      22000,
      38500,
      22,
      baseCdn + "samjune-kacamata-pria-polarized-sunglasses-anti-reflective-uv400-j-198.jpg",
      "Kacamata hitam polarized pelindung sinar UV400 dengan bingkai metal maskulin.",
      "Aktif"
    ],
    [
      "PRD-008",
      "SKU-BOX-008",
      "Kotak Kosmetik Organizer Perhiasan & Aksesoris Mewah",
      "All Accesories and Luxury Goods",
      "Kotak Perhiasan",
      "Beludru Velvet & Leatherette",
      "Royal Maroon Gold, Emerald",
      "Large Multi-Tier",
      52000,
      85000,
      14,
      baseCdn + "Kotak_Kosmetik_(3).jpg",
      "Kotak penyimpanan perhiasan India, cincin, anting jhumka, dan kalung berlapis beludru lembut.",
      "Aktif"
    ],
    [
      "PRD-009",
      "SKU-SAR-009",
      "Banarasi Silk Saree Royal Maroon Gold Zari",
      "Indian Woman Fashion",
      "Saree",
      "Sutra (Banarasi Silk)",
      "Maroon, Gold, Navy",
      "Free Size (5.5m + Blouse)",
      450000,
      750000,
      12,
      baseCdn + "card4_dress.jpg",
      "Saree sutra Banarasi kerajaan India dengan tenunan benang emas zari mewah untuk pesta dan pernikahan.",
      "Aktif"
    ],
    [
      "PRD-010",
      "SKU-SHR-010",
      "Royal Maharaja Sherwani Brokat Gold & Kurta Pajama Set",
      "Indian Man Fashion",
      "Sherwani",
      "Brokat Emas Mewah",
      "Champagne Gold, Maroon",
      "L, XL, XXL",
      750000,
      1350000,
      8,
      baseCdn + "card3_kurta.jpg",
      "Setelan jas pengantin pria Maharaja Sherwani berbahan brokat sulam emas lengkap dengan celana churidar.",
      "Aktif"
    ],
    [
      "PRD-011",
      "SKU-SAR-013",
      "Saree Pink1",
      "Indian Woman Fashion",
      "Saree",
      "Sutra (Silk)",
      "Pink, Gold",
      "Free Size",
      350000,
      550000,
      12,
      baseCdn + "detail_thumb_2.jpg",
      "Koleksi Saree Pink1 eksklusif dengan sentuhan warna pink anggun dan sulaman emas mewah khas India.",
      "Aktif"
    ],
    [
      "PRD-012",
      "SKU-KUR-014",
      "Jazz Woll",
      "Indian Man Fashion",
      "Kurta",
      "Wool & Cotton Blend",
      "Navy, Charcoal, Grey",
      "M, L, XL",
      280000,
      450000,
      15,
      baseCdn + "detail_thumb_3.jpg",
      "Setelan Kurta Jazz Woll pria dengan bahan wol premium yang nyaman, elegan, dan berkelas untuk berbagai acara pesta.",
      "Aktif"
    ],
    [
      "PRD-013",
      "SKU-JEW-015",
      "Diamond TISH",
      "All Accesories and Luxury Goods",
      "Kotak Perhiasan",
      "Gold Plated & Zircon Diamond",
      "Sparkling Diamond Gold",
      "All Size Luxury",
      500000,
      850000,
      10,
      baseCdn + "Kotak_Kosmetik_(3).jpg",
      "Koleksi perhiasan eksklusif edisi Diamond TISH dengan kilau permata zirkon premium berbalut emas murni.",
      "Aktif"
    ],
    [
      "PRD-014",
      "SKU-MHN-014",
      "Mehendi Rajasthani Cone & Innai Herbal Rambut Alami",
      "All Accesories and Luxury Goods",
      "Mehendi & Innai",
      "Herbal Organik",
      "Natural Dark Maroon, Herbal Black",
      "Paket Box (6 Cone + 1 Pack Henna)",
      32000,
      65000,
      45,
      "https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?auto=format&fit=crop&w=600&q=80",
      "Mehendi kerucut Rajasthani asli dan bubuk innai herbal alami untuk tata rias tangan, kaki, dan pewarna rambut berkilau.",
      "Aktif"
    ],
    [
      "PRD-015",
      "SKU-KAJ-015",
      "Kajal Ayurvedic Kohl Herbal (Pensil Pewarna Mata India)",
      "All Accesories and Luxury Goods",
      "Kajal & Rias Mata",
      "Ayurvedic Herbal Ekstrak Almond & Castor Oil",
      "Deep Jet Black",
      "Standard Pencil 3g",
      25000,
      48000,
      38,
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      "Kajal herbal khas India berbahan alami minyak almond organik untuk riasan mata hitam pekat dramatis yang sejuk dan menyehatkan mata.",
      "Aktif"
    ]
  ];
}

/**
 * Sampel Data Pesanan Awal
 */
function getSamplePesanan() {
  var nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
  return [
    [
      "ORD-20261029-0001",
      nowStr,
      "Gaya Murty",
      "081265167092",
      "Jl. Jenggala No.71, Kel. Madras Hulu, Medan Polonia - 20152",
      "Banarasi Silk Saree Royal Maroon Gold Zari (SKU-SAR-009) x1 @Rp 750.000",
      1,
      750000,
      "Transfer Bank BCA (Ac. 0223142807 a/n Vicky Gaya Galani)",
      "Lunas",
      "DIPROSES",
      "PINKY"
    ]
  ];
}

/**
 * Sampel Alamat Pelanggan Awal
 */
function getSampleAlamat() {
  var nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
  return [
    [
      "ADDR-001",
      "GAYA MURTY",
      "081265167092",
      "Sumatera Utara, Medan, Medan Polonia",
      "20152",
      "Jl. Jenggala No.71, Kel. Madras Hulu",
      "TRUE",
      nowStr
    ]
  ];
}

/**
 * Sampel Konfigurasi Toko PAC
 */
function getSamplePengaturan() {
  return [
    ["NamaToko", "PAC (Pink ACcessories) • V&T - Indian Fashion & Accessories"],
    ["Tagline", "Exclusive Indian Saree, Kurti, Lehenga & Bridal Accessories"],
    ["NoWhatsApp", "6281265167092"],
    ["EmailToko", "hritishgaya@gmail.com"],
    ["Alamat", "THE PAC Boutique • V&T, Jl. Teuku Cik Ditiro No. 22, Medan, Indonesia"],
    ["JamOperasional", "Senin - Minggu: 10:30 - 21:00 WIB (Hari Besar: Libur)"],
    ["PinKasir", "1234"],
    ["PesanNota", "Dhanyavad! Terima kasih telah berbelanja busana India di PAC. Barang yang sudah dibeli dapat ditukar dalam 3 hari dengan faktur invoice resmi."],
    ["InfoRekening", "BCA: 0223142807 a.n Vicky Gaya Galani | QRIS Toko Tersedia"]
  ];
}