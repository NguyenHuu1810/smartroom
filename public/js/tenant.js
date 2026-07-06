import { tenantDevices } from "../data/demo-data.js";
import { initLayout } from "./layout.js";

initLayout({ tenant: true });

function deviceMarkup(device) {
  return `<div class="device-row"><span class="list-icon blue"><i class="fa-solid ${device.icon}"></i></span><div><strong>${device.name}</strong><small>${device.location}</small></div><label class="switch" title="Bật hoặc tắt ${device.name}"><input type="checkbox" data-device="${device.id}" ${device.enabled ? "checked" : ""}><span></span></label></div>`;
}

document.querySelector("#tenant-devices").innerHTML = tenantDevices.slice(0, 2).map(deviceMarkup).join("");
document.querySelector("#tenant-all-devices").innerHTML = tenantDevices.map(deviceMarkup).join("");

document.querySelectorAll("[data-device]").forEach((toggle) => {
  toggle.addEventListener("change", () => {
    document.querySelectorAll(`[data-device="${toggle.dataset.device}"]`).forEach((mirror) => { mirror.checked = toggle.checked; });
  });
});

document.querySelector("#mark-alert-read").addEventListener("click", (event) => {
  event.currentTarget.textContent = "Đã đánh dấu là đã xem";
  event.currentTarget.disabled = true;
});
