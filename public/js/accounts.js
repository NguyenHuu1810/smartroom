import { accounts } from "../data/demo-data.js";
import { initLayout } from "./layout.js";

initLayout();

const table = document.querySelector("#account-table");
const search = document.querySelector("#account-search");

function renderAccounts() {
  const keyword = search.value.toLowerCase().trim();
  table.innerHTML = accounts.filter((item) => `${item.name} ${item.username}`.toLowerCase().includes(keyword)).map((item) => `
    <tr><td><strong>${item.name}</strong></td><td>${item.username}</td><td>${item.email}</td><td>${item.role}</td><td><span class="badge ${item.status === "Hoạt động" ? "badge-success" : "badge-warning"}">${item.status}</span></td><td><div class="table-actions"><button title="Sửa"><i class="fa-regular fa-pen-to-square"></i></button><button title="Khóa"><i class="fa-solid fa-lock"></i></button></div></td></tr>`).join("");
}

search.addEventListener("input", renderAccounts);
document.querySelector("#add-account").addEventListener("click", () => window.alert("Chức năng thêm tài khoản sẽ nối Firebase Authentication ở bước tiếp theo."));
renderAccounts();
