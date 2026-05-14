// ====== CONFIG ======
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwYuMm44VkQ1LDuuHZ7iOrw3j9lle53lZsxFS5IgFwf-gg0qt6Z73ZUGq9uS-q0-YI4Uw/exec";
// ====================

async function loadTabs() {
  try {
    const res = await fetch(WEB_APP_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    if (!data.tabs || data.tabs.length === 0) {
      showError("No tabs found.");
      return;
    }
    renderButtons(data.tabs);
  } catch (err) {
    console.error(err);
    showError("Could not load tabs. Check the Apps Script deployment access (must be 'Anyone').");
  }
}

function renderButtons(tabs) {
  const container = document.getElementById("buttons");
  container.innerHTML = "";

  tabs.forEach(tab => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.textContent = tab.name;
    btn.addEventListener("click", () => window.open(tab.url, "_blank"));
    container.appendChild(btn);
  });
}

function showError(msg) {
  document.getElementById("buttons").innerHTML =
    `<p class="error">⚠️ ${msg}</p>`;
}

loadTabs();
