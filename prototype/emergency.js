const DB_NAME = "safecircle-prototype";
const DB_VERSION = 1;
const STORE_QUEUE = "emergencyQueue";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: "event_id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function putQueue(item) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_QUEUE, "readwrite");
    tx.objectStore(STORE_QUEUE).put(item);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function getQueue() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_QUEUE).objectStore(STORE_QUEUE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function markPrototypeSynced() {
  if (!navigator.onLine) return;
  const items = await getQueue();
  const pending = items.filter(x => !x.synced_at);
  for (const item of pending) {
    item.synced_at = new Date().toISOString();
    item.sync_mode = "prototype-local";
    await putQueue(item);
  }
  await updateQueueBadge();
}

async function updateQueueBadge() {
  const badge = document.querySelector("#emergencyQueueState");
  if (!badge) return;
  const items = await getQueue();
  const pending = items.filter(x => !x.synced_at).length;
  badge.textContent = pending ? `전송 대기 ${pending}건` : "전송 대기 없음";
}

async function loadEmergencyBundle() {
  const status = document.querySelector("#bundleStatus");
  try {
    const response = await fetch("./fixtures/emergency-bundle.json");
    const bundle = await response.json();
    document.querySelector("#facilityName").textContent = bundle.facility_name;
    document.querySelector("#assemblyPoint").textContent =
      `${bundle.assembly_point.name} · ${bundle.assembly_point.description}`;
    document.querySelector("#bundleVersion").textContent =
      `승인 ${new Date(bundle.approved_at).toLocaleString()} · 만료 ${new Date(bundle.expires_at).toLocaleDateString()}`;
    const list = document.querySelector("#actionCards");
    list.innerHTML = "";
    bundle.action_cards.forEach(card => {
      const li = document.createElement("li");
      li.innerHTML = `<span aria-hidden="true">${card.pictogram}</span><strong>${card.step}. ${card.text}</strong>`;
      list.appendChild(li);
    });
    status.textContent = navigator.onLine ? "승인된 저장본 준비됨" : "오프라인 · 저장된 승인본";
  } catch (e) {
    status.textContent = "비상정보를 불러올 수 없습니다.";
  }
}

document.querySelector("#openEmergency")?.addEventListener("click", () => {
  document.querySelector("#emergencyPanel").classList.remove("hidden");
  loadEmergencyBundle();
});

document.querySelectorAll(".emergency-status").forEach(button => {
  button.addEventListener("click", async () => {
    const item = {
      event_id: crypto.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}`,
      facility_id: "factory_demo_01",
      status: button.dataset.status,
      created_at_device: new Date().toISOString(),
      queued_offline: !navigator.onLine,
      synced_at: null
    };
    await putQueue(item);
    document.querySelector("#emergencySaveNotice").textContent =
      navigator.onLine
        ? "상태가 기기에 저장되었습니다. 프로토타입에서는 서버 전송을 모의합니다."
        : "오프라인 상태입니다. 회신을 기기에 저장했고 연결 복구 후 전송 대기합니다.";
    await updateQueueBadge();
    if (navigator.onLine) await markPrototypeSynced();
  });
});

window.addEventListener("online", () => {
  loadEmergencyBundle();
  markPrototypeSynced();
});
window.addEventListener("offline", loadEmergencyBundle);

updateQueueBadge().catch(() => {});