import { dashboard } from "../data/demo-data.js";
import { initLayout } from "./layout.js";

initLayout();

document.querySelector("#dashboard-stats").innerHTML = dashboard.stats.map((item) => `
  <article class="stat-card">
    <span class="stat-icon ${item.color}"><i class="fa-solid ${item.icon}"></i></span>
    <div><p>${item.label}</p><strong>${item.value}</strong><small>${item.note}</small></div>
  </article>`).join("");

document.querySelector("#dashboard-alerts").innerHTML = dashboard.alerts.map((item) => `
  <div class="list-item"><span class="list-icon ${item.level}"><i class="fa-solid fa-triangle-exclamation"></i></span><div><strong>${item.title}</strong><small>${item.note}</small></div><span class="badge badge-danger">Mới</span></div>`).join("");

document.querySelector("#dashboard-devices").innerHTML = dashboard.devices.map((item) => `
  <div class="list-item"><span class="list-icon ${item.level}"><i class="fa-solid fa-plug"></i></span><div><strong>${item.title}</strong><small>${item.note}</small></div><span class="badge badge-success">Bật</span></div>`).join("");

document.querySelector("#dashboard-activities").innerHTML = dashboard.activities.map((item) => `
  <div class="timeline-row"><time>${item.time}</time><i></i><p>${item.text}</p></div>`).join("");
