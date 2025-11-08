// Code.gs
const SHEET_ID = 'BURAYA_SHEET_ID_YI_YAPISTIR'; // Google Sheet ID
const ADMIN_USERNAME = 'admin'; // admin kullanıcı adı (istersen değiştir)
const ADMIN_PASSWORD = 'adminpass'; // admin şifresi (değiştir)

// Basit kullanıcı listesi: kullanıcıAdı -> şifre
// SENİN VERECEĞİN İSİM VE ŞİFRELERİ BURAYA EKLE
const USERS = {
  'ogrenci1': 'sifre1',
  'ogrenci2': 'sifre2',
  // örnek: 'ali': '1234'
};

// Konular listesi (isteğe göre genişlet)
const SUBJECTS = ['Türkçe','Matematik','Fen','Sosyal'];

// Web app entry
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Öğrenci Günlük Takip');
}

// ----------------- Sunucu fonksiyonları, istemciden çağrılacak -----------------

/**
 * Basit login kontrolü.
 * role: 'student' veya 'admin'
 */
function login(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return { ok: true, role: 'admin' };
  }
  if (USERS[username] && USERS[username] === password) {
    return { ok: true, role: 'student' };
  }
  return { ok: false, error: 'Geçersiz kullanıcı / şifre' };
}

/**
 * Öğrenci için sheet adını döndür (varsa), yoksa oluşturur.
 */
function ensureStudentSheet(username) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(username);
  if (!sheet) {
    sheet = ss.insertSheet(username);
    // Başlık satırı
    sheet.appendRow(['Tarih','Ders','Çözülen','Yanlış','Not']);
  }
  return sheet.getName();
}

/**
 * Kayıt ekle (öğrenci tarafından)
 */
function addEntry(username, subject, solved, wrong, note) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  // öğrenci sekmesini hazırla
  const sheetName = ensureStudentSheet(username);
  const sheet = ss.getSheetByName(sheetName);
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  sheet.appendRow([today, subject, Number(solved), Number(wrong), note || '']);
  return { ok: true };
}

/**
 * Admin için toplu döküm: her öğrenci için toplam çözülen ve toplam yanlış
 * Ayrıca günlük özet (tarih bazlı) üretir.
 */
function getAggregateReport() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheets = ss.getSheets();
  const report = [];
  sheets.forEach(sheet => {
    const name = sheet.getName();
    // atla eğer sistem sheet'i (isteğe göre)
    if (name === 'Sheet1' || name === '') return;
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      report.push({ username: name, totalSolved: 0, totalWrong: 0, perSubject: {} });
      return;
    }
    // header: Tarih, Ders, Çözülen, Yanlış, Not
    let totalSolved = 0;
    let totalWrong = 0;
    const perSubject = {};
    for (let i=1;i<values.length;i++){
      const row = values[i];
      const subject = row[1] || 'Bilinmiyor';
      const solved = Number(row[2] || 0);
      const wrong = Number(row[3] || 0);
      totalSolved += solved;
      totalWrong += wrong;
      if (!perSubject[subject]) perSubject[subject] = { solved: 0, wrong: 0 };
      perSubject[subject].solved += solved;
      perSubject[subject].wrong += wrong;
    }
    report.push({ username: name, totalSolved, totalWrong, perSubject });
  });
  return report;
}

/**
 * Öğrencinin kendi geçmişini getir (satır satır)
 */
function getStudentHistory(username) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(username);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  // dönüş: array of objects (skip header)
  const out = [];
  for (let i=1;i<values.length;i++){
    const r = values[i];
    out.push({ date: r[0], subject: r[1], solved: r[2], wrong: r[3], note: r[4] });
  }
  return out;
}

/**
 * Yönetici için CSV indirilebilir format (isteğe bağlı)
 */
function exportAggregateCSV() {
  const report = getAggregateReport();
  // Basit CSV: kullanıcı,toplamÇözülen,toplamYanlış
  let csv = 'Kullanıcı,ToplamÇözülen,ToplamYanlış\n';
  report.forEach(r => {
    csv += `${r.username},${r.totalSolved},${r.totalWrong}\n`;
  });
  return csv;
}
