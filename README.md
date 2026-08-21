# Lab Report Generator

A simple, mobile-first web app for creating professional laboratory reports —
replacing the old "edit in Microsoft Word" workflow.

**Workflow:** Enter patient details → Select tests → Enter results → Preview → Print / Save as PDF / Share.

No installation, no login, no database, no server. It's a static website —
open `index.html` in any browser, or host it for free on GitHub Pages.

---

## 1. Running it locally

You can simply double-click `index.html` to open it in your browser — that
works for basic use.

For the most reliable experience (some browsers restrict local file access
slightly), it's better to serve the folder with a tiny local server:

**Option A — VS Code**
Install the "Live Server" extension, right-click `index.html`, choose
"Open with Live Server".

**Option B — Python (if installed)**
```bash
cd lab-report-generator
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option C — Node's `npx serve` (if you have Node installed)**
```bash
cd lab-report-generator
npx serve
```

No build step, no `npm install`, no environment variables are required.

---

## 2. Adding / replacing the letterhead

The app is built so your letterhead never needs to be "edited" inside the
app — it's simply displayed as a fixed header (and optional fixed footer)
around the report content, which is the most reliable way to keep it
looking correct across phones, laptops, printing, and PDF export.

**Steps:**

1. Save your letterhead image as:
   ```
   assets/letterhead.png
   ```
   (PNG or JPG both work — just keep the filename `letterhead.png`, or update
   the `LETTERHEAD_IMAGE_PATH` constant near the top of `js/app.js`.)

2. *(Optional)* If your letterhead design has a separate footer band
   (address strip, accreditation logos, etc.), save it as:
   ```
   assets/letterhead-footer.png
   ```

3. Refresh the app. It automatically detects the image(s) and uses them.
   If no image is found, the app falls back to a clean text-based
   header/footer, so it always works even before you add your letterhead.

**Sizing tips:**
- A wide banner image (roughly matching the width of an A4 page) works best.
- The image is placed at the top of the printable content area and is never
  stretched to distort its aspect ratio.
- The report body content automatically starts below the header and stops
  above the footer — you never need to manually adjust spacing.

---

## 3. Adding or editing tests

All test and parameter definitions live in **one file**:

```
js/test-data.js
```

To add a new test, copy an existing block inside the `TESTS` array and edit
it, for example:

```javascript
{
  id: "vitamin_d",
  name: "Vitamin D Test",
  parameters: [
    {
      id: "vitamin_d_level",
      name: "Vitamin D (25-OH)",
      unit: "ng/mL",
      referenceRanges: {
        default: "30 - 100"
      }
    }
  ]
}
```

Notes:
- `id` values must be unique across the file.
- `referenceRanges` can have `male`, `female`, and/or `default` keys. If a
  gender-specific key is missing, `default` is used automatically.
- Save the file — no other code needs to change. The new test will
  automatically appear in the "Select Tests" screen, generate its own input
  fields in "Enter Results", and appear correctly formatted in the printed
  report.

**Adding age-based reference ranges later:** there is a single function,
`getReferenceRange()`, near the top of `js/test-data.js`, that decides which
range to show. It currently checks gender only. To add age-based logic,
extend that one function (an example is included in its code comments) —
nothing else in the app needs to change.

---

## 4. Deploying to GitHub Pages (free)

1. Create a new GitHub repository (e.g. `lab-report-generator`) and push
   this folder's contents to it:
   ```bash
   cd lab-report-generator
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. On GitHub, open the repository → **Settings** → **Pages**.

3. Under "Build and deployment", set:
   - Source: **Deploy from a branch**
   - Branch: **main**, folder: **/(root)**
   - Click **Save**.

4. Wait a minute, then your app will be live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO/
   ```

5. Open that link on the lab technician's phone and add it to the home
   screen (in the browser's share/menu, choose "Add to Home Screen") so it
   opens like a normal app with one tap.

No further configuration, accounts, or payment is required.

---

## 5. How printing / PDF / sharing work

- **Print** uses the browser's native print dialog (`window.print()`) with
  dedicated print styles, so the app's buttons and navigation are hidden and
  only the clean A4 report is sent to the printer.
- **Save as PDF** opens the same native print dialog — the user picks
  "Save as PDF" (or "Microsoft Print to PDF" on some Windows browsers, or
  "Save to Files" on iPhone) as the destination. This is the most reliable
  cross-browser, no-server way to produce a PDF.
- **Share** uses the phone's native share sheet (Web Share API) where
  supported, so the user can send the report straight into WhatsApp or any
  other app. On browsers that don't support file sharing this way, the app
  shows a short on-screen tip: save as PDF first, then share that saved file
  from the phone's Files app — this is the most dependable path today
  without adding a third-party library.

---

## 6. Project structure

```
lab-report-generator/
│
├── index.html              Single HTML entry point (all "screens" render here)
├── css/
│   └── style.css            All styling, incl. mobile-first layout + print rules
├── js/
│   ├── app.js                App state, screen rendering, report + print/share logic
│   └── test-data.js          Central test/parameter configuration (edit to add tests)
├── assets/
│   ├── letterhead.png        Your header image (add this yourself)
│   ├── letterhead-footer.png Optional footer image (add this yourself)
│   └── README.txt
└── README.md
```

---

## 7. Data privacy note

No patient data is saved anywhere. Everything the technician types exists
only in the browser's memory for that session and disappears when the page
is closed or refreshed. Nothing is sent to any server — the whole app runs
entirely in the browser.
