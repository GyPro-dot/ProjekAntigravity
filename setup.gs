/**
 * ============================================================================
 * PAC (Pink ACcessories) - Indian Fashion & Accessories
 * File: setup.gs
 * Fungsi: Inisialisasi Database Google Sheets & Safe Migration (Idempoten)
 * ============================================================================
 * Aturan Rekayasa Sistem ZettBOT:
 * 1. DILARANG menggunakan karakter underscore (_) pada nama sheet.
 * 2. Idempoten & Safe Migrate: Tidak menghapus atau menimpa data riil pengguna.
 * 3. Menambahkan header baru di posisi paling kanan jika belum ada.
 * 4. Data contoh hanya diisikan jika sheet dalam kondisi kosong baru dibuat.
 */

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("Skrip harus dijalankan dari Google Spreadsheet yang aktif!");
  }

  // 1. Inisialisasi Tab DataProduk (Lengkap dengan Departemen & Jenis Kain)
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

  // 2. Inisialisasi Tab DataTransaksi
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

  // 3. Inisialisasi Tab DetailTransaksi
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

  // 4. Inisialisasi Tab PengaturanToko
  initSheet(ss, "PengaturanToko", [
    "Kunci",
    "Nilai"
  ], getSamplePengaturan());

  // 5. Inisialisasi Tab DataPengguna (Hierarki Hak Akses & Database OTP)
  initSheet(ss, "DataPengguna", [
    "IdPengguna",
    "Nama",
    "LevelRole",
    "Email",
    "NoWhatsApp",
    "PinAkses",
    "Status"
  ], getSamplePengguna());

  Logger.log("✅ Inisialisasi Database PAC Indian Fashion & Accessories Berhasil Sempurna!");
  return "Database berhasil diinisialisasi!";
}

/**
 * Daftar Akun Resmi Toko PAC (Hierarki Hak Akses RBAC)
 */
function getSamplePengguna() {
  return [
    ["USR-001", "PINKY", "SUPER_ADMIN", "pinky@pinkaccessories.com", "6281234567891", "1234", "Aktif"],
    ["USR-003", "VICKY", "ADMIN1", "vicky@pinkaccessories.com", "6281234567892", "1234", "Aktif"],
    ["USR-004", "TISH", "ADMIN2", "tish@pinkaccessories.com", "6281234567893", "1234", "Aktif"],
    ["USR-005", "WIDYA", "OPERATOR1", "widya@pinkaccessories.com", "6281234567894", "1234", "Aktif"],
    ["USR-006", "MILA", "OPERATOR2", "mila@pinkaccessories.com", "6281234567895", "1234", "Aktif"],
    ["USR-007", "ROSSI", "OPERATOR3", "rossi@pinkaccessories.com", "6281234567896", "1234", "Aktif"]
  ];
}

/**
 * Helper Safe Migration untuk Inisialisasi Sheet Idempoten
 */
function initSheet(ss, sheetName, expectedHeaders, sampleData) {
  var sheet = ss.getSheetByName(sheetName);
  var isNewSheet = false;

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    isNewSheet = true;
  }

  // Cek apakah sheet benar-benar kosong
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();

  if (lastRow === 0 || lastCol === 0) {
    // Sheet kosong baru: pasang seluruh header
    sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
    formatHeaderRow(sheet, expectedHeaders.length);

    // Pasang sample data awal jika ada
    if (sampleData && sampleData.length > 0) {
      sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
    }
  } else {
    // Sheet sudah ada: Jalankan Safe Migration untuk header
    var existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    // Cari kolom yang belum ada dan tambahkan di ujung kanan
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
 * Format Styling Baris Header Spreadsheet agar rapi dan profesional
 */
function formatHeaderRow(sheet, colCount) {
  var headerRange = sheet.getRange(1, 1, 1, colCount);
  headerRange.setBackground("#c2185b"); // Warna khas PAC Magenta
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}

/**
 * Sampel Master Produk Busana & Aksesoris India PAC
 */
function getSampleProduk() {
  return [
    [
      "PRD-001",
      "SKU-PAC-001",
      "Banarasi Silk Saree Royal Maroon Gold",
      "Saree",
      "Maroon, Gold, Navy",
      "Free Size",
      450000,
      750000,
      12,
      "https://lh3.googleusercontent.com/d/1W-GcCiqlNATFnx3r2GHn-pXRtrtUOL_S",
      "Saree sutra Banarasi premium dengan tenunan benang zari emas asli, motif floral klasik India.",
      "Aktif"
    ],
    [
      "PRD-002",
      "SKU-PAC-002",
      "Anarkali Kurti Festive Plum Embroidery",
      "Kurti",
      "Plum, Rose Pink, Teal",
      "M, L, XL",
      280000,
      485000,
      18,
      "https://lh3.googleusercontent.com/d/1lExKo17eKjRzTRZYvVILhnhWO1sDc-kV",
      "Setelan Kurti Anarkali anggun dengan sulaman payet tangan khas Jaipur dan selendang senada.",
      "Aktif"
    ],
    [
      "PRD-003",
      "SKU-PAC-003",
      "Bridal Lehenga Choli Champagne Floral",
      "Lehenga",
      "Champagne, Peach, Ivory",
      "All Size (Tali Serut)",
      850000,
      1450000,
      8,
      "https://lh3.googleusercontent.com/d/1W-GcCiqlNATFnx3r2GHn-pXRtrtUOL_S",
      "Gaun pengantin Lehenga pesta mewah berbordir bunga timbul kristal swarovski lengkap dengan dupatta.",
      "Aktif"
    ],
    [
      "PRD-004",
      "SKU-PAC-004",
      "Traditional Indian Chuda Bangles Set",
      "Perhiasan & Gelang",
      "Red & Gold, Pink & Silver",
      "Size 2.4, 2.6, 2.8",
      120000,
      225000,
      25,
      "https://lh3.googleusercontent.com/d/1Xl58ZHlX-N0kxsRoFhZ49wohuNHt5Io5",
      "Set gelang pengantin Chuda tradisional India berhias permata berkilau dan latkan gantung.",
      "Aktif"
    ],
    [
      "PRD-005",
      "SKU-PAC-005",
      "Kundan Bridal Choker Necklace Set",
      "Perhiasan & Gelang",
      "Gold Green, Gold Ruby",
      "All Size",
      350000,
      590000,
      10,
      "https://lh3.googleusercontent.com/d/1MM1GkU9KgBxQZggZ3hKtLnWOR3hWzPn4",
      "Set kalung choker batu Kundan kerajaan India lengkap dengan anting jhumka dan maang tikka dahi.",
      "Aktif"
    ],
    [
      "PRD-006",
      "SKU-PAC-006",
      "Net Embroidered Dupatta Gold Border",
      "Dupatta",
      "Golden Yellow, Maroon, Fuchsia",
      "Panjang 2.5 Meter",
      95000,
      175000,
      30,
      "https://lh3.googleusercontent.com/d/1gHVcy2fnnUPSnxbnHG50vGqp3YQhGHMM",
      "Selendang Dupatta bahan jaring lembut dengan pinggiran renda kiran emas mewah untuk pelengkap busana pesta.",
      "Aktif"
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
    ["NoWhatsApp", "628116072491"],
    ["EmailToko", "hritishgayagalani99@gmail.com"],
    ["Alamat", "THE PAC Boutique • V&T, Jl. Teuku Cik Ditiro No. 22, Medan, Indonesia"],
    ["JamOperasional", "Senin - Jumat: 10:30 - 21:00 WIB, Sabtu - Minggu: 10:30 - 21:00 WIB (Hari Besar: Libur)"],
    ["PinKasir", "1234"],
    ["PesanNota", "Dhanyavad! Terima kasih telah berbelanja busana India di PAC. Barang yang sudah dibeli dapat ditukar dalam 3 hari dengan faktur invoice resmi."],
    ["InfoRekening", "BCA: 0223142807 a.n Vicky Gaya Galani | QRIS Toko Tersedia"]
  ];
}
