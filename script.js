// MamaNestLe website configuration. Replace these placeholders after setup.
const CONFIG = {
  googleScriptUrl: "ADD_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
  whatsappNumber: "918178903102" // international digits only, e.g. 91XXXXXXXXXX
};

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuButton?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuButton.textContent = open ? "×" : "☰";
});
navLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  if (menuButton) { menuButton.textContent = "☰"; menuButton.setAttribute("aria-label", "Open navigation"); }
}));
document.getElementById("year").textContent = new Date().getFullYear();

const waLink = document.getElementById("whatsapp-link");
const waHint = document.getElementById("whatsapp-hint");
if (/^\d{10,15}$/.test(CONFIG.whatsappNumber)) {
  waLink.href = "https://wa.me/" + CONFIG.whatsappNumber;
  waLink.hidden = false;
  waHint.hidden = true;
}

const form = document.getElementById("enquiry-form");
const status = document.getElementById("form-status");
const submit = form.querySelector('button[type="submit"]');
form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (document.getElementById("website").value) return;
  if (CONFIG.googleScriptUrl.includes("ADD_GOOGLE_APPS_SCRIPT")) {
    status.textContent = "The enquiry form is designed, but its private Google Sheets connection has not been configured yet. Please contact us after setup.";
    status.className = "form-status error";
    return;
  }
  const data = new FormData(form);
  const payload = new URLSearchParams();
  ["name", "email", "phone", "interest", "message", "website"].forEach(key => payload.set(key, String(data.get(key) || "").trim()));
  payload.set("page", window.location.href);
  payload.set("consent", document.getElementById("consent").checked ? "yes" : "no");
  submit.disabled = true;
  submit.textContent = "Sending…";
  status.textContent = "Sending your enquiry…";
  status.className = "form-status";
  try {
    // no-cors prevents reading Google's response; confirm receipt by checking the private Sheet.
    await fetch(CONFIG.googleScriptUrl, { method: "POST", mode: "no-cors", body: payload });
    form.reset();
    status.textContent = "Thank you. Your enquiry has been submitted. If it doesn't appear in the enquiry sheet, please contact us directly.";
    status.className = "form-status success";
  } catch (error) {
    status.textContent = "We couldn't submit the form. Please try again later or contact us directly.";
    status.className = "form-status error";
  } finally {
    submit.disabled = false;
    submit.innerHTML = 'Send enquiry <span>↗</span>';
  }
});