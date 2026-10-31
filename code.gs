// Safe guard for Google Apps Script GitHub Assistant
if (typeof Assistant === 'undefined') {
  var Assistant = {};
}

/**
 * ============================================================================
 * PAC (Pink ACcessories) - Indian Fashion & Accessories
 * File: code.gs
 * Fungsi: Backend Controller API & Web App Router (Google Apps Script)
 * ============================================================================
 * Standar Rekayasa ZettBOT:
 * 1. Index-Based Column Mapping (Kebal terhadap perubahan teks label header)
 * 2. Sequential Incremental Unique ID Generator (TRX-YYYYMM-XXX) dengan LockService
 * 3. Sanitasi Input & Operasi Basis Data Non-Destruktif
 * 4. Safe Concurrency saat Transaksi Multi-Perangkat
 */

// ----------------------------------------------------------------------------
// 1. DEFINISI KONSTANTA PEMETAAN INDEKS KOLOM (INDEX-BASED MAPPING)
// ----------------------------------------------------------------------------
const COL_PRODUK = {
  ID: 0,             // Kolom A: IdProduk
  SKU: 1,            // Kolom B: SkuBarcode
  NAMA: 2,           // Kolom C: NamaProduk
  KATEGORI_UTAMA: 3, // Kolom D: KategoriUtama (Wanita/Pria/Aksesoris/Wedding)
  KATEGORI: 3,       // Kolom D: Kategori (Alias)
  SUB_KATEGORI: 4,   // Kolom E: SubKategori (Saree/Kurta/Sherwani/Anting/dll)
  JENIS_KAIN: 5,     // Kolom F: JenisKain (Sutra/Brokat/Chiffon/dll)
  WARNA: 6,          // Kolom G: VarianWarna
  UKURAN: 7,         // Kolom H: VarianUkuran
  MODAL: 8,          // Kolom I: HargaModal
  JUAL: 9,           // Kolom J: HargaJual
  STOK: 10,          // Kolom K: Stok
  FOTO: 11,          // Kolom L: FotoUrl
  DESKRIPSI: 12,     // Kolom M: Deskripsi
  STATUS: 13         // Kolom N: Status ("Aktif" / "Nonaktif")
};

const COL_USER = {
  ID: 0,             // Kolom A: IdPengguna
  NAMA: 1,           // Kolom B: Nama
  ROLE: 2,           // Kolom C: LevelRole (SUPER_ADMIN, ADMIN, OPERATOR)
  EMAIL: 3,          // Kolom D: Email
  WHATSAPP: 4,       // Kolom E: NoWhatsApp
  PIN: 5,            // Kolom F: PinAkses
  STATUS: 6          // Kolom G: Status
};

const COL_TRX = {
  ID: 0,          // Kolom A: IdTransaksi
  TANGGAL: 1,     // Kolom B: Tanggal
  KASIR: 2,       // Kolom C: NamaKasir
  PELANGGAN: 3,   // Kolom D: NamaPelanggan
  TOTAL_ITEM: 4,  // Kolom E: TotalItem
  TOTAL_BELANJA: 5,// Kolom F: TotalBelanja
  DISKON: 6,      // Kolom G: Diskon
  TOTAL_AKHIR: 7, // Kolom H: TotalAkhir
  METODE: 8,      // Kolom I: MetodeBayar
  BAYAR: 9,       // Kolom J: JumlahBayar
  KEMBALIAN: 10,  // Kolom K: Kembalian
  CATATAN: 11     // Kolom L: Catatan
};

const COL_DTL = {
  ID_DETAIL: 0,   // Kolom A: IdDetail
  ID_TRX: 1,      // Kolom B: IdTransaksi
  ID_PRODUK: 2,   // Kolom C: IdProduk
  NAMA: 3,        // Kolom D: NamaProduk
  VARIAN: 4,      // Kolom E: VarianDipilih
  HARGA_SATUAN: 5,// Kolom F: HargaSatuan
  JUMLAH: 6,      // Kolom G: Jumlah
  SUBTOTAL: 7,    // Kolom H: Subtotal
  MODAL_SATUAN: 8,// Kolom I: HargaModalSatuan
  LABA: 9         // Kolom J: LabaKotor
};

// ----------------------------------------------------------------------------
// 2. ENTRY POINT WEB APP (doGet)
// ----------------------------------------------------------------------------
function doGet(e) {
  var template = HtmlService.createTemplateFromFile("index");
  return template.evaluate()
    .setTitle("PAC Indian Fashion & Accessories")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ----------------------------------------------------------------------------
// 3. API INITIAL DATA (MASTER PRODUCTS, CATEGORIES, SETTINGS)
// ----------------------------------------------------------------------------
function getInitData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };

    // Baca Produk
    var sheetProduk = ss.getSheetByName("DataProduk");
    var listProduk = [];
    var setKategori = {};

    if (sheetProduk && sheetProduk.getLastRow() > 1) {
      var rowsProduk = sheetProduk.getRange(2, 1, sheetProduk.getLastRow() - 1, sheetProduk.getLastColumn()).getValues();
      for (var i = 0; i < rowsProduk.length; i++) {
        var r = rowsProduk[i];
        var status = r[COL_PRODUK.STATUS] ? String(r[COL_PRODUK.STATUS]).trim() : "Aktif";
        if (status === "Aktif" || status === "") {
          var rawFoto = String(r[COL_PRODUK.FOTO] || "").trim();
          var fotoFinal = rawFoto;
          if (!fotoFinal || fotoFinal.indexOf("googleusercontent.com") !== -1 || fotoFinal.indexOf("drive.google.com") !== -1) {
            fotoFinal = "https://cdn.jsdelivr.net/gh/GyPro-dot/ProjekAntigravity@main/assets/card1_website.jpg";
          } else if (fotoFinal.indexOf("assets/") === 0) {
            fotoFinal = "https://cdn.jsdelivr.net/gh/GyPro-dot/ProjekAntigravity@main/" + fotoFinal;
          }

          var p = {
            id: String(r[COL_PRODUK.ID] || ""),
            sku: String(r[COL_PRODUK.SKU] || ""),
            nama: String(r[COL_PRODUK.NAMA] || ""),
            kategori: String(r[COL_PRODUK.KATEGORI_UTAMA] || "Wanita"),
            kategoriUtama: String(r[COL_PRODUK.KATEGORI_UTAMA] || "Wanita"),
            subKategori: String(r[COL_PRODUK.SUB_KATEGORI] || "Koleksi Fashion"),
            jenisKain: String(r[COL_PRODUK.JENIS_KAIN] || "Premium Quality"),
            warna: String(r[COL_PRODUK.WARNA] || ""),
            ukuran: String(r[COL_PRODUK.UKURAN] || ""),
            hargaModal: Number(r[COL_PRODUK.MODAL]) || 0,
            hargaJual: Number(r[COL_PRODUK.JUAL]) || 0,
            stok: Number(r[COL_PRODUK.STOK]) || 0,
            fotoUrl: fotoFinal,
            deskripsi: String(r[COL_PRODUK.DESKRIPSI] || ""),
            status: status
          };
          listProduk.push(p);
          if (p.kategori) setKategori[p.kategori] = true;
        }
      }
    }

    // Baca Pengaturan Toko
    var sheetPengaturan = ss.getSheetByName("PengaturanToko");
    var settings = {};
    if (sheetPengaturan && sheetPengaturan.getLastRow() > 1) {
      var rowsSet = sheetPengaturan.getRange(2, 1, sheetPengaturan.getLastRow() - 1, 2).getValues();
      for (var j = 0; j < rowsSet.length; j++) {
        var k = String(rowsSet[j][0]).trim();
        var v = String(rowsSet[j][1]).trim();
        if (k) settings[k] = v;
      }
    }

    // Default jika belum diset di sheet
    if (!settings.NamaToko) settings.NamaToko = "PAC (Pink ACcessories) • V&T";
    if (!settings.NoWhatsApp) settings.NoWhatsApp = "628116072491";
    if (!settings.PinKasir) settings.PinKasir = "1234";

    // Baca Riwayat Transaksi Terakhir (Maksimal 30 data terbaru)
    var sheetTrx = ss.getSheetByName("DataTransaksi");
    var listTrx = [];
    if (sheetTrx && sheetTrx.getLastRow() > 1) {
      var totalTrxRows = sheetTrx.getLastRow() - 1;
      var takeRows = Math.min(totalTrxRows, 30);
      var startRow = 2 + (totalTrxRows - takeRows);
      var rowsTrx = sheetTrx.getRange(startRow, 1, takeRows, sheetTrx.getLastColumn()).getValues();
      
      for (var t = rowsTrx.length - 1; t >= 0; t--) {
        var tr = rowsTrx[t];
        listTrx.push({
          id: String(tr[COL_TRX.ID] || ""),
          tanggal: String(tr[COL_TRX.TANGGAL] || ""),
          kasir: String(tr[COL_TRX.KASIR] || ""),
          pelanggan: String(tr[COL_TRX.PELANGGAN] || ""),
          totalItem: Number(tr[COL_TRX.TOTAL_ITEM]) || 0,
          totalBelanja: Number(tr[COL_TRX.TOTAL_BELANJA]) || 0,
          diskon: Number(tr[COL_TRX.DISKON]) || 0,
          totalAkhir: Number(tr[COL_TRX.TOTAL_AKHIR]) || 0,
          metode: String(tr[COL_TRX.METODE] || "Tunai"),
          bayar: Number(tr[COL_TRX.BAYAR]) || 0,
          kembalian: Number(tr[COL_TRX.KEMBALIAN]) || 0,
          catatan: String(tr[COL_TRX.CATATAN] || "")
        });
      }
    }

    return {
      success: true,
      produk: listProduk,
      listProduk: listProduk,
      kategori: Object.keys(setKategori),
      pengaturan: settings,
      transaksiTerakhir: listTrx
    };
  } catch (err) {
    Logger.log("Error getInitData: " + err.toString());
    return { success: false, message: err.toString() };
  }
}

// ----------------------------------------------------------------------------
// 4. API SIMPAN TRANSAKSI KASIR (ANTI-COLLISION INCREMENTAL ID & AUTO-STOCK)
// ----------------------------------------------------------------------------
function simpanTransaksi(payload) {
  var lock = LockService.getScriptLock();
  try {
    // Kunci proses maksimal 20 detik untuk multi-user safety
    lock.waitLock(20000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetProduk = ss.getSheetByName("DataProduk");
    var sheetTrx = ss.getSheetByName("DataTransaksi");
    var sheetDtl = ss.getSheetByName("DetailTransaksi");

    if (!sheetProduk || !sheetTrx || !sheetDtl) {
      return { success: false, message: "Struktur sheet tidak lengkap. Jalankan setupDatabase terlebih dahulu." };
    }

    var items = payload.items || [];
    if (items.length === 0) {
      return { success: false, message: "Keranjang kasir kosong." };
    }

    // 1. Validasi & Pengurangan Stok di DataProduk
    var produkDataRange = sheetProduk.getRange(2, 1, sheetProduk.getLastRow() - 1, sheetProduk.getLastColumn());
    var produkValues = produkDataRange.getValues();
    var idToRowMap = {};

    for (var r = 0; r < produkValues.length; r++) {
      var prodId = String(produkValues[r][COL_PRODUK.ID]).trim();
      idToRowMap[prodId] = r; // Index di dalam array produkValues
    }

    // Cek ketersediaan stok terlebih dahulu
    for (var i = 0; i < items.length; i++) {
      var itm = items[i];
      var rowIndex = idToRowMap[itm.idProduk];
      if (rowIndex !== undefined) {
        var currentStock = Number(produkValues[rowIndex][COL_PRODUK.STOK]) || 0;
        if (currentStock < itm.qty) {
          return {
            success: false,
            message: "Stok produk '" + itm.nama + "' tidak mencukupi! Sisa stok: " + currentStock
          };
        }
      }
    }

    // Generate Nomor Transaksi Sekuensial TRX-YYYYMM-XXX
    var now = new Date();
    var year = now.getFullYear();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var dateFormatted = Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd HH:mm:ss");
    var prefix = "TRX-" + year + month + "-";

    var maxNum = 0;
    if (sheetTrx.getLastRow() > 1) {
      var existingIds = sheetTrx.getRange(2, 1, sheetTrx.getLastRow() - 1, 1).getValues();
      for (var k = 0; k < existingIds.length; k++) {
        var curId = String(existingIds[k][0]).trim();
        if (curId.indexOf(prefix) === 0) {
          var numPart = parseInt(curId.substring(prefix.length), 10);
          if (!isNaN(numPart) && numPart > maxNum) {
            maxNum = numPart;
          }
        }
      }
    }
    var nextTrxId = prefix + ("000" + (maxNum + 1)).slice(-3);

    // 2. Terapkan Pengurangan Stok Fisik
    for (var j = 0; j < items.length; j++) {
      var itmP = items[j];
      var rowIdx = idToRowMap[itmP.idProduk];
      if (rowIdx !== undefined) {
        var curStok = Number(produkValues[rowIdx][COL_PRODUK.STOK]) || 0;
        produkValues[rowIdx][COL_PRODUK.STOK] = Math.max(0, curStok - itmP.qty);
      }
    }
    produkDataRange.setValues(produkValues);

    // 3. Simpan Kepala Transaksi di DataTransaksi
    var totalItem = 0;
    for (var m = 0; m < items.length; m++) totalItem += items[m].qty;

    var rowTrx = [
      nextTrxId,
      dateFormatted,
      payload.kasir || "Kasir PAC",
      payload.pelanggan || "Umum",
      totalItem,
      payload.totalBelanja || 0,
      payload.diskon || 0,
      payload.totalAkhir || 0,
      payload.metode || "Tunai",
      payload.bayar || 0,
      payload.kembalian || 0,
      payload.catatan || ""
    ];
    sheetTrx.appendRow(rowTrx);

    // 4. Simpan Rincian Detail di DetailTransaksi
    var detailRows = [];
    for (var d = 0; d < items.length; d++) {
      var it = items[d];
      var detailId = "DTL-" + year + month + "-" + ("0000" + (d + 1)).slice(-4) + Math.floor(Math.random() * 90 + 10);
      var sub = Number(it.hargaSatuan) * Number(it.qty);
      var modalSat = Number(it.hargaModal) || 0;
      var labaKotor = sub - (modalSat * Number(it.qty));

      detailRows.push([
        detailId,
        nextTrxId,
        it.idProduk || "",
        it.nama || "",
        it.varian || "-",
        it.hargaSatuan || 0,
        it.qty || 1,
        sub,
        modalSat,
        labaKotor
      ]);
    }

    if (detailRows.length > 0) {
      sheetDtl.getRange(sheetDtl.getLastRow() + 1, 1, detailRows.length, detailRows[0].length).setValues(detailRows);
    }

    return {
      success: true,
      trxId: nextTrxId,
      tanggal: dateFormatted,
      totalAkhir: payload.totalAkhir,
      kembalian: payload.kembalian,
      message: "Transaksi " + nextTrxId + " berhasil disimpan!"
    };

  } catch (err) {
    Logger.log("Error simpanTransaksi: " + err.toString());
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ----------------------------------------------------------------------------
// 5. API MANAJEMEN PRODUK (TAMBAH / EDIT / RESTOCK)
// ----------------------------------------------------------------------------
function simpanProduk(data) {
  try {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
    } catch (lockErr) {
      Logger.log("Lock wait notice: " + lockErr.toString());
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };
    var sheet = ss.getSheetByName("DataProduk") || ss.getSheetByName("PRODUK") || ss.getSheetByName("Produk");
    if (!sheet) return { success: false, message: "Sheet DataProduk / PRODUK tidak ditemukan." };

    if (!data) return { success: false, message: "Data produk tidak boleh kosong." };

    var id = data.id ? String(data.id).trim() : "";
    var sku = data.sku ? String(data.sku).trim() : "";
    var isEdit = false;
    var targetRow = -1;

    // Cari baris berdasarkan ID atau SKU (Kolom A & B)
    if (sheet.getLastRow() > 1) {
      var range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
      for (var i = 0; i < range.length; i++) {
        var rowId = String(range[i][0]).trim();
        var rowSku = String(range[i][1]).trim();
        if ((id && rowId === id) || (sku && rowSku === sku) || (id && rowSku === id) || (sku && rowId === sku)) {
          isEdit = true;
          targetRow = i + 2;
          break;
        }
      }
    }

    // Pastikan fotoUrl menggunakan tautan CDN jsDelivr dari repo GyPro-dot/ProjekAntigravity@main/assets/ alih-alih base64 panjang
    var defaultCdnFoto = "https://cdn.jsdelivr.net/gh/GyPro-dot/ProjekAntigravity@main/assets/card1_website.jpg";
    var finalFotoUrl = String(data.fotoUrl || "").trim();

    // Jika foto base64 terlalu panjang (> 45000 karakter) atau format data:URI, gunakan fallback aman CDN jsDelivr
    if (!finalFotoUrl || finalFotoUrl.indexOf("data:") === 0 || finalFotoUrl.length > 45000 || finalFotoUrl.indexOf("googleusercontent.com") !== -1 || finalFotoUrl.indexOf("drive.google.com") !== -1) {
      finalFotoUrl = defaultCdnFoto;
    } else if (finalFotoUrl.indexOf("assets/") === 0) {
      finalFotoUrl = "https://cdn.jsdelivr.net/gh/GyPro-dot/ProjekAntigravity@main/" + finalFotoUrl;
    }

    var katUtama = data.kategoriUtama || data.kategori || "Wanita";
    var subKat = data.subKategori || data.kategori || "Koleksi Fashion";
    var jenisKain = data.jenisKain || "Premium Quality";
    var warna = data.warna || "Standar";
    var ukuran = data.ukuran || "All Size";
    var hargaModal = Number(data.hargaModal) || 0;
    var hargaJual = Number(data.hargaJual) || 0;
    var stok = Number(data.stok) || 1;
    var deskripsi = data.deskripsi || (data.nama ? (data.nama + " - Koleksi istimewa butik V&T.") : "Koleksi istimewa butik V&T.");
    var nama = data.nama || ("Produk V&T " + (sku || id));

    if (isEdit && targetRow > 1) {
      // Update produk eksisting sesuai Index Kolom COL_PRODUK
      if (sku) sheet.getRange(targetRow, COL_PRODUK.SKU + 1).setValue(sku);
      sheet.getRange(targetRow, COL_PRODUK.NAMA + 1).setValue(nama);
      sheet.getRange(targetRow, COL_PRODUK.KATEGORI_UTAMA + 1).setValue(katUtama);
      sheet.getRange(targetRow, COL_PRODUK.SUB_KATEGORI + 1).setValue(subKat);
      sheet.getRange(targetRow, COL_PRODUK.JENIS_KAIN + 1).setValue(jenisKain);
      sheet.getRange(targetRow, COL_PRODUK.WARNA + 1).setValue(warna);
      sheet.getRange(targetRow, COL_PRODUK.UKURAN + 1).setValue(ukuran);
      sheet.getRange(targetRow, COL_PRODUK.MODAL + 1).setValue(hargaModal);
      sheet.getRange(targetRow, COL_PRODUK.JUAL + 1).setValue(hargaJual);
      sheet.getRange(targetRow, COL_PRODUK.STOK + 1).setValue(stok);
      sheet.getRange(targetRow, COL_PRODUK.FOTO + 1).setValue(finalFotoUrl);
      sheet.getRange(targetRow, COL_PRODUK.DESKRIPSI + 1).setValue(deskripsi);
      return {
        success: true,
        isEdit: true,
        id: id || sku,
        sku: sku,
        message: "Data produk berhasil disimpan ke database!"
      };
    } else {
      // Buat Produk Baru dengan ID Sekuensial PRD-XXX
      var maxP = 0;
      if (sheet.getLastRow() > 1) {
        var existingProdIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
        for (var p = 0; p < existingProdIds.length; p++) {
          var pId = String(existingProdIds[p][0]).trim();
          if (pId.indexOf("PRD-") === 0) {
            var num = parseInt(pId.replace("PRD-", ""), 10);
            if (!isNaN(num) && num > maxP) maxP = num;
          }
        }
      }
      var newId = id || ("PRD-" + ("000" + (maxP + 1)).slice(-3));
      var skuBaru = sku || ("SKU-PAC-" + ("000" + (maxP + 1)).slice(-3));

      // 14 Kolom Standar DataProduk
      var newRow = [
        newId,
        skuBaru,
        nama,
        katUtama,
        subKat,
        jenisKain,
        warna,
        ukuran,
        hargaModal,
        hargaJual,
        stok,
        finalFotoUrl,
        deskripsi,
        "Aktif"
      ];
      sheet.appendRow(newRow);
      return {
        success: true,
        isEdit: false,
        id: newId,
        sku: skuBaru,
        message: "Data produk berhasil disimpan ke database!"
      };
    }
  } catch (e) {
    Logger.log("Error simpanProduk: " + e.toString());
    return { success: false, message: e.toString() };
  } finally {
    try {
      if (lock) lock.releaseLock();
    } catch (lErr) {}
  }
}

// ----------------------------------------------------------------------------
// 5B. API HAPUS PRODUK DARI DATABASE
// ----------------------------------------------------------------------------
function hapusProduk(skuOrId) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };
    var sheet = ss.getSheetByName("DataProduk") || ss.getSheetByName("PRODUK") || ss.getSheetByName("Produk");
    if (!sheet) return { success: false, message: "Sheet DataProduk / PRODUK tidak ditemukan." };

    var query = String(skuOrId || "").trim();
    if (query && sheet.getLastRow() > 1) {
      // Periksa Kolom A (IdProduk) dan Kolom B (SkuBarcode)
      var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
      for (var i = 0; i < rows.length; i++) {
        var rowId = String(rows[i][0]).trim();
        var rowSku = String(rows[i][1]).trim();
        if (rowId === query || rowSku === query) {
          sheet.deleteRow(i + 2);
          return {
            success: true,
            sku: query,
            message: "Produk '" + query + "' berhasil dihapus dari database!"
          };
        }
      }
    }
    return { success: false, message: "Produk dengan SKU/ID '" + query + "' tidak ditemukan." };
  } catch (err) {
    Logger.log("Error hapusProduk: " + err.toString());
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ----------------------------------------------------------------------------
// 5C. API KELOLA PETUGAS BARU (KHUSUS SUPER ADMIN)
// ----------------------------------------------------------------------------
function tambahPetugas(dataPetugas) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };

    // Validasi wewenang Super Admin
    var callerRole = String(dataPetugas.callerRole || "").toUpperCase();
    var callerName = String(dataPetugas.callerName || "").toUpperCase();
    if (callerRole !== "SUPER_ADMIN" && !callerName.includes("PINKY") && !callerName.includes("ADMIN-G")) {
      return { success: false, message: "Akses Ditolak: Hanya SUPER ADMIN yang berwenang menambah akun petugas baru!" };
    }

    if (!dataPetugas.email || !dataPetugas.nama || !dataPetugas.password) {
      return { success: false, message: "Email, Nama Lengkap, dan Password wajib diisi!" };
    }

    // Cari sheet USERS atau DataPengguna
    var sheetUser = ss.getSheetByName("USERS") || ss.getSheetByName("DataPengguna");
    if (!sheetUser) {
      sheetUser = ss.insertSheet("USERS");
      sheetUser.appendRow(["Email", "Nama_Lengkap", "Password", "Role", "Status", "Tanggal_Daftar"]);
    }

    var nowFormatted = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");
    var email = String(dataPetugas.email).trim();
    var nama = String(dataPetugas.nama).trim();
    var password = String(dataPetugas.password).trim();
    var role = String(dataPetugas.role || "OPERATOR").toUpperCase();
    var status = String(dataPetugas.status || "Aktif").trim();

    // Periksa kolom sheet
    var headers = sheetUser.getRange(1, 1, 1, sheetUser.getLastColumn()).getValues()[0];
    var colMap = {};
    for (var h = 0; h < headers.length; h++) {
      colMap[String(headers[h]).trim().toLowerCase()] = h + 1;
    }

    // Cek duplikasi email
    var lastRow = sheetUser.getLastRow();
    if (lastRow > 1) {
      var emailColIdx = colMap["email"] || 1;
      var emails = sheetUser.getRange(2, emailColIdx, lastRow - 1, 1).getValues();
      for (var e = 0; e < emails.length; e++) {
        if (String(emails[e][0]).trim().toLowerCase() === email.toLowerCase()) {
          return { success: false, message: "Email '" + email + "' sudah terdaftar sebagai petugas sebelumnya." };
        }
      }
    }

    if (colMap["idpengguna"]) {
      var nextId = "USR-" + ("000" + lastRow).slice(-3);
      sheetUser.appendRow([
        nextId,
        nama,
        role,
        email,
        dataPetugas.noWhatsApp || "-",
        password,
        status
      ]);
    } else {
      // Basis Data USERS: Email, Nama_Lengkap, Password, Role, Status, Tanggal_Daftar
      sheetUser.appendRow([
        email,
        nama,
        password,
        role,
        status,
        nowFormatted
      ]);
    }

    return {
      success: true,
      message: "Akun petugas '" + nama + "' (" + role + ") berhasil didaftarkan ke sheet USERS!"
    };
  } catch (err) {
    Logger.log("Error tambahPetugas: " + err.toString());
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

function getDaftarPetugas() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet tidak ditemukan." };
    var sheetUser = ss.getSheetByName("USERS") || ss.getSheetByName("DataPengguna");
    var list = [];
    if (sheetUser && sheetUser.getLastRow() > 1) {
      var rows = sheetUser.getRange(2, 1, sheetUser.getLastRow() - 1, sheetUser.getLastColumn()).getValues();
      var headers = sheetUser.getRange(1, 1, 1, sheetUser.getLastColumn()).getValues()[0];
      var colMap = {};
      for (var h = 0; h < headers.length; h++) {
        colMap[String(headers[h]).trim().toLowerCase()] = h;
      }

      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        list.push({
          email: String(colMap["email"] !== undefined ? r[colMap["email"]] : r[0]),
          nama: String(colMap["nama_lengkap"] !== undefined ? r[colMap["nama_lengkap"]] : (colMap["nama"] !== undefined ? r[colMap["nama"]] : r[1])),
          role: String(colMap["role"] !== undefined ? r[colMap["role"]] : (colMap["levelrole"] !== undefined ? r[colMap["levelrole"]] : r[2])),
          status: String(colMap["status"] !== undefined ? r[colMap["status"]] : "Aktif")
        });
      }
    }
    return { success: true, list: list };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}

// ----------------------------------------------------------------------------
// 6. API SIMPAN PENGATURAN TOKO (PIN, KONTAK, REKENING)
// ----------------------------------------------------------------------------
function simpanPengaturan(dataObj) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("PengaturanToko");
    if (!sheet) return { success: false, message: "Tab PengaturanToko tidak ditemukan." };

    var existingKeys = {};
    if (sheet.getLastRow() > 1) {
      var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
      for (var i = 0; i < rows.length; i++) {
        var k = String(rows[i][0]).trim();
        existingKeys[k] = i + 2; // Baris row
      }
    }

    for (var key in dataObj) {
      if (dataObj.hasOwnProperty(key)) {
        var val = String(dataObj[key]);
        if (existingKeys[key]) {
          sheet.getRange(existingKeys[key], 2).setValue(val);
        } else {
          sheet.appendRow([key, val]);
        }
      }
    }

    return { success: true, message: "Pengaturan toko berhasil disimpan!" };
  } catch (err) {
    Logger.log("Error simpanPengaturan: " + err.toString());
    return { success: false, message: err.toString() };
  }
}


// ----------------------------------------------------------------------------
// 7. API ALAMAT PENGIRIMAN PELANGGAN (SIMPAN & AMBIL DARI DATABASE)
// ----------------------------------------------------------------------------
function simpanAlamat(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };

    var sheet = ss.getSheetByName("AlamatPelanggan");
    if (!sheet) {
      sheet = ss.insertSheet("AlamatPelanggan");
      sheet.appendRow(["IdAlamat", "NamaPenerima", "NoTelepon", "KotaKecamatan", "KodePos", "AlamatLengkap", "IsUtama", "Tanggal"]);
    }

    var id = String(data.id || "").trim();
    if (id && sheet.getLastRow() > 1) {
      var ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          var row = i + 2;
          sheet.getRange(row, 2, 1, 7).setValues([[
            data.nama || "",
            data.telepon || "",
            data.kotaKecamatan || "",
            data.kodePos || "",
            data.alamat || "",
            data.isUtama ? "TRUE" : "FALSE",
            new Date().toISOString()
          ]]);
          return { success: true, id: id, message: "Alamat berhasil diperbarui di basis data cloud!" };
        }
      }
    }

    var newId = id || ("ADDR-" + Utilities.getUuid().substring(0, 8).toUpperCase());
    sheet.appendRow([
      newId,
      data.nama || "",
      data.telepon || "",
      data.kotaKecamatan || "",
      data.kodePos || "",
      data.alamat || "",
      data.isUtama ? "TRUE" : "FALSE",
      new Date().toISOString()
    ]);

    return { success: true, id: newId, message: "Alamat baru berhasil disimpan di basis data cloud!" };
  } catch (err) {
    Logger.log("Error simpanAlamat: " + err.toString());
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

function ambilAlamat() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };

    var sheet = ss.getSheetByName("AlamatPelanggan");
    if (!sheet || sheet.getLastRow() <= 1) return { success: true, addresses: [] };

    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues();
    var list = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      list.push({
        id: String(r[0]),
        nama: String(r[1]),
        telepon: String(r[2]),
        kotaKecamatan: String(r[3]),
        kodePos: String(r[4]),
        alamat: String(r[5]),
        isUtama: String(r[6]).toUpperCase() === "TRUE",
        pinpoint: false
      });
    }
    return { success: true, addresses: list };
  } catch (err) {
    Logger.log("Error ambilAlamat: " + err.toString());
    return { success: false, message: err.toString() };
  }
}

// ----------------------------------------------------------------------------
// 8. API CHECKOUT PESANAN KE SHEET PESANAN & AUTO PENGURANGAN STOK
// ----------------------------------------------------------------------------
function simpanPesanan(orderData) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };

    // Siapkan sheet PESANAN
    var sheetPesanan = ss.getSheetByName("PESANAN") || ss.getSheetByName("DataPesanan");
    var headers = [
      "No_Pesanan",
      "Tanggal_Waktu",
      "Nama_Pelanggan",
      "No_WhatsApp",
      "Alamat_Catatan",
      "Rincian_Item",
      "Total_Item",
      "Total_Belanja",
      "Metode_Bayar",
      "Status_Bayar",
      "Status_Order",
      "Petugas"
    ];

    if (!sheetPesanan) {
      sheetPesanan = ss.insertSheet("PESANAN");
      sheetPesanan.appendRow(headers);
      var hr = sheetPesanan.getRange(1, 1, 1, headers.length);
      hr.setBackground("#c2185b");
      hr.setFontColor("#ffffff");
      hr.setFontWeight("bold");
    }

    // Generate ID unik: ORD-YYYYMMDD-XXX
    var now = new Date();
    var ymd = Utilities.formatDate(now, "GMT+7", "yyyyMMdd");
    var dateFormatted = Utilities.formatDate(now, "GMT+7", "yyyy-MM-dd HH:mm:ss");
    var prefix = "ORD-" + ymd + "-";

    var maxNum = 0;
    if (sheetPesanan.getLastRow() > 1) {
      var existingIds = sheetPesanan.getRange(2, 1, sheetPesanan.getLastRow() - 1, 1).getValues();
      for (var k = 0; k < existingIds.length; k++) {
        var curId = String(existingIds[k][0]).trim();
        if (curId.indexOf(prefix) === 0) {
          var numPart = parseInt(curId.substring(prefix.length), 10);
          if (!isNaN(numPart) && numPart > maxNum) {
            maxNum = numPart;
          }
        }
      }
    }
    var nextOrderId = prefix + ("000" + (maxNum + 1)).slice(-3);

    // Pengurangan stok fisik di sheet PRODUK / DataProduk
    var sheetProduk = ss.getSheetByName("DataProduk") || ss.getSheetByName("PRODUK") || ss.getSheetByName("Produk");
    var items = orderData.items || [];

    if (sheetProduk && sheetProduk.getLastRow() > 1 && items.length > 0) {
      var prodDataRange = sheetProduk.getRange(2, 1, sheetProduk.getLastRow() - 1, sheetProduk.getLastColumn());
      var prodValues = prodDataRange.getValues();

      for (var it = 0; it < items.length; it++) {
        var itm = items[it];
        var targetSku = String(itm.sku || itm.id || "").trim();
        var buyQty = Number(itm.qty) || 1;

        for (var r = 0; r < prodValues.length; r++) {
          var pId = String(prodValues[r][COL_PRODUK.ID]).trim();
          var pSku = String(prodValues[r][COL_PRODUK.SKU]).trim();
          if (pSku === targetSku || pId === targetSku) {
            var curStock = Number(prodValues[r][COL_PRODUK.STOK]) || 0;
            prodValues[r][COL_PRODUK.STOK] = Math.max(0, curStock - buyQty);
            break;
          }
        }
      }
      prodDataRange.setValues(prodValues);
    }

    // Format rincian item teks
    var rincianArr = [];
    var totalQty = 0;
    for (var m = 0; m < items.length; m++) {
      var itemObj = items[m];
      var q = Number(itemObj.qty) || 1;
      totalQty += q;
      rincianArr.push(itemObj.nama + " (" + (itemObj.sku || itemObj.id || "-") + ") x" + q + " @Rp " + (Number(itemObj.hargaSatuan) || 0).toLocaleString("id-ID"));
    }

    var totalBelanja = Number(orderData.totalBelanja || orderData.grandTotal) || 0;
    var rowPesanan = [
      nextOrderId,
      dateFormatted,
      orderData.nama || orderData.namaPelanggan || "Pelanggan Umum",
      orderData.wa || orderData.noWhatsApp || "-",
      orderData.alamat || orderData.catatan || "-",
      rincianArr.join("; "),
      totalQty || Number(orderData.totalItem) || 1,
      totalBelanja,
      orderData.metodeBayar || "Transfer Bank BCA",
      orderData.statusBayar || "Lunas",
      orderData.statusOrder || "Diproses",
      orderData.petugas || "Web Butik V&T"
    ];

    sheetPesanan.appendRow(rowPesanan);

    return {
      success: true,
      orderId: nextOrderId,
      data: orderData,
      message: "Pesanan " + nextOrderId + " berhasil disimpan ke sheet PESANAN!"
    };

  } catch (err) {
    Logger.log("Error simpanPesanan: " + err.toString());
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ----------------------------------------------------------------------------
// 9. API BACA DAFTAR PESANAN DARI SHEET PESANAN
// ----------------------------------------------------------------------------
function getDaftarPesanan() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet tidak ditemukan." };

    var sheetPesanan = ss.getSheetByName("PESANAN") || ss.getSheetByName("DataPesanan");
    if (!sheetPesanan || sheetPesanan.getLastRow() <= 1) {
      return { success: true, list: [] };
    }

    var rows = sheetPesanan.getRange(2, 1, sheetPesanan.getLastRow() - 1, sheetPesanan.getLastColumn()).getValues();
    var list = [];

    for (var i = rows.length - 1; i >= 0; i--) {
      var r = rows[i];
      var rincian = String(r[5] || "");
      list.push({
        orderId: String(r[0] || ""),
        tanggal: String(r[1] || ""),
        customerName: String(r[2] || ""),
        nama: String(r[2] || ""),
        customerPhone: String(r[3] || ""),
        wa: String(r[3] || ""),
        alamatKirim: String(r[4] || ""),
        catatan: String(r[4] || ""),
        rincianItem: rincian,
        totalItem: Number(r[6]) || 1,
        itemCount: Number(r[6]) || 1,
        totalBayar: Number(r[7]) || 0,
        grandTotal: Number(r[7]) || 0,
        subtotal: Number(r[7]) || 0,
        paymentMethod: String(r[8] || "Transfer Bank BCA"),
        metodeBayar: String(r[8] || "Transfer Bank BCA"),
        statusBayar: String(r[9] || "Lunas"),
        status: String(r[10] || "DIPROSES"),
        statusLabel: String(r[10] || "Diproses"),
        petugas: String(r[11] || "Web Butik V&T")
      });
    }

    return { success: true, list: list };
  } catch (err) {
    Logger.log("Error getDaftarPesanan: " + err.toString());
    return { success: false, message: err.toString() };
  }
}
