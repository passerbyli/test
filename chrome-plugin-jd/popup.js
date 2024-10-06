document.getElementById("toggle-plugin-btn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "toggle-plugin" });
});
