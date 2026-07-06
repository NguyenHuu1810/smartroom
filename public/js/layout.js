/* =========================================================
   1. CẤU HÌNH MENU CHO TỪNG VAI TRÒ
   ========================================================= */
const managerMenu = [
  { key: "dashboard", label: "Dashboard", icon: "fa-border-all", href: "dashboard.html" },
  { key: "rooms", label: "Quản lý phòng", icon: "fa-door-open", href: "rooms.html" },
  { key: "tenants", label: "Người thuê", icon: "fa-users", href: "tenants.html" },
  { key: "accounts", label: "Tài khoản", icon: "fa-user-shield", href: "accounts.html" }
];

const tenantMenu = [
  { key: "tenant-room", label: "Phòng của tôi", icon: "fa-house", section: "tenant-room" },
  { key: "tenant-devices", label: "Thiết bị", icon: "fa-toggle-on", section: "tenant-devices-section" },
  { key: "tenant-account", label: "Tài khoản", icon: "fa-user", section: "tenant-account" }
];

/* =========================================================
   2. DỰNG SIDEBAR VÀ HEADER DÙNG CHUNG
   ========================================================= */
export function initLayout({ tenant = false } = {}) {
  const sidebar = document.querySelector("#sidebar");
  const header = document.querySelector("#app-header");
  const page = document.body.dataset.page;
  const menu = tenant ? tenantMenu : managerMenu;

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <span class="brand-icon"><i class="fa-solid fa-house-signal"></i></span>
      <div class="brand-copy"><strong>SmartRoom</strong><small>Quản lý phòng thông minh</small></div>
    </div>
    ${tenant ? "" : `<button class="icon-button sidebar-toggle" type="button" title="Thu gọn hoặc mở menu"><i class="fa-solid fa-angles-left"></i></button>`}
    <nav class="sidebar-nav">
      ${menu.map((item, index) => tenant
        ? `<a class="nav-link ${index === 0 ? "active" : ""}" href="#${item.section}" data-tenant-section="${item.section}"><i class="fa-solid ${item.icon}"></i><span>${item.label}</span></a>`
        : `<a class="nav-link ${page === item.key ? "active" : ""}" href="${item.href}"><i class="fa-solid ${item.icon}"></i><span>${item.label}</span></a>`
      ).join("")}
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user"><span class="avatar">${tenant ? "H" : "A"}</span><div><strong>${tenant ? "Trần Minh Huy" : "admin01"}</strong><small>${tenant ? "Người thuê" : "Quản trị viên"}</small></div></div>
      <button class="btn logout-sidebar" type="button" data-logout><i class="fa-solid fa-right-from-bracket"></i><span>Đăng xuất</span></button>
    </div>`;

  header.innerHTML = `
    <button class="icon-button" type="button" title="Thông báo"><i class="fa-regular fa-bell"></i></button>
    <div class="header-profile"><span class="avatar">${tenant ? "H" : "A"}</span><div><strong>${tenant ? "Trần Minh Huy" : "Nguyễn Văn Admin"}</strong><small>${tenant ? "Phòng 101" : "Quản trị viên"}</small></div></div>`;

  initSidebarToggle(sidebar);
  initLogout();
  if (tenant) initTenantNavigation();
}

/* =========================================================
   3. THU GỌN / MỞ SIDEBAR
   ========================================================= */
function initSidebarToggle(sidebar) {
  const toggle = sidebar.querySelector(".sidebar-toggle");
  if (!toggle) return;
  const collapsed = sessionStorage.getItem("smartroom-sidebar") === "collapsed";
  sidebar.classList.toggle("collapsed", collapsed);

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    sessionStorage.setItem("smartroom-sidebar", sidebar.classList.contains("collapsed") ? "collapsed" : "expanded");
  });
}

/* =========================================================
   4. ĐĂNG XUẤT VÀ MENU NGƯỜI THUÊ
   ========================================================= */
function initLogout() {
  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      sessionStorage.removeItem("smartroom-role");
      window.location.href = "../index.html";
    });
  });
}

function initTenantNavigation() {
  const links = document.querySelectorAll("[data-tenant-section]");
  const sections = document.querySelectorAll(".tenant-section");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      links.forEach((item) => item.classList.toggle("active", item === link));
      sections.forEach((section) => section.classList.toggle("active-section", section.id === link.dataset.tenantSection));
    });
  });
}
