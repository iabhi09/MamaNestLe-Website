/**
 * MamaNestLe enquiry receiver.
 * Set SPREADSHEET_ID in Project Settings > Script properties.
 * Deploy as a Web App, executing as the owner.
 */
const SHEET_NAME = "Enquiries";
const HEADERS = ["Submitted At", "Name", "Email", "Phone", "Interest", "Message", "Page"];

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    if (String(p.website || "").trim()) return output_({ ok: true });
    const name = clean_(p.name, 100);
    const email = clean_(p.email, 254).toLowerCase();
    const phone = clean_(p.phone, 25);
    const interest = clean_(p.interest, 80);
    const message = clean_(p.message, 1500);
    const page = clean_(p.page, 500);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !interest || p.consent !== "yes") {
      return output_({ ok: false, error: "Please check the required fields." });
    }
    const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    if (!id) throw new Error("Missing SPREADSHEET_ID script property.");
    const ss = SpreadsheetApp.openById(id);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([new Date(), safeCell_(name), safeCell_(email), safeCell_(phone), safeCell_(interest), safeCell_(message), safeCell_(page)]);
    return output_({ ok: true });
  } catch (err) {
    console.error(err);
    return output_({ ok: false, error: "Unable to save enquiry." });
  }
}

function doGet() {
  return ContentService.createTextOutput("MamaNestLe enquiry endpoint is ready.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function clean_(value, max) {
  return String(value || "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}
function safeCell_(value) {
  const s = String(value || "");
  return /^[=+@\-]/.test(s) ? "'" + s : s;
}
function output_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}