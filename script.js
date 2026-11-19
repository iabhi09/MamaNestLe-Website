const CONFIG={whatsappNumber:"918178903102",appsScriptUrl:"https://script.google.com/macros/s/AKfycbyUcMkFrvlBovl-OzlwM_b8LYy31I1hR02o_xk17W9XTohWviycXhLEA8vvtJacff2b/exec"};
const menuButton=document.querySelector(".menu-toggle");
const navLinks=document.querySelector(".nav-links");
menuButton?.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));menuButton.setAttribute("aria-label",open?"Close navigation":"Open navigation");menuButton.textContent=open?"×":"☰";});
navLinks?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navLinks.classList.remove("open");menuButton?.setAttribute("aria-expanded","false");if(menuButton){menuButton.textContent="☰";menuButton.setAttribute("aria-label","Open navigation");}}));
const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
const form=document.getElementById("enquiry-form");
const status=document.getElementById("form-status");
const frame=document.getElementById("enquiry-response");
let pending=false;
let acknowledgementTimer=null;
form?.addEventListener("submit",event=>{
 event.preventDefault();
 if(!form.reportValidity()||pending)return;
 if(document.getElementById("website")?.value)return;
 if(!CONFIG.appsScriptUrl||CONFIG.appsScriptUrl.includes("ADD_GOOGLE_APPS_SCRIPT")){
  status.textContent="The private enquiry connection is not activated yet. Please contact us on WhatsApp for now.";
  return;
 }
 pending=true;
 form.classList.add("is-submitting");
 const button=form.querySelector('button[type="submit"]');
 if(button)button.querySelector("span:first-child").textContent="Sending your enquiry…";
 status.textContent="Sending securely to the private MamaNestLe enquiry system…";
 acknowledgementTimer=setTimeout(()=>{
  if(!pending)return;
  pending=false;
  form.classList.remove("is-submitting");
  if(button)button.querySelector("span:first-child").textContent="Send private enquiry";
  status.textContent="Your enquiry may have been received, but confirmation is taking longer than expected. Please check with us on WhatsApp before submitting again.";
 },20000);
 form.submit();
});
window.addEventListener("message",event=>{
 const data=event.data;
 if(!data||data.type!=="mamanestle-enquiry-response"||event.source!==frame?.contentWindow)return;
 if(acknowledgementTimer)clearTimeout(acknowledgementTimer);
 pending=false;
 form?.classList.remove("is-submitting");
 const button=form?.querySelector('button[type="submit"]');
 if(button)button.querySelector("span:first-child").textContent="Send private enquiry";
 if(data.ok){
  status.textContent="Thank you. Your enquiry has been received. Our team will be in touch.";
  form?.reset();
 }else{
  status.textContent="We couldn't save your enquiry just now. Please contact us directly on WhatsApp.";
 }
});
