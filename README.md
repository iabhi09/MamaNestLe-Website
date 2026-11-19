# MamaNestLe — public website

A mobile-first static website for the emerging MamaNestLe maternal-wellness initiative.

## Files
- `index.html` — website content and enquiry form
- `styles.css` — responsive visual design
- `script.js` — navigation, form handling and WhatsApp configuration
- `apps-script/Code.gs` — Google Apps Script enquiry receiver

## 1. Publish with GitHub Pages
1. Open this repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**, then Save.
5. Wait for the deployment and open the URL GitHub Pages displays. Expected URL: https://iabhi09.github.io/MamaNestLe-Website/

## 2. Connect the private Google Sheet
1. Create a Google Sheet. Keep it private and share it only with authorised MamaNestLe administrators.
2. Copy the spreadsheet ID from its URL (the text between `/d/` and `/edit`).
3. Open **Extensions → Apps Script**.
4. Replace the editor contents with `apps-script/Code.gs` from this repository and Save.
5. In Apps Script, open **Project Settings → Script properties → Add script property**.
   - Property: `SPREADSHEET_ID`
   - Value: your spreadsheet ID
6. Choose **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone** (required for public website visitors; this makes the endpoint publicly callable, so validate inputs and monitor spam)
7. Deploy, complete Google's authorisation flow, and copy the Web app URL ending in `/exec`.
8. In `script.js`, replace `ADD_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL and commit the change.
9. Submit a test enquiry and confirm a row appears in the private sheet. The browser uses `no-cors`, so its success message cannot independently verify the sheet write.

The script creates an `Enquiries` tab and headings automatically on the first submission.

## 3. Configure WhatsApp
In `script.js`, replace `ADD_WHATSAPP_BUSINESS_NUMBER_HERE` with the WhatsApp Business number in international digits-only format, e.g. India numbers start with `91`. Do not include +, spaces or hyphens. Commit the change.

## Privacy and safety
- Do not collect diagnoses, medical records, pregnancy details or other sensitive health information through this public enquiry form.
- Keep the Sheet private and restrict administrator access.
- The Apps Script web app is publicly callable. The form includes basic validation and a honeypot, but this is not enterprise-grade abuse protection. Monitor submissions and consider stronger rate-limiting or CAPTCHA before significant traffic.
- The website is informational and does not provide medical advice, diagnosis or treatment.
- Add a complete privacy policy after reviewing actual data handling, retention, contact details and applicable legal obligations.
- No clinical service, professional credential or institutional partnership is represented as currently available.

## Local preview
Open `index.html` in a browser. Google Fonts requires an internet connection. Form submissions remain disabled until the Apps Script URL is configured.
