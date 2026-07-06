import { tenants } from "../data/demo-data.js";
import { initLayout } from "./layout.js";

initLayout();

const table = document.querySelector("#tenant-table");
const search = document.querySelector("#tenant-search");
const badgeClass = (status) => status === "Đang thuê" ? "badge-success" : status === "Sắp hết hạn" ? "badge-warning" : "badge-danger";

function renderTenants() {
  const keyword = search.value.toLowerCase().trim();
  table.innerHTML = tenants.filter((item) => `${item.name} ${item.room} ${item.phone}`.toLowerCase().includes(keyword)).map((item) => `
    <tr><td><strong>${item.name}</strong><small>Người thuê</small></td><td>Phòng ${item.room}</td><td>${item.phone}</td><td>${item.start}</td><td><span class="badge ${badgeClass(item.status)}">${item.status}</span></td><td><div class="table-actions"><button title="Sửa"><i class="fa-regular fa-pen-to-square"></i></button><button title="Xóa"><i class="fa-regular fa-trash-can"></i></button></div></td></tr>`).join("");
}

search.addEventListener("input", renderTenants);
document.querySelector("#add-tenant").addEventListener("click", () => window.alert("Biểu mẫu thêm người thuê sẽ nối Firebase ở bước tiếp theo."));
renderTenants();
