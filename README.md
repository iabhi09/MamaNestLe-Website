# MamaNestLe — public website

Luxury editorial maternal-wellness website, hosted on GitHub Pages.

## Website files
- `index.html` — homepage and enquiry form
- `styles.css` — responsive design and theme
- `script.js` — navigation and private enquiry submission
- `privacy.html` — privacy and important information
- `apps-script/Code.gs` — private Google Sheet receiver

## Activate the private enquiry database
1. Sign in to the Google account that should own MamaNestLe's enquiry records.
2. Create a new Google Sheet named **MamaNestLe — Private Enquiries**. Do not make it public.
3. In the Sheet, open **Extensions → Apps Script**.
4. Replace the editor contents with `apps-script/Code.gs` from this repository and save.
5. In Apps Script **Project Settings → Script properties**, add:
   - `SPREADSHEET_ID` = the ID between `/d/` and `/edit` in your Sheet URL.
6. Choose **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Authorise the script and deploy. Copy the Web app URL ending in `/exec`.
8. In `script.js`, replace `ADD_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the URL. Commit the change.
9. Submit a test enquiry and confirm it appears in the private `Enquiries` tab.

The public endpoint must be callable by website visitors. The Sheet itself must remain private. The script validates required fields, includes a honeypot and protects against spreadsheet formula injection. Monitor spam and restrict Sheet access.

## Enquiry journey
Website form → private Google Sheet → on-page confirmation.
WhatsApp remains a separate optional contact channel.

## Privacy
Do not request or collect medical records, diagnoses, identity documents or detailed sensitive health information through this introductory enquiry form. The website is informational and does not provide medical advice, diagnosis or treatment. Review the privacy page as the data process evolves.

## GitHub Pages
Repository: https://github.com/iabhi09/MamaNestLe-Website
Expected site: https://iabhi09.github.io/MamaNestLe-Website/
