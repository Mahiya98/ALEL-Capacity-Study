// ====== CONFIG ======
const SHEET_ID = "1GpALH7TsJ0eW-Ko8ejzV8oQF073dhe7Eb9930o0qvSo";
const ALL_TABS_SHEET_NAME = "all tabs name";
// ====================

const SHEET_BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit#gid=`;

async function loadTabs() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(ALL_TABS_SHEET_NAME)}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    // gviz wraps JSON inside callback text; extract the JSON
    const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));
    const rows = json.table.rows || [];

    // Read Column A (name) and Column B (gid)
    const tabs = rows
      .map(r => {
        const name = r.c[0] && r.c[0].v ? String(r.c[0].v).trim() : "";
        const gid  = r.c[1] && r.c[1].v != null ? String(r.c[1].v).trim() : "";
        return { name, gid };
      })
      .filter(t => t.name && t.name.toLowerCase() !== ALL_TABS_SHEET_NAME.toLowerCase());

    if (tabs.length === 0) {
      showError("No tab names found in 'all tabs name' (Column A). Make sure the sheet is shared as 'Anyone with the link'.");
      return;
    }

    renderButtons(tabs);
  } catch (err) {
    console.error(err);
    showError("Failed to load tabs. Make sure the sheet is shared publicly (Anyone with the link → Viewer).");
  }
}

function renderButtons(tabs) {
  const container = document.getElementById("buttons");
  container.innerHTML = "";

  tabs.forEach(tab => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.textContent = tab.name;
    btn.addEventListener("click", () => openTab(tab));
    container.appendChild(btn);
  });
}

function openTab(tab) {
  // If gid is provided, open directly; otherwise open the sheet (first tab)
  const url = tab.gid
    ? `${SHEET_BASE_URL}${tab.gid}`
    : `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
  window.open(url, "_blank");
}

function showError(msg) {
  document.getElementById("buttons").innerHTML = `<p class="error">⚠️ ${msg}</p>`;
}

loadTabs();
