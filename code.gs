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
          var p = {
            id: String(r[COL_PRODUK.ID] || ""),
            sku: String(r[COL_PRODUK.SKU] || ""),
            nama: String(r[COL_PRODUK.NAMA] || ""),
            kategori: String(r[COL_PRODUK.KATEGORI] || "Lainnya"),
            warna: String(r[COL_PRODUK.WARNA] || ""),
            ukuran: String(r[COL_PRODUK.UKURAN] || ""),
            hargaModal: Number(r[COL_PRODUK.MODAL]) || 0,
            hargaJual: Number(r[COL_PRODUK.JUAL]) || 0,
            stok: Number(r[COL_PRODUK.STOK]) || 0,
            fotoUrl: String(r[COL_PRODUK.FOTO] || ""),
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
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DataProduk");
    if (!sheet) return { success: false, message: "Tab DataProduk tidak ditemukan." };

    var id = data.id ? String(data.id).trim() : "";
    var isEdit = false;
    var targetRow = -1;

    if (id && sheet.getLastRow() > 1) {
      var ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          isEdit = true;
          targetRow = i + 2;
          break;
        }
      }
    }

    if (isEdit) {
      // Update produk eksisting
      sheet.getRange(targetRow, COL_PRODUK.SKU + 1).setValue(data.sku || "");
      sheet.getRange(targetRow, COL_PRODUK.NAMA + 1).setValue(data.nama || "");
      sheet.getRange(targetRow, COL_PRODUK.KATEGORI + 1).setValue(data.kategori || "Lainnya");
      sheet.getRange(targetRow, COL_PRODUK.WARNA + 1).setValue(data.warna || "");
      sheet.getRange(targetRow, COL_PRODUK.UKURAN + 1).setValue(data.ukuran || "");
      sheet.getRange(targetRow, COL_PRODUK.MODAL + 1).setValue(Number(data.hargaModal) || 0);
      sheet.getRange(targetRow, COL_PRODUK.JUAL + 1).setValue(Number(data.hargaJual) || 0);
      sheet.getRange(targetRow, COL_PRODUK.STOK + 1).setValue(Number(data.stok) || 0);
      if (data.fotoUrl) sheet.getRange(targetRow, COL_PRODUK.FOTO + 1).setValue(data.fotoUrl);
      sheet.getRange(targetRow, COL_PRODUK.DESKRIPSI + 1).setValue(data.deskripsi || "");
      return { success: true, message: "Produk " + id + " berhasil diperbarui!" };
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
      var newId = "PRD-" + ("000" + (maxP + 1)).slice(-3);
      var skuBaru = data.sku || ("SKU-PAC-" + ("000" + (maxP + 1)).slice(-3));

      var newRow = [
        newId,
        skuBaru,
        data.nama || "",
        data.kategori || "Lainnya",
        data.warna || "",
        data.ukuran || "",
        Number(data.hargaModal) || 0,
        Number(data.hargaJual) || 0,
        Number(data.stok) || 0,
        data.fotoUrl || "https://lh3.googleusercontent.com/d/1gHVcy2fnnUPSnxbnHG50vGqp3YQhGHMM",
        data.deskripsi || "",
        "Aktif"
      ];
      sheet.appendRow(newRow);
      return { success: true, id: newId, message: "Produk baru " + newId + " berhasil ditambahkan!" };
    }
  } catch (err) {
    Logger.log("Error simpanProduk: " + err.toString());
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
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
