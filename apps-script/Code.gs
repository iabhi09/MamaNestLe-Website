/** MamaNestLe private enquiry receiver.
 * Deploy as Web App: Execute as Me; access Anyone.
 * Keep the linked Google Sheet private.
 */
const SHEET_NAME = "Enquiries";
const HEADERS = ["Submitted At (IST)", "Name", "Email", "Interest", "Message", "Source"];

function doPost(e) {
  let ok = false;
  try {
    const p = (e && e.parameter) || {};
    if (String(p.website || "").trim()) return response_(true);
    const name = clean_(p.name, 100);
    const email = clean_(p.email, 254).toLowerCase();
    const interest = clean_(p.interest, 80);
    const message = clean_(p.message, 1200);
    const source = clean_(p.page, 100);
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !interest || p.consent !== "yes") {
      throw new Error("Required fields missing or invalid.");
    }
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    if (!spreadsheetId) throw new Error("Missing SPREADSHEET_ID script property.");
    const ss = SpreadsheetApp.openById(spreadsheetId);
    ss.setSpreadsheetTimeZone("Asia/Kolkata");
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    } else {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }
    const submittedAtIST = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss") + " IST";
    sheet.appendRow([submittedAtIST, safeCell_(name), safeCell_(email), safeCell_(interest), safeCell_(message), safeCell_(source)]);
    ok = true;
  } catch (err) {
    console.error(err);
  }
  return response_(ok);
}

function doGet() {
  return HtmlService.createHtmlOutput("MamaNestLe private enquiry endpoint is ready.");
}

function clean_(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, maxLength);
}

function safeCell_(value) {
  const text = String(value || "");
  return /^[=+@\-]/.test(text) ? "'" + text : text;
}

function response_(success) {
  const html = '<!doctype html><html><body><script>' +
    'window.parent.postMessage({type:"mamanestle-enquiry-response",ok:' + Boolean(success) + '},"*");' +
    '</script><p>Submission processed.</p></body></html>';
  return HtmlService.createHtmlOutput(html);
}
