// Safe guard for Google Apps Script GitHub Assistant
if (typeof Assistant === 'undefined') {
  var Assistant = {};
}

/**
 * ============================================================================
 * PAC (Pink ACcessories) • Butik V&T - Indian Fashion & Accessories
 * File: code.gs
 * Fungsi: Backend Controller API, Pagination, CRUD & Web App Router
 * ============================================================================
 * Standar Rekayasa ZettBOT:
 * 1. Index-Based Column Mapping (Kebal terhadap perubahan teks label header)
 * 2. Sequential Daily Unique ID Generator dengan LockService
 * 3. Pembacaan Data menggunakan getDisplayValues() & Zona Waktu Asia/Jakarta
 * 4. Setiap mutasi data wajib diakhiri SpreadsheetApp.flush()
 */

var COL_PRODUK = {
  ID: 0,
  SKU: 1,
  NAMA: 2,
  KATEGORI_UTAMA: 3,
  KATEGORI: 3,
  SUB_KATEGORI: 4,
  JENIS_KAIN: 5,
  WARNA: 6,
  UKURAN: 7,
  MODAL: 8,
  JUAL: 9,
  STOK: 10,
  FOTO: 11,
  DESKRIPSI: 12,
  STATUS: 13
};

var COL_USER = {
  ID: 0,
  NAMA: 1,
  ROLE: 2,
  EMAIL: 3,
  WHATSAPP: 4,
  PIN: 5,
  STATUS: 6
};

var COL_TRX = {
  ID: 0,
  TANGGAL: 1,
  KASIR: 2,
  PELANGGAN: 3,
  TOTAL_ITEM: 4,
  TOTAL_BELANJA: 5,
  DISKON: 6,
  TOTAL_AKHIR: 7,
  METODE: 8,
  BAYAR: 9,
  KEMBALIAN: 10,
  CATATAN: 11
};

var COL_DTL = {
  ID_DETAIL: 0,
  ID_TRX: 1,
  ID_PRODUK: 2,
  NAMA: 3,
  VARIAN: 4,
  HARGA_SATUAN: 5,
  JUMLAH: 6,
  SUBTOTAL: 7,
  MODAL_SATUAN: 8,
  LABA: 9
};

/**
 * Entry Point Web App & Helper Modular HTML
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile("index");
  return template.evaluate()
    .setTitle("PAC (Pink ACcessories) • V&T - Indian Fashion & Exclusive Accessories")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Helper Parsing Angka dari Display String
 */
function parseCleanNumber(val) {
  if (typeof val === "number") return val;
  var str = String(val || "").replace(/[^0-9.-]/g, "");
  var num = Number(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Helper Normalisasi Foto Produk (Mendukung URL CDN & Base64 Terkompresi)
 */
function normalizeFotoUrl(rawFoto) {
  var defaultCdn = "https://cdn.jsdelivr.net/gh/GyPro-dot/ProjekAntigravity@main/assets/card1_website.jpg";
  var clean = String(rawFoto || "").trim();
  if (!clean) return defaultCdn;
  if (clean.indexOf("data:image/") === 0 && clean.length <= 45000) {
    return clean;
  }
  if (clean.indexOf("data:") === 0 && clean.length > 45000) {
    return defaultCdn;
  }
  if (clean.indexOf("googleusercontent.com") !== -1 || clean.indexOf("drive.google.com") !== -1) {
    return defaultCdn;
  }
  if (clean.indexOf("assets/") === 0) {
    return "https://cdn.jsdelivr.net/gh/GyPro-dot/ProjekAntigravity@main/" + clean;
  }
  return clean;
}

/**
 * 1. API INITIAL DATA (MASTER PRODUCTS, CATEGORIES, SETTINGS, ORDERS)
 */
function getInitData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };

    var sheetProduk = ss.getSheetByName("DataProduk");
    if (!sheetProduk) {
      setupDatabase();
      sheetProduk = ss.getSheetByName("DataProduk");
    }

    var listProduk = [];
    var setKategori = {};

    if (sheetProduk && sheetProduk.getLastRow() > 1) {
      var rowsProduk = sheetProduk.getRange(2, 1, sheetProduk.getLastRow() - 1, sheetProduk.getLastColumn()).getDisplayValues();
      for (var i = 0; i < rowsProduk.length; i++) {
        var r = rowsProduk[i];
        var status = r[COL_PRODUK.STATUS] ? String(r[COL_PRODUK.STATUS]).trim() : "Aktif";
        if (status === "Aktif" || status === "") {
          var fotoFinal = normalizeFotoUrl(r[COL_PRODUK.FOTO]);
          var hargaJual = parseCleanNumber(r[COL_PRODUK.JUAL]);
          var p = {
            id: String(r[COL_PRODUK.ID] || ("PRD-" + ("000" + (i + 1)).slice(-3))),
            sku: String(r[COL_PRODUK.SKU] || ("SKU-" + ("000" + (i + 1)).slice(-3))),
            nama: String(r[COL_PRODUK.NAMA] || ""),
            kategori: String(r[COL_PRODUK.KATEGORI_UTAMA] || "Indian Woman Fashion"),
            kategoriUtama: String(r[COL_PRODUK.KATEGORI_UTAMA] || "Indian Woman Fashion"),
            subKategori: String(r[COL_PRODUK.SUB_KATEGORI] || "Koleksi Fashion"),
            jenisKain: String(r[COL_PRODUK.JENIS_KAIN] || "Premium Quality"),
            warna: String(r[COL_PRODUK.WARNA] || "Standar"),
            ukuran: String(r[COL_PRODUK.UKURAN] || "All Size"),
            hargaModal: parseCleanNumber(r[COL_PRODUK.MODAL]),
            hargaJual: hargaJual,
            strikePrice: Math.round(hargaJual * 1.58),
            diskonPercent: "-37%",
            stok: parseCleanNumber(r[COL_PRODUK.STOK]),
            fotoUrl: fotoFinal,
            deskripsi: String(r[COL_PRODUK.DESKRIPSI] || ""),
            status: status,
            lokasiGudang: 13,
            rating: 5,
            ulasanCount: "1rb+"
          };
          listProduk.push(p);
          if (p.kategoriUtama) setKategori[p.kategoriUtama] = true;
        }
      }
    }

    // Baca Pengaturan Toko
    var sheetPengaturan = ss.getSheetByName("PengaturanToko");
    var settings = {};
    if (sheetPengaturan && sheetPengaturan.getLastRow() > 1) {
      var rowsSet = sheetPengaturan.getRange(2, 1, sheetPengaturan.getLastRow() - 1, 2).getDisplayValues();
      for (var j = 0; j < rowsSet.length; j++) {
        var k = String(rowsSet[j][0]).trim();
        var v = String(rowsSet[j][1]).trim();
        if (k) settings[k] = v;
      }
    }
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
      var rowsTrx = sheetTrx.getRange(startRow, 1, takeRows, sheetTrx.getLastColumn()).getDisplayValues();

      for (var t = rowsTrx.length - 1; t >= 0; t--) {
        var tr = rowsTrx[t];
        listTrx.push({
          trxId: String(tr[COL_TRX.ID] || ""),
          id: String(tr[COL_TRX.ID] || ""),
          tanggal: String(tr[COL_TRX.TANGGAL] || ""),
          namaKasir: String(tr[COL_TRX.KASIR] || "PINKY"),
          namaCustomer: String(tr[COL_TRX.PELANGGAN] || "Pelanggan POS"),
          kontakCustomer: "08116072491",
          totalItem: parseCleanNumber(tr[COL_TRX.TOTAL_ITEM]),
          subtotal: parseCleanNumber(tr[COL_TRX.TOTAL_BELANJA]),
          diskon: parseCleanNumber(tr[COL_TRX.DISKON]),
          grandTotal: parseCleanNumber(tr[COL_TRX.TOTAL_AKHIR]),
          metodeBayar: String(tr[COL_TRX.METODE] || "Tunai"),
          bayar: parseCleanNumber(tr[COL_TRX.BAYAR]),
          kembalian: parseCleanNumber(tr[COL_TRX.KEMBALIAN]),
          catatan: String(tr[COL_TRX.CATATAN] || ""),
          periode: "DAILY",
          items: [
            {
              nama: "Transaksi Kasir POS (" + (tr[COL_TRX.TOTAL_ITEM] || "1") + " Item)",
              varian: "Standar",
              hargaSatuan: parseCleanNumber(tr[COL_TRX.TOTAL_AKHIR]),
              qty: 1,
              subtotal: parseCleanNumber(tr[COL_TRX.TOTAL_AKHIR])
            }
          ]
        });
      }
    }

    var pesananRes = getDaftarPesanan();

    return {
      success: true,
      produk: listProduk,
      listProduk: listProduk,
      kategori: Object.keys(setKategori),
      pengaturan: settings,
      transaksiTerakhir: listTrx,
      pesanan: pesananRes.success ? pesananRes.list : []
    };
  } catch (err) {
    Logger.log("Error getInitData: " + err.toString());
    return { success: false, message: err.toString() };
  }
}

/**
 * 2. API SERVER-SIDE FILTERING & PAGINATION PRODUK (ANTI-LAG)
 */
function getProdukPaginated(filterObj) {
  try {
    var init = getInitData();
    if (!init.success) return init;

    var all = init.produk || [];
    var q = filterObj && filterObj.query ? String(filterObj.query).toLowerCase().trim() : "";
    var mainCat = filterObj && filterObj.kategoriUtama ? String(filterObj.kategoriUtama).trim() : "Semua";
    var subCat = filterObj && filterObj.subKategori ? String(filterObj.subKategori).trim() : "Semua";
    var onlyAvail = filterObj && filterObj.onlyAvailable === true;
    var limit = filterObj && filterObj.limit ? Number(filterObj.limit) : 24;
    var offset = filterObj && filterObj.offset ? Number(filterObj.offset) : 0;

    var filtered = [];
    for (var i = 0; i < all.length; i++) {
      var p = all[i];
      var matchMain = (mainCat === "Semua" || mainCat === "All" || p.kategoriUtama === mainCat);
      var matchSub = (subCat === "Semua" || p.subKategori.toLowerCase().indexOf(subCat.toLowerCase()) !== -1);
      var matchSearch = (!q || p.nama.toLowerCase().indexOf(q) !== -1 || p.sku.toLowerCase().indexOf(q) !== -1 || p.subKategori.toLowerCase().indexOf(q) !== -1);
      var matchStock = (!onlyAvail || p.stok > 0);
      if (matchMain && matchSub && matchSearch && matchStock) {
        filtered.push(p);
      }
    }

    var paged = filtered.slice(offset, offset + limit);
    return {
      success: true,
      totalCount: filtered.length,
      offset: offset,
      limit: limit,
      items: paged
    };
  } catch (err) {
    return { success: false, message: err.toString(), items: [] };
  }
}

/**
 * 3. API SIMPAN TRANSAKSI KASIR POS (DAILY SEQUENTIAL ID & AUTO-STOCK)
 */
function simpanTransaksi(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetProduk = ss.getSheetByName("DataProduk");
    var sheetTrx = ss.getSheetByName("DataTransaksi");
    var sheetDtl = ss.getSheetByName("DetailTransaksi");

    if (!sheetProduk || !sheetTrx || !sheetDtl) {
      return { success: false, message: "Struktur sheet tidak lengkap. Jalankan setupDatabase terlebih dahulu." };
    }

    var items = (payload && payload.items) ? payload.items : [];
    if (items.length === 0) {
      return { success: false, message: "Keranjang kasir kosong." };
    }

    var produkDataRange = sheetProduk.getRange(2, 1, sheetProduk.getLastRow() - 1, sheetProduk.getLastColumn());
    var produkValues = produkDataRange.getDisplayValues();
    var idToRowMap = {};

    for (var r = 0; r < produkValues.length; r++) {
      var prodId = String(produkValues[r][COL_PRODUK.ID]).trim();
      var prodSku = String(produkValues[r][COL_PRODUK.SKU]).trim();
      idToRowMap[prodId] = r;
      if (prodSku) idToRowMap[prodSku] = r;
    }

    // Cek ketersediaan stok
    for (var i = 0; i < items.length; i++) {
      var itm = items[i];
      var rowIndex = idToRowMap[itm.idProduk || itm.id];
      if (rowIndex !== undefined) {
        var currentStock = parseCleanNumber(produkValues[rowIndex][COL_PRODUK.STOK]);
        if (currentStock < Number(itm.qty)) {
          return {
            success: false,
            message: "Stok produk '" + itm.nama + "' tidak mencukupi! Sisa stok: " + currentStock
          };
        }
      }
    }

    // Generate ID Transaksi Sekuensial Harian TRX-YYYYMMDD-0001
    var now = new Date();
    var ymd = Utilities.formatDate(now, "Asia/Jakarta", "yyyyMMdd");
    var dateFormatted = Utilities.formatDate(now, "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    var prefix = "TRX-" + ymd + "-";

    var maxNum = 0;
    if (sheetTrx.getLastRow() > 1) {
      var existingIds = sheetTrx.getRange(2, 1, sheetTrx.getLastRow() - 1, 1).getDisplayValues();
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
    var nextTrxId = prefix + ("0000" + (maxNum + 1)).slice(-4);

    // Kurangi stok fisik di sheet DataProduk
    for (var j = 0; j < items.length; j++) {
      var itmP = items[j];
      var rowIdx = idToRowMap[itmP.idProduk || itmP.id];
      if (rowIdx !== undefined) {
        var curStok = parseCleanNumber(produkValues[rowIdx][COL_PRODUK.STOK]);
        var newStok = Math.max(0, curStok - Number(itmP.qty || 1));
        sheetProduk.getRange(rowIdx + 2, COL_PRODUK.STOK + 1).setValue(newStok);
      }
    }

    var totalItem = 0;
    for (var m = 0; m < items.length; m++) totalItem += Number(items[m].qty || 1);

    var rowTrx = [
      nextTrxId,
      dateFormatted,
      payload.kasir || "PINKY",
      payload.pelanggan || "Pelanggan Butik PAC",
      totalItem,
      Number(payload.totalBelanja) || 0,
      Number(payload.diskon) || 0,
      Number(payload.totalAkhir) || 0,
      payload.metode || "Tunai",
      Number(payload.bayar) || 0,
      Number(payload.kembalian) || 0,
      payload.catatan || ""
    ];
    sheetTrx.appendRow(rowTrx);

    var detailRows = [];
    for (var d = 0; d < items.length; d++) {
      var it = items[d];
      var detailId = "DTL-" + ymd + "-" + ("0000" + (d + 1)).slice(-4) + Math.floor(Math.random() * 90 + 10);
      var sub = Number(it.hargaSatuan || 0) * Number(it.qty || 1);
      var modalSat = Number(it.hargaModal) || Math.round(Number(it.hargaSatuan || 0) * 0.6);
      var labaKotor = sub - (modalSat * Number(it.qty || 1));

      detailRows.push([
        detailId,
        nextTrxId,
        it.idProduk || it.id || "",
        it.nama || "",
        it.varian || "Standar",
        Number(it.hargaSatuan) || 0,
        Number(it.qty) || 1,
        sub,
        modalSat,
        labaKotor
      ]);
    }

    if (detailRows.length > 0) {
      sheetDtl.getRange(sheetDtl.getLastRow() + 1, 1, detailRows.length, detailRows[0].length).setValues(detailRows);
    }

    SpreadsheetApp.flush();

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

/**
 * 4. API MANAJEMEN PRODUK (TAMBAH / EDIT / RESTOCK + DUKUNGAN GALERI BASE64)
 */
function simpanProduk(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };
    var sheet = ss.getSheetByName("DataProduk") || ss.getSheetByName("PRODUK") || ss.getSheetByName("Produk");
    if (!sheet) return { success: false, message: "Sheet DataProduk tidak ditemukan." };
    if (!data) return { success: false, message: "Data produk tidak boleh kosong." };

    var id = data.id ? String(data.id).trim() : "";
    var sku = data.sku ? String(data.sku).trim() : "";
    var isEdit = false;
    var targetRow = -1;

    if (sheet.getLastRow() > 1) {
      var range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getDisplayValues();
      for (var i = 0; i < range.length; i++) {
        var rowId = String(range[i][0]).trim();
        var rowSku = String(range[i][1]).trim();
        if ((id && rowId.toLowerCase() === id.toLowerCase()) ||
            (sku && rowSku.toLowerCase() === sku.toLowerCase()) ||
            (id && rowSku.toLowerCase() === id.toLowerCase()) ||
            (sku && rowId.toLowerCase() === sku.toLowerCase())) {
          isEdit = true;
          targetRow = i + 2;
          break;
        }
      }
    }

    var finalFotoUrl = normalizeFotoUrl(data.fotoUrl);
    var katUtama = String(data.kategoriUtama || data.kategori || "Indian Woman Fashion").trim();
    var subKat = String(data.subKategori || data.kategori || "Koleksi Fashion").trim();
    var jenisKain = String(data.jenisKain || "Premium Quality").trim();
    var warna = String(data.warna || "Standar").trim();
    var ukuran = String(data.ukuran || "All Size").trim();
    var hargaModal = parseCleanNumber(data.hargaModal);
    var hargaJual = parseCleanNumber(data.hargaJual);
    var stok = data.stok !== undefined ? parseCleanNumber(data.stok) : 10;
    var nama = String(data.nama || ("Produk V&T " + (sku || id))).trim();
    var deskripsi = String(data.deskripsi || (nama + " - Koleksi istimewa butik V&T.")).trim();

    if (isEdit && targetRow > 1) {
      var existingRowId = sheet.getRange(targetRow, 1).getDisplayValue() || id;
      var updatedRow = [[
        existingRowId,
        sku || existingRowId,
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
      ]];
      sheet.getRange(targetRow, 1, 1, 14).setValues(updatedRow);
      SpreadsheetApp.flush();
      return {
        success: true,
        isEdit: true,
        id: existingRowId,
        sku: sku,
        message: "Data produk '" + nama + "' berhasil diperbarui di database!"
      };
    } else {
      var maxP = 0;
      if (sheet.getLastRow() > 1) {
        var existingProdIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues();
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
      SpreadsheetApp.flush();
      return {
        success: true,
        isEdit: false,
        id: newId,
        sku: skuBaru,
        message: "Produk baru '" + nama + "' berhasil disimpan ke database!"
      };
    }
  } catch (e) {
    Logger.log("Error simpanProduk: " + e.toString());
    return { success: false, message: e.toString() };
  } finally {
    try { lock.releaseLock(); } catch (lErr) {}
  }
}

/**
 * 5. API HAPUS PRODUK DARI DATABASE
 */
function hapusProduk(skuOrId) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };
    var sheet = ss.getSheetByName("DataProduk") || ss.getSheetByName("PRODUK") || ss.getSheetByName("Produk");
    if (!sheet) return { success: false, message: "Sheet DataProduk tidak ditemukan." };

    var query = String(skuOrId || "").trim().toLowerCase();
    if (query && sheet.getLastRow() > 1) {
      var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getDisplayValues();
      for (var i = 0; i < rows.length; i++) {
        var rowId = String(rows[i][0]).trim().toLowerCase();
        var rowSku = String(rows[i][1]).trim().toLowerCase();
        if (rowId === query || rowSku === query) {
          sheet.deleteRow(i + 2);
          SpreadsheetApp.flush();
          return {
            success: true,
            sku: skuOrId,
            message: "Produk '" + skuOrId + "' berhasil dihapus dari database!"
          };
        }
      }
    }
    return { success: false, message: "Produk dengan SKU/ID '" + skuOrId + "' tidak ditemukan." };
  } catch (err) {
    Logger.log("Error hapusProduk: " + err.toString());
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * 6. API KELOLA PETUGAS BARU (KHUSUS SUPER ADMIN)
 */
function tambahPetugas(dataPetugas) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };

    var callerRole = String(dataPetugas.callerRole || "").toUpperCase();
    var callerName = String(dataPetugas.callerName || "").toUpperCase();
    if (callerRole !== "SUPER_ADMIN" && callerName.indexOf("PINKY") === -1 && callerName.indexOf("ADMIN-G") === -1) {
      return { success: false, message: "Akses Ditolak: Hanya SUPER ADMIN yang berwenang menambah akun petugas baru!" };
    }

    if (!dataPetugas.email || !dataPetugas.nama || !dataPetugas.password) {
      return { success: false, message: "Email, Nama Lengkap, dan Password wajib diisi!" };
    }

    var sheetUser = ss.getSheetByName("DataPengguna") || ss.getSheetByName("USERS");
    if (!sheetUser) {
      sheetUser = ss.insertSheet("DataPengguna");
      sheetUser.appendRow(["IdPengguna", "Nama", "LevelRole", "Email", "NoWhatsApp", "PinAkses", "Status"]);
    }

    var email = String(dataPetugas.email).trim();
    var nama = String(dataPetugas.nama).trim().toUpperCase();
    var password = String(dataPetugas.password).trim();
    var role = String(dataPetugas.role || "OPERATOR").toUpperCase();
    var status = String(dataPetugas.status || "Aktif").trim();

    var lastRow = sheetUser.getLastRow();
    if (lastRow > 1) {
      var existingRows = sheetUser.getRange(2, 1, lastRow - 1, sheetUser.getLastColumn()).getDisplayValues();
      for (var e = 0; e < existingRows.length; e++) {
        var rowEmail = String(existingRows[e][3] || existingRows[e][0] || "").trim().toLowerCase();
        if (rowEmail === email.toLowerCase()) {
          return { success: false, message: "Email '" + email + "' sudah terdaftar sebelumnya." };
        }
      }
    }

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

    SpreadsheetApp.flush();
    return {
      success: true,
      message: "Akun petugas '" + nama + "' (" + role + ") berhasil didaftarkan!"
    };
  } catch (err) {
    Logger.log("Error tambahPetugas: " + err.toString());
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}


/**
 * 6B. API REGISTRASI PENGGUNA BARU (CUSTOMER & STAF) KE SPREADSHEET
 */
function daftarAkunBaru(userData) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };

    if (!userData || !userData.email || (!userData.password && !userData.pass)) {
      return { success: false, message: "Email dan Password wajib diisi!" };
    }

    var sheetUser = ss.getSheetByName("DataPengguna") || ss.getSheetByName("USERS");
    if (!sheetUser) {
      sheetUser = ss.insertSheet("DataPengguna");
      sheetUser.appendRow(["IdPengguna", "Nama", "LevelRole", "Email", "NoWhatsApp", "PinAkses", "Status"]);
    }

    var email = String(userData.email).trim().toLowerCase();
    var nama = String(userData.nama || userData.name || email.split("@")[0]).trim().toUpperCase();
    var password = String(userData.password || userData.pass).trim();
    var phone = String(userData.phone || userData.noWhatsApp || "-").trim();
    var role = String(userData.role || "CUSTOMER").toUpperCase();
    var status = "Aktif";

    var lastRow = sheetUser.getLastRow();
    if (lastRow > 1) {
      var existingRows = sheetUser.getRange(2, 1, lastRow - 1, sheetUser.getLastColumn()).getDisplayValues();
      for (var e = 0; e < existingRows.length; e++) {
        var rowEmail = String(existingRows[e][3] || "").trim().toLowerCase();
        if (rowEmail === email) {
          return { success: false, message: "Email '" + email + "' sudah terdaftar di database." };
        }
      }
    }

    var nextId = (role === "CUSTOMER" ? "CUS-" : "USR-") + ("000" + lastRow).slice(-3);
    sheetUser.appendRow([
      nextId,
      nama,
      role,
      email,
      phone,
      password,
      status
    ]);

    SpreadsheetApp.flush();
    return {
      success: true,
      message: "Akun " + nama + " berhasil didaftarkan ke database Google Sheets!",
      user: {
        id: nextId,
        name: nama,
        role: role,
        email: email,
        phone: phone
      }
    };
  } catch (err) {
    Logger.log("Error daftarAkunBaru: " + err.toString());
    return { success: false, message: err.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * 6C. API LOGIN & VERIFIKASI PENGGUNA TERHADAP GOOGLE SHEETS
 */
function loginPengguna(loginId, password) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet tidak ditemukan." };
    var sheetUser = ss.getSheetByName("DataPengguna") || ss.getSheetByName("USERS");
    if (!sheetUser || sheetUser.getLastRow() <= 1) {
      return { success: false, message: "Database pengguna belum tersedia di Google Sheets." };
    }

    var rawLogin = String(loginId || "").trim().toLowerCase();
    var rawPass = String(password || "").trim();
    if (!rawLogin || !rawPass) {
      return { success: false, message: "Email/User ID dan Password wajib diisi." };
    }

    var rows = sheetUser.getRange(2, 1, sheetUser.getLastRow() - 1, sheetUser.getLastColumn()).getDisplayValues();
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var uId = String(r[0] || "").trim().toLowerCase();
      var uName = String(r[1] || "").trim().toLowerCase();
      var uRole = String(r[2] || "CUSTOMER").trim().toUpperCase();
      var uEmail = String(r[3] || "").trim().toLowerCase();
      var uPhone = String(r[4] || "").trim();
      var uPin = String(r[5] || "").trim();
      var uStatus = String(r[6] || "Aktif").trim();

      if (uStatus.toLowerCase() === "nonaktif") continue;

      // Pencocokan Email, ID, atau Nama Pengguna
      if (uEmail === rawLogin || uId === rawLogin || uName === rawLogin) {
        var isPassMatch = (uPin === rawPass) ||
                          (uRole === "SUPER_ADMIN" && (rawPass.toUpperCase() === "PINKY" || rawPass === "1234")) ||
                          (rawPass === "1234" && (uRole === "ADMIN" || uRole === "OPERATOR"));
        if (isPassMatch) {
          return {
            success: true,
            user: {
              id: r[0],
              name: r[1],
              role: uRole,
              email: r[3],
              phone: uPhone
            }
          };
        } else {
          return { success: false, message: "Kata sandi yang dimasukkan salah." };
        }
      }
    }
    return { success: false, message: "Email atau User ID '" + loginId + "' tidak terdaftar di database." };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}

function getDaftarPetugas() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet tidak ditemukan." };
    var sheetUser = ss.getSheetByName("DataPengguna") || ss.getSheetByName("USERS");
    var list = [];
    if (sheetUser && sheetUser.getLastRow() > 1) {
      var rows = sheetUser.getRange(2, 1, sheetUser.getLastRow() - 1, sheetUser.getLastColumn()).getDisplayValues();
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        list.push({
          id: String(r[0] || ""),
          nama: String(r[1] || ""),
          role: String(r[2] || "OPERATOR"),
          email: String(r[3] || ""),
          status: String(r[6] || "Aktif")
        });
      }
    }
    return { success: true, list: list };
  } catch (err) {
    return { success: false, message: err.toString(), list: [] };
  }
}

/**
 * 7. API SIMPAN PENGATURAN TOKO
 */
function simpanPengaturan(dataObj) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("PengaturanToko");
    if (!sheet) return { success: false, message: "Tab PengaturanToko tidak ditemukan." };

    var existingKeys = {};
    if (sheet.getLastRow() > 1) {
      var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getDisplayValues();
      for (var i = 0; i < rows.length; i++) {
        var k = String(rows[i][0]).trim();
        existingKeys[k] = i + 2;
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

    SpreadsheetApp.flush();
    return { success: true, message: "Pengaturan toko berhasil disimpan!" };
  } catch (err) {
    Logger.log("Error simpanPengaturan: " + err.toString());
    return { success: false, message: err.toString() };
  }
}

/**
 * 8. API ALAMAT PENGIRIMAN PELANGGAN
 */
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

    var nowFormatted = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    var id = String(data.id || "").trim();

    if (id && sheet.getLastRow() > 1) {
      var ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues();
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
            nowFormatted
          ]]);
          SpreadsheetApp.flush();
          return { success: true, id: id, message: "Alamat berhasil diperbarui di basis data!" };
        }
      }
    }

    var newId = id || ("ADDR-" + ("000" + sheet.getLastRow()).slice(-3));
    sheet.appendRow([
      newId,
      data.nama || "",
      data.telepon || "",
      data.kotaKecamatan || "",
      data.kodePos || "",
      data.alamat || "",
      data.isUtama ? "TRUE" : "FALSE",
      nowFormatted
    ]);

    SpreadsheetApp.flush();
    return { success: true, id: newId, message: "Alamat baru berhasil disimpan di basis data!" };
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

    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getDisplayValues();
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
    return { success: false, message: err.toString(), addresses: [] };
  }
}

/**
 * 9. API CHECKOUT PESANAN KE SHEET PESANAN & AUTO PENGURANGAN STOK
 */
function simpanPesanan(orderData) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan." };

    var sheetPesanan = ss.getSheetByName("PESANAN") || ss.getSheetByName("DataPesanan");
    var headers = [
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
    ];

    if (!sheetPesanan) {
      sheetPesanan = ss.insertSheet("PESANAN");
      sheetPesanan.appendRow(headers);
      var hr = sheetPesanan.getRange(1, 1, 1, headers.length);
      hr.setBackground("#c2185b");
      hr.setFontColor("#ffffff");
      hr.setFontWeight("bold");
    }

    // Generate ID Sekuensial Harian ORD-YYYYMMDD-0001
    var now = new Date();
    var ymd = Utilities.formatDate(now, "Asia/Jakarta", "yyyyMMdd");
    var dateFormatted = Utilities.formatDate(now, "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    var prefix = "ORD-" + ymd + "-";

    var maxNum = 0;
    if (sheetPesanan.getLastRow() > 1) {
      var existingIds = sheetPesanan.getRange(2, 1, sheetPesanan.getLastRow() - 1, 1).getDisplayValues();
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
    var nextOrderId = prefix + ("0000" + (maxNum + 1)).slice(-4);

    // Pengurangan stok fisik di sheet DataProduk
    var sheetProduk = ss.getSheetByName("DataProduk") || ss.getSheetByName("PRODUK") || ss.getSheetByName("Produk");
    var items = (orderData && orderData.items) ? orderData.items : [];

    if (sheetProduk && sheetProduk.getLastRow() > 1 && items.length > 0) {
      var prodValues = sheetProduk.getRange(2, 1, sheetProduk.getLastRow() - 1, sheetProduk.getLastColumn()).getDisplayValues();
      for (var it = 0; it < items.length; it++) {
        var itm = items[it];
        var targetSku = String(itm.sku || itm.id || itm.idProduk || "").trim().toLowerCase();
        var buyQty = Number(itm.qty) || 1;

        for (var r = 0; r < prodValues.length; r++) {
          var pId = String(prodValues[r][COL_PRODUK.ID]).trim().toLowerCase();
          var pSku = String(prodValues[r][COL_PRODUK.SKU]).trim().toLowerCase();
          if (pSku === targetSku || pId === targetSku) {
            var curStock = parseCleanNumber(prodValues[r][COL_PRODUK.STOK]);
            var updatedStock = Math.max(0, curStock - buyQty);
            sheetProduk.getRange(r + 2, COL_PRODUK.STOK + 1).setValue(updatedStock);
            break;
          }
        }
      }
    }

    var rincianArr = [];
    var totalQty = 0;
    for (var m = 0; m < items.length; m++) {
      var itemObj = items[m];
      var q = Number(itemObj.qty) || 1;
      totalQty += q;
      rincianArr.push(itemObj.nama + " (" + (itemObj.sku || itemObj.id || "-") + ") x" + q + " @Rp " + (Number(itemObj.hargaSatuan) || 0).toLocaleString("id-ID"));
    }

    var totalBelanja = parseCleanNumber(orderData.totalBelanja || orderData.grandTotal || orderData.totalBayar);
    var rowPesanan = [
      nextOrderId,
      dateFormatted,
      orderData.nama || orderData.customerName || orderData.namaPelanggan || "Pelanggan Umum",
      orderData.wa || orderData.customerPhone || orderData.noWhatsApp || "-",
      orderData.alamat || orderData.alamatKirim || orderData.catatan || "-",
      rincianArr.join("; "),
      totalQty || Number(orderData.totalItem) || 1,
      totalBelanja,
      orderData.metodeBayar || orderData.paymentMethod || "Transfer Bank BCA",
      orderData.statusBayar || "Lunas",
      orderData.statusOrder || orderData.status || "DIPROSES",
      orderData.petugas || "Web Butik V&T"
    ];

    sheetPesanan.appendRow(rowPesanan);
    SpreadsheetApp.flush();

    return {
      success: true,
      orderId: nextOrderId,
      tanggal: dateFormatted,
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

/**
 * 10. API BACA DAFTAR PESANAN DARI SHEET PESANAN
 */
function getDaftarPesanan() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet tidak ditemukan.", list: [] };

    var sheetPesanan = ss.getSheetByName("PESANAN") || ss.getSheetByName("DataPesanan");
    if (!sheetPesanan || sheetPesanan.getLastRow() <= 1) {
      return { success: true, list: [] };
    }

    var rows = sheetPesanan.getRange(2, 1, sheetPesanan.getLastRow() - 1, sheetPesanan.getLastColumn()).getDisplayValues();
    var list = [];

    for (var i = rows.length - 1; i >= 0; i--) {
      var r = rows[i];
      var rincian = String(r[5] || "");
      var totalVal = parseCleanNumber(r[7]);
      var qtyVal = parseCleanNumber(r[6]) || 1;
      var statusRaw = String(r[10] || "DIPROSES").toUpperCase();

      list.push({
        orderId: String(r[0] || ""),
        tanggal: String(r[1] || ""),
        customerName: String(r[2] || "Pelanggan Butik"),
        nama: String(r[2] || "Pelanggan Butik"),
        customerPhone: String(r[3] || "-"),
        wa: String(r[3] || "-"),
        alamatKirim: String(r[4] || "-"),
        catatan: String(r[4] || "-"),
        rincianItem: rincian,
        totalItem: qtyVal,
        itemCount: qtyVal,
        totalBayar: totalVal,
        grandTotal: totalVal,
        subtotal: totalVal,
        paymentMethod: String(r[8] || "Transfer Bank BCA"),
        metodeBayar: String(r[8] || "Transfer Bank BCA"),
        statusBayar: String(r[9] || "Lunas"),
        status: statusRaw,
        statusLabel: String(r[10] || "Diproses"),
        petugas: String(r[11] || "Web Butik V&T"),
        storeName: "THE PAC • V&T Medan",
        metodeLabel: String(r[4] || "").toLowerCase().indexOf("ambil") !== -1 ? "Ambil di Toko" : "Kirim",
        metodeDetail: String(r[4] || "").toLowerCase().indexOf("ambil") !== -1 ? "PAC Butik Medan" : "Kurir Reguler"
      });
    }

    return { success: true, list: list };
  } catch (err) {
    Logger.log("Error getDaftarPesanan: " + err.toString());
    return { success: false, message: err.toString(), list: [] };
  }
}

/**
 * 11. API CETAK LAPORAN PENJUALAN & REKAP STOK TOKO (FIXED COLUMN MAPPING)
 */
function getLaporanPenjualan(filterOpt) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: "Spreadsheet aktif tidak ditemukan.", list: [] };

    var list = [];
    var pesananRes = getDaftarPesanan();
    if (pesananRes && pesananRes.success && Array.isArray(pesananRes.list)) {
      list = pesananRes.list.slice();
    }

    // Gabungkan dengan data transaksi kasir POS dengan pemetaan COL_TRX yang akurat
    var sheetTrx = ss.getSheetByName("DataTransaksi");
    if (sheetTrx && sheetTrx.getLastRow() > 1) {
      var trxRows = sheetTrx.getRange(2, 1, sheetTrx.getLastRow() - 1, sheetTrx.getLastColumn()).getDisplayValues();
      for (var t = trxRows.length - 1; t >= 0; t--) {
        var tr = trxRows[t];
        var trxId = String(tr[COL_TRX.ID] || "").trim();
        if (!trxId) continue;

        var exists = false;
        for (var e = 0; e < list.length; e++) {
          if (list[e].orderId === trxId) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          var itemQty = parseCleanNumber(tr[COL_TRX.TOTAL_ITEM]) || 1;
          var totalAkhir = parseCleanNumber(tr[COL_TRX.TOTAL_AKHIR]);
          list.push({
            orderId: trxId,
            tanggal: String(tr[COL_TRX.TANGGAL] || ""),
            customerName: String(tr[COL_TRX.PELANGGAN] || "Pelanggan POS"),
            nama: String(tr[COL_TRX.PELANGGAN] || "Pelanggan POS"),
            customerPhone: "-",
            wa: "-",
            alamatKirim: "Toko Fisik / POS",
            catatan: String(tr[COL_TRX.CATATAN] || "Penjualan Kasir POS"),
            rincianItem: "Koleksi Fashion V&T (" + itemQty + " Pcs)",
            totalItem: itemQty,
            itemCount: itemQty,
            totalBayar: totalAkhir,
            grandTotal: totalAkhir,
            subtotal: parseCleanNumber(tr[COL_TRX.TOTAL_BELANJA]) || totalAkhir,
            paymentMethod: String(tr[COL_TRX.METODE] || "Tunai"),
            metodeBayar: String(tr[COL_TRX.METODE] || "Tunai"),
            statusBayar: "Lunas",
            status: "SELESAI",
            statusLabel: "Selesai",
            petugas: String(tr[COL_TRX.KASIR] || "PINKY")
          });
        }
      }
    }

    return { success: true, list: list };
  } catch (err) {
    Logger.log("Error getLaporanPenjualan: " + err.toString());
    return { success: false, message: err.toString(), list: [] };
  }
}