/**
 * app.js — Kataria Clinical Lab Report Generator
 * Works when opened as a local file (file://) or on GitHub Pages.
 * No external dependencies, no build step, no server needed.
 */

/* ── Lab identity ──────────────────────────────────────────────────── */
const LAB_NAME        = "Kataria Clinical Lab.";
const LAB_ADDRESS     = "9, New Town, Near D.M. College, MOGA-142 001";
const LAB_DISCLAIMER  = "Note: Accuracy of Reports are 95% on the behalf of chemicals.\n*Not valid for medico Legal Purpose.  * Co-relate Clinically.";
const SIGNATORY       = "Technician";
const LETTERHEAD_PATH = "assets/letterhead-header.jpeg";

/* ── App state ─────────────────────────────────────────────────────── */
const state = {
  currentScreen: "home",
  patient: { name: "", age: "", gender: "male", location: "Moga", date: "", referredBy: "" },
  selectedTestIds: [],
  results: {}
};

let lhExists = false;

/* ── Navigation ────────────────────────────────────────────────────── */
const SCREENS = ["home","patient","tests","results","preview"];
function goTo(name) {
  state.currentScreen = name;
  render();
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}
function goBack() { const i = SCREENS.indexOf(state.currentScreen); if (i>0) goTo(SCREENS[i-1]); }

/* ── Render ────────────────────────────────────────────────────────── */
function render() {
  const root = document.getElementById("app");
  const hdr = state.currentScreen === "home" ? "" : `
    <header class="app-header no-print">
      <button class="back-btn" id="btnBack">&#8592;</button>
      <div>
        <div class="app-hdr-title">${{patient:"Patient Details",tests:"Select Tests",results:"Enter Results",preview:"Report Preview"}[state.currentScreen]}</div>
        <div class="app-hdr-sub">${LAB_NAME}</div>
      </div>
    </header>`;
  root.innerHTML = hdr + {home:renderHome,patient:renderPatient,tests:renderTests,results:renderResults,preview:renderPreview}[state.currentScreen]();
  wire();
}

/* ── Screen 1: Home ────────────────────────────────────────────────── */
function renderHome() {
  const logo = lhExists
    ? `<img class="home-lh" src="${LETTERHEAD_PATH}" alt="${LAB_NAME}">`
    : `<div class="home-drop"></div>`;
  return `
    <div class="screen home-screen">
      ${logo}
      <p class="home-tagline">Create, print or share a laboratory report.</p>
      <button class="btn btn-primary btn-create" id="btnCreate">+ &nbsp;Create New Report</button>
    </div>`;
}

/* ── Screen 2: Patient Details ─────────────────────────────────────── */
function renderPatient() {
  const p = state.patient;
  if (!p.date) p.date = todayISO();
  return `
    <div class="screen">
      <div class="step-lbl">Step 1 of 3</div>
      <h2 class="screen-title">Patient Details</h2>
      <p class="screen-sub">Enter the patient's information for this report.</p>

      <div class="field-group">
        <label for="fName">Patient Name</label>
        <input type="text" id="fName" placeholder="e.g. Rajiv Sharma" value="${ea(p.name)}" autocomplete="off">
      </div>

      <div class="field-row">
        <div class="field-group">
          <label for="fAge">Age</label>
          <input type="text" id="fAge" inputmode="text" placeholder="e.g. 45 Y" value="${ea(p.age)}">
        </div>
        <div class="field-group">
          <label>Gender</label>
          <div class="gender-toggle" id="gToggle">
            <button type="button" data-g="male"   class="${p.gender==="male"  ?"on":""}">Male</button>
            <button type="button" data-g="female" class="${p.gender==="female"?"on":""}">Female</button>
            <button type="button" data-g="other"  class="${p.gender==="other" ?"on":""}">Other</button>
          </div>
        </div>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label for="fDate">Report Date</label>
          <input type="date" id="fDate" value="${ea(p.date)}">
        </div>
        <div class="field-group">
          <label for="fLoc">Location</label>
          <input type="text" id="fLoc" placeholder="e.g. Moga" value="${ea(p.location)}" autocomplete="off">
        </div>
      </div>

      <div class="field-group">
        <label for="fRef">Referred By (optional)</label>
        <input type="text" id="fRef" placeholder="e.g. Dr. Karan Sharma" value="${ea(p.referredBy)}" autocomplete="off">
      </div>
    </div>
    <div class="bottom-bar no-print">
      <button class="btn btn-primary btn-block" id="btnToTests">Next: Select Tests &#8594;</button>
    </div>`;
}

function savePatient() {
  const p = state.patient;
  p.name      = gv("fName");
  p.age       = gv("fAge");
  p.date      = gv("fDate") || todayISO();
  p.location  = gv("fLoc");
  p.referredBy= gv("fRef");
}

/* ── Screen 3: Select Tests ────────────────────────────────────────── */
function renderTests() {
  const cards = TESTS.map(t => {
    const on = state.selectedTestIds.includes(t.id);
    return `
      <div class="test-card${on?" sel":""}" data-id="${t.id}">
        <div class="chk">&#10003;</div>
        <div>
          <div class="t-name">${t.name}</div>
          <div class="t-meta">${t.parameters.length} parameter${t.parameters.length!==1?"s":""}</div>
        </div>
      </div>`;
  }).join("");
  const n = state.selectedTestIds.length;
  return `
    <div class="screen">
      <div class="step-lbl">Step 2 of 3</div>
      <h2 class="screen-title">Select Tests</h2>
      <p class="screen-sub">Tap one or more tests to include in the report.</p>
      <div class="test-list">${cards}</div>
      <p class="sel-count">${n===0?"No tests selected yet":`${n} test${n!==1?"s":""} selected`}</p>
    </div>
    <div class="bottom-bar no-print">
      <button class="btn btn-secondary btn-sm-sq" id="btnBkPt">&#8592;</button>
      <button class="btn btn-primary btn-block" id="btnToRes"${n===0?" disabled":""}>Next: Enter Results &#8594;</button>
    </div>`;
}

/* ── Screen 4: Enter Results ───────────────────────────────────────── */
function renderResults() {
  const sel = TESTS.filter(t => state.selectedTestIds.includes(t.id));
  const blocks = sel.map(test => {
    const rows = test.parameters.map(param => {
      const range = getReferenceRange(param, state.patient);
      const val   = (state.results[test.id]||{})[param.id]||"";
      return `
        <div class="param-row">
          <div class="param-name">${param.name}${param.unit?` <span class="param-unit-note">(${param.unit})</span>`:""}</div>
          <div class="param-inp-row">
            <input type="text" inputmode="text" placeholder="Result"
              data-tid="${test.id}" data-pid="${param.id}" class="pinput" value="${ea(val)}">
          </div>
          ${range?`<div class="param-hint">Normal: <strong>${range}</strong></div>`:""}
        </div>`;
    }).join("");
    return `
      <div class="res-block">
        <div class="res-hdr">${test.name}</div>
        ${rows}
      </div>`;
  }).join("");
  return `
    <div class="screen">
      <div class="step-lbl">Step 3 of 3</div>
      <h2 class="screen-title">Enter Results</h2>
      <p class="screen-sub">Leave blank any tests you don't want in the report.</p>
      ${blocks}
    </div>
    <div class="bottom-bar no-print">
      <button class="btn btn-secondary btn-sm-sq" id="btnBkTs">&#8592;</button>
      <button class="btn btn-primary btn-block" id="btnPrev">Preview Report &#8594;</button>
    </div>`;
}

function saveResults() {
  document.querySelectorAll(".pinput").forEach(inp => {
    const tid = inp.getAttribute("data-tid"), pid = inp.getAttribute("data-pid");
    if (!state.results[tid]) state.results[tid] = {};
    state.results[tid][pid] = inp.value;
  });
}

/* ── Screen 5: Preview ─────────────────────────────────────────────── */
function renderPreview() {
  /* Compute the scaled height of the A4 page so the scaler wrapper
     reserves exactly the right vertical space — prevents the report
     from causing any horizontal or vertical overflow in the app. */
  return `
    <div class="screen preview-wrap">
      <p class="scroll-hint no-print">Preview — exactly how your report will print.</p>
      <div class="zoom-bar no-print">
        <button id="zOut">&#8722;</button>
        <span id="zoomLabel" class="zoom-label">Zoom</span>
        <button id="zIn">&#43;</button>
      </div>
      <div class="page-outer" id="pageOuter">
        <div class="page-scaler" id="pageScaler">
          <div class="page" id="reportPage">
            ${buildReport()}
          </div>
        </div>
      </div>
      <div class="act-bar no-print">
        <button class="btn btn-secondary btn-wide" id="btnEdit">&#9998; Edit</button>
        <button class="btn btn-primary" id="btnPrint">&#128424; Print</button>
        <button class="btn btn-primary" id="btnPdf">&#128190; Save PDF</button>
        <button class="btn btn-primary" id="btnSharePdf">&#128257; Share PDF</button>
        <button class="btn btn-primary" id="btnShareJpeg">&#128257; Share JPEG</button>
      </div>
    </div>`;
}

/* ── Build the printable report ─────────────────────────────────────── */
/*
 * ONE <table> so <thead>/<tfoot> repeat on every printed page.
 *
 * Flagging note: we deliberately do NOT add any CSS class or inline
 * colour to out-of-range values. Colour-based flagging is unreliable
 * across browsers/print drivers — some print it, some don't, and
 * cached old CSS causes stale colours. Instead, out-of-range values
 * have " H" or " L" appended so the flag is always visible in plain
 * black text, which is also standard on clinical lab reports.
 */
function buildReport() {
  const p      = state.patient;
  const sel    = TESTS.filter(t => state.selectedTestIds.includes(t.id));
  const ageSex = `${eh(p.age)||"-"} / ${p.gender==="female"?"F":p.gender==="other"?"O":"M"}`;

  /* ---- patient info block ---- */
  const patientHTML = `
    <div class="rpt-patient">
      <div class="rpt-pt-left">
        <div class="rpt-pt-row"><span class="rpt-pt-lbl">Name :-</span><span class="rpt-pt-val">${eh(p.name)||"-"}</span></div>
        <div class="rpt-pt-row"><span class="rpt-pt-lbl">Add. :-</span><span class="rpt-pt-val">${eh(p.location)||"Moga"}</span></div>
      </div>
      <div class="rpt-pt-right">
        <div class="rpt-pt-row"><span class="rpt-pt-lbl">Date:-</span><span class="rpt-pt-val">${fmtDate(p.date)}</span></div>
        <div class="rpt-pt-row"><span class="rpt-pt-lbl">Age/Sex :-</span><span class="rpt-pt-val">${ageSex}</span></div>
        <div class="rpt-pt-row"><span class="rpt-pt-lbl">Ref. By :-</span><span class="rpt-pt-val">${eh(p.referredBy)||""}</span></div>
      </div>
    </div>`;

  /* ---- test sections ---- */
  let colHdrShown = false;

  const testGroups = sel.map((test, idx) => {
    /* Only rows with a value entered */
    const filledRows = test.parameters
      .map(param => {
        const val = ((state.results[test.id]||{})[param.id]||"").trim();
        if (!val) return null;

        const range = getReferenceRange(param, state.patient);
        const nval  = range
          ? (param.unit && !range.includes(param.unit) ? range + " " + param.unit : range)
          : "";

        /* H / L suffix instead of colour — works reliably in all print modes */
        const n = parseFloat(val);
        let marker = "";
        if (!isNaN(n) && range) {
          const m = range.match(/^([\d.]+)\s*[-–]\s*([\d.]+)/);
          if (m) {
            if (n < parseFloat(m[1])) marker = " L";
            else if (n > parseFloat(m[2])) marker = " H";
          } else if (/^<\s*([\d.]+)/.test(range) && n >= parseFloat(range.match(/^<\s*([\d.]+)/)[1])) {
            marker = " H";
          } else if (/^>\s*([\d.]+)/.test(range) && n <= parseFloat(range.match(/^>\s*([\d.]+)/)[1])) {
            marker = " L";
          }
        }

        /* bold only if out of range, normal weight otherwise */
        return `
          <tr class="rpt-row">
            <td class="rpt-col-test">${eh(param.name)}</td>
            <td class="rpt-col-val${marker?" rpt-abnormal":""}">${eh(val)}${marker}</td>
            <td class="rpt-col-nval">${eh(nval)}</td>
          </tr>`;
      })
      .filter(Boolean);

    if (filledRows.length === 0) return "";

    const gapRow    = (idx > 0 && colHdrShown) ? `<tr class="rpt-gap"><td colspan="3"></td></tr>` : "";
    const colHdrRow = !colHdrShown
      ? `<tr class="rpt-col-hdr"><td>Test</td><td>Value</td><td>N.Value</td></tr>`
      : "";
    colHdrShown = true;

    return `
      <tbody>
        ${gapRow}
        <tr class="rpt-test-name"><td></td><td>${eh(test.name)}</td><td></td></tr>
        ${colHdrRow}
        ${filledRows.join("")}
      </tbody>`;
  }).join("");

  /*
   * Layout: flex column div, min-height = one A4 page (297mm).
   * rpt-body grows to fill available space (flex:1).
   * rpt-bottom has margin-top:auto so it always sits at the bottom
   * of the page regardless of how much content is above it.
   * This is simpler and more reliable than CSS table height tricks.
   */
  return `
    <div class="rpt-page">

      <div class="rpt-header">
        ${lhExists
          ? `<img class="rpt-lh-img" src="${LETTERHEAD_PATH}" alt="${LAB_NAME}">`
          : builtInLetterhead()}
        <div class="rpt-lh-sep"></div>
        ${patientHTML}
        <div class="rpt-lh-sep2"></div>
      </div>

      <div class="rpt-body">
        <table class="rpt-master">
          <colgroup>
            <col style="width:44%"><col style="width:22%"><col style="width:34%">
          </colgroup>
          ${testGroups}
        </table>
      </div>

      <div class="rpt-bottom">
        <div class="rpt-sig-line">${SIGNATORY}</div>
        <div class="rpt-footer-rule"></div>
        <div class="rpt-disclaimer">${LAB_DISCLAIMER.replace(/\n/g,"<br>")}</div>
      </div>

    </div>`;
}

/* ── Built-in letterhead (when no image is present) ───────────────── */
function builtInLetterhead() {
  return `
    <div class="rpt-lh-builtin">
      <div class="lhb-left">
        <div class="lhb-motto">JAI MATA DI</div>
        <div class="lhb-comp">COMPUTERISED</div>
        <div class="lhb-since">SERVING SINCE - 1996</div>
      </div>
      <div class="lhb-centre">
        <div class="lhb-name">Kataria Clinical Lab.</div>
        <div class="lhb-addr">9, New Town, Near D.M. College, MOGA-142 001</div>
      </div>
      <div class="lhb-right">
        <div class="lhb-phone">&#9990; 230166 (O), 222877 (R)</div>
        <div class="lhb-phone">Mob.: 99150-09166</div>
      </div>
    </div>`;
}

/* ── Actions ───────────────────────────────────────────────────────── */

/* Sets document.title to the desired PDF filename before printing.
   Browsers use the page title as the default "Save as PDF" filename. */
function getPdfTitle() {
  const name = (state.patient.name || "Report").trim().replace(/\s+/g, "_");
  return `${name}_Kataria_Clinical_Lab`;
}

function doPrint() {
  const prev = document.title;
  document.title = getPdfTitle();
  window.print();
  // Restore title after print dialog closes (small delay for Safari)
  setTimeout(() => { document.title = prev; }, 2000);
}

function doPdf() {
  const prev = document.title;
  document.title = getPdfTitle();
  showToast('Choose "Save as PDF" in the print dialog.');
  setTimeout(() => {
    window.print();
    setTimeout(() => { document.title = prev; }, 2000);
  }, 300);
}

/* ── Shared canvas capture ─────────────────────────────────────────── */
async function captureReportCanvas() {
  await waitForLibs();
  const reportEl = document.getElementById("reportPage");
  const outer    = document.getElementById("pageOuter");
  const scaler   = document.getElementById("pageScaler");
  const prevScale = parseFloat(getComputedStyle(outer).getPropertyValue("--scale")) || 0.4;

  /* Scale to 1 so html2canvas captures full A4 resolution */
  outer.style.setProperty("--scale", 1);
  scaler.style.width  = "794px";
  scaler.style.height = "1123px";
  await new Promise(r => setTimeout(r, 80));

  const canvas = await html2canvas(reportEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    width: 794,
    height: 1123,
    windowWidth: 794,
    logging: false
  });

  applyScale(prevScale);
  return canvas;
}

/* ── Share as PDF ──────────────────────────────────────────────────── */
async function doSharePdf() {
  const p = state.patient;
  if (!navigator.share) {
    showToast('Tap "Save PDF", then share the file from your Files/Downloads app.');
    return;
  }
  try {
    showToast("Generating PDF…");
    const canvas = await captureReportCanvas();

    const { jsPDF } = window.jspdf;
    const pdf  = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);

    const blob  = pdf.output("blob");
    const fname = getPdfTitle() + ".pdf";
    const file  = new File([blob], fname, { type: "application/pdf" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: `Lab Report – ${p.name || "Patient"}`, files: [file] });
    } else {
      /* Fallback: trigger direct download */
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: url, download: fname });
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      showToast("PDF downloaded — share it from your Files app.");
    }
  } catch(e) {
    if (e.name === "AbortError") return;
    console.error("Share PDF error:", e);
    showToast('Could not generate PDF. Use "Save PDF" button instead.');
  }
}

/* ── Share as JPEG ─────────────────────────────────────────────────── */
async function doShareJpeg() {
  const p = state.patient;
  if (!navigator.share) {
    showToast("Sharing not supported on this browser.");
    return;
  }
  try {
    showToast("Generating image…");
    const canvas = await captureReportCanvas();

    const blob  = await new Promise(res => canvas.toBlob(res, "image/jpeg", 0.92));
    const fname = getPdfTitle() + ".jpg";
    const file  = new File([blob], fname, { type: "image/jpeg" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: `Lab Report – ${p.name || "Patient"}`, files: [file] });
    } else {
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: url, download: fname });
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      showToast("Image downloaded — share it from your Files app.");
    }
  } catch(e) {
    if (e.name === "AbortError") return;
    console.error("Share JPEG error:", e);
    showToast("Could not generate image.");
  }
}

/* ── Zoom — updates CSS custom property and scaler dimensions ──────── */
const A4_W_MM = 210;
const A4_H_MM = 297;
const MM_PX   = 3.7795; // 1mm ≈ 3.78 CSS px at 96dpi

function getDefaultScale() {
  /* Pick a scale so the 210mm page fits inside the viewport width
     with a small margin. Recalculated each time in case window resized. */
  const availW = Math.min(window.innerWidth, 680) - 28; // 14px padding each side
  return Math.min(0.9, availW / (A4_W_MM * MM_PX));
}

function applyScale(scale) {
  const outer  = document.getElementById("pageOuter");
  const scaler = document.getElementById("pageScaler");
  const label  = document.getElementById("zoomLabel");
  if (!outer || !scaler) return;

  scale = Math.min(1.0, Math.max(0.20, scale));
  outer.style.setProperty("--scale", scale);

  /* Set the scaler wrapper to exactly the scaled A4 dimensions so it
     occupies the right space and causes NO overflow in either direction */
  const scaledW = A4_W_MM * MM_PX * scale;
  const scaledH = A4_H_MM * MM_PX * scale;
  scaler.style.width  = scaledW + "px";
  scaler.style.height = scaledH + "px";

  if (label) label.textContent = Math.round(scale * 100) + "%";
}

function setZoom(delta) {
  const outer = document.getElementById("pageOuter");
  if (!outer) return;
  const cur = parseFloat(getComputedStyle(outer).getPropertyValue("--scale")) || getDefaultScale();
  applyScale(cur + delta);
}

/* ── Event wiring ──────────────────────────────────────────────────── */
function wire() {
  const $ = id => document.getElementById(id);
  const back = $("btnBack");
  if (back) back.addEventListener("click", goBack);

  switch (state.currentScreen) {
    case "home":
      $("btnCreate").addEventListener("click", () => goTo("patient"));
      break;

    case "patient":
      $("gToggle").addEventListener("click", e => {
        const b = e.target.closest("[data-g]"); if (!b) return;
        state.patient.gender = b.getAttribute("data-g");
        document.querySelectorAll("#gToggle button").forEach(x => x.classList.remove("on"));
        b.classList.add("on");
      });
      $("btnToTests").addEventListener("click", () => { savePatient(); goTo("tests"); });
      break;

    case "tests":
      document.querySelectorAll(".test-card").forEach(c => {
        c.addEventListener("click", () => {
          const id = c.getAttribute("data-id");
          const i  = state.selectedTestIds.indexOf(id);
          i === -1 ? state.selectedTestIds.push(id) : state.selectedTestIds.splice(i, 1);
          render();
        });
      });
      $("btnBkPt").addEventListener("click", () => goTo("patient"));
      const nr = $("btnToRes");
      if (nr && !nr.disabled) nr.addEventListener("click", () => goTo("results"));
      break;

    case "results":
      document.querySelectorAll(".pinput").forEach(inp => {
        inp.addEventListener("input", () => {
          const tid = inp.getAttribute("data-tid"), pid = inp.getAttribute("data-pid");
          if (!state.results[tid]) state.results[tid] = {};
          state.results[tid][pid] = inp.value;
        });
      });
      $("btnBkTs").addEventListener("click", () => { saveResults(); goTo("tests"); });
      $("btnPrev").addEventListener("click",  () => { saveResults(); goTo("preview"); });
      break;

    case "preview":
      loadShareLibs();   // start loading jsPDF + html2canvas in background
      $("btnEdit").addEventListener("click",      () => goTo("results"));
      $("btnPrint").addEventListener("click",     doPrint);
      $("btnPdf").addEventListener("click",       doPdf);
      $("btnSharePdf").addEventListener("click",  doSharePdf);
      $("btnShareJpeg").addEventListener("click", doShareJpeg);
      $("zIn").addEventListener("click",  () => setZoom( 0.05));
      $("zOut").addEventListener("click", () => setZoom(-0.05));

      /* Apply the default scale after the DOM is ready */
      requestAnimationFrame(() => applyScale(getDefaultScale()));
      break;
  }
}

/* ── Utilities ─────────────────────────────────────────────────────── */
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function fmtDate(iso) {
  if (!iso) return "-";
  const [y,m,d] = iso.split("-");
  return `${d}-${m}-${y}`;
}
function eh(s)  { return (s==null?"":String(s)).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function ea(s)  { return eh(s).replace(/"/g,"&quot;"); }
function gv(id) { const e = document.getElementById(id); return e ? e.value.trim() : ""; }

let _tt;
function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast no-print"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(_tt); _tt = setTimeout(() => t.classList.remove("show"), 3500);
}

/* ── Init ──────────────────────────────────────────────────────────── */
function init() {
  state.patient.date = todayISO();
  render();
  const img = new Image();
  img.onload  = () => { lhExists = true; if (["home","preview"].includes(state.currentScreen)) render(); };
  img.onerror = () => {};
  img.src = LETTERHEAD_PATH;
}
document.addEventListener("DOMContentLoaded", init);

/* Wait until both html2canvas and jsPDF are loaded */
function waitForLibs() {
  return new Promise(resolve => {
    const check = () => (window.html2canvas && window.jspdf) ? resolve() : setTimeout(check, 100);
    check();
  });
}

/* Load html2canvas + jsPDF lazily when the preview screen opens */
function loadShareLibs() {
  function loadScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement("script");
    s.src = src; s.async = true;
    document.head.appendChild(s);
  }
  loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
  loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
}
