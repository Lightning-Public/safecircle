const views = [...document.querySelectorAll(".view")];
const navItems = [...document.querySelectorAll(".nav-item")];
const networkBadge = document.querySelector("#networkBadge");
const appMain = document.querySelector("#appMain");

function setView(target) {
  views.forEach(v => v.classList.toggle("active", v.dataset.view === target));
  navItems.forEach(n => n.classList.toggle("active", n.dataset.target === target));
  appMain.focus({ preventScroll: true });
}

navItems.forEach(item => item.addEventListener("click", () => setView(item.dataset.target)));

function updateNetworkState() {
  const online = navigator.onLine;
  networkBadge.textContent = online ? "온라인" : "오프라인";
  networkBadge.classList.toggle("offline", !online);
}

window.addEventListener("online", updateNetworkState);
window.addEventListener("offline", updateNetworkState);
updateNetworkState();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch (error) {
      console.warn("Service worker registration failed", error);
    }
  });
}