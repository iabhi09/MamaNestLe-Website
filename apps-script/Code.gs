/** MamaNestLe private enquiry receiver.
 * Deploy as Web App: Execute as Me; access Anyone.
 * Set SPREADSHEET_ID in Script Properties. Keep the Sheet private.
 */
const SHEET_NAME="Enquiries";
const HEADERS=["Submitted At","Name","Email","Interest","Message","Source"];
function doPost(e){
 let ok=false;
 try{
  const p=(e&&e.parameter)||{};
  if(String(p.website||"").trim()) return response_(true);
  const name=clean_(p.name,100);
  const email=clean_(p.email,254).toLowerCase();
  const interest=clean_(p.interest,80);
  const message=clean_(p.message,1200);
  const consent=p.consent==="yes";
  if(!name||!email||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)||!interest||!consent) throw new Error("Required fields missing or invalid.");
  const id=PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if(!id) throw new Error("Missing SPREADSHEET_ID script property.");
  const ss=SpreadsheetApp.openById(id);
  let sheet=ss.getSheetByName(SHEET_NAME);
  if(!sheet) sheet=ss.insertSheet(SHEET_NAME);
  if(sheet.getLastRow()===0){sheet.appendRow(HEADERS);sheet.setFrozenRows(1);}
  sheet.appendRow([new Date(),safeCell_(name),safeCell_(email),safeCell_(interest),safeCell_(message),safeCell_(clean_(p.page,100))]);
  ok=true;
 }catch(err){console.error(err);}
 return response_(ok);
}
function doGet(){return HtmlService.createHtmlOutput("MamaNestLe private enquiry endpoint is ready.");}
function clean_(v,max){return String(v||"").replace(/[\\u0000-\\u001F\\u007F]/g," ").trim().slice(0,max);}
function safeCell_(v){const s=String(v||"");return /^[=+@\\-]/.test(s)?"'"+s:s;}
function response_(ok){
 return HtmlService.createHtmlOutput('<!doctype html><html><body><script>window.parent.postMessage({type:"mamanestle-enquiry-response",ok:'+Boolean(ok)+'},"*");</script><p>Submission processed.</p></body></html>');
}