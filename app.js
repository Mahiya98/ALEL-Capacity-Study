// Paste your Google Apps Script Web App URL here:
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwYuMm44VkQ1LDuuHZ7iOrw3j9lle53lZsxFS5IgFwf-gg0qt6Z73ZUGq9uS-q0-YI4Uw/exec";

const SHEET_ID = "1GpALH7TsJ0eW-Ko8ejzV8oQF073dhe7Eb9930o0qvSo";
const container = document.getElementById("buttons");

async function loadTabs() {
  try {
    const res = await fetch(APPS_SCRIPT_URL);
    const data = await res.json();
    renderButtons(data.tabs);
  } catch (err) {
    container.innerHTML = `<p class="error">⚠️ Could not load tabs. Check your Apps Script URL & permissions.</p>`;
    console.error(err);
  }
}

function renderButtons(tabs) {
  if (!tabs || tabs.length === 0) {
    container.innerHTML = `<p class="error">No tabs found.</p>`;
    return;
  }
  container.innerHTML = "";
  tabs.forEach(tab => {
    const a = document.createElement("a");
    a.className = "tab-btn";
    a.href = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit#gid=${tab.gid}`;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = tab.name;
    container.appendChild(a);
  });
}

loadTabs();
