import { accountByEmail, loadStoreWithFirebase } from "./smartroom-store.js?v=101";

const appShell = document.querySelector(".app");
const sidebarToggle = document.getElementById("sidebarToggle");
const logoutBtn = document.getElementById("logoutBtn");
const authUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("smartroomUser") || "null");
  } catch {
    return null;
  }
})();

const currentPage = location.pathname.split("/").pop();
const managerPages = ["dashboard.html", "rooms.html", "tenants.html", "accounts.html"];
const protectedPages = [...managerPages, "tenant.html"];
const appStore = await loadStoreWithFirebase();
const storeAccount = authUser?.email
  ? accountByEmail(appStore, authUser.email)
  : appStore.accounts?.find((account) => account.id === authUser?.uid) || null;
const effectiveAccount = storeAccount || authUser || null;
const effectiveRole = effectiveAccount?.role || "";
const effectiveStatus = effectiveAccount?.status || "";
const sidebar = document.querySelector(".sidebar");
const logoutParent = logoutBtn?.parentElement;

function roleText(role) {
  return { manager: "Quản lý", staff: "Nhân viên", tenant: "Người thuê" }[role] || "Tài khoản";
}

function initials(name, email) {
  const text = (name || email || "U").trim();
  return text
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

if (protectedPages.includes(currentPage) && !authUser) {
  window.location.replace("../index.html");
}

if (authUser && storeAccount) {
  const freshSession = {
    ...authUser,
    uid: storeAccount.id || authUser.uid,
    name: storeAccount.name || authUser.name,
    email: storeAccount.email || authUser.email,
    role: storeAccount.role || authUser.role,
    status: storeAccount.status || authUser.status,
    tenantId: storeAccount.tenantId || "",
    roomId: storeAccount.roomId || ""
  };
  localStorage.setItem("smartroomUser", JSON.stringify(freshSession));
}

if (effectiveStatus === "locked") {
  alert("Tài khoản này đã bị khóa.");
  localStorage.removeItem("smartroomUser");
  window.location.replace("../index.html");
}

if (effectiveRole === "tenant" && managerPages.includes(currentPage)) {
  window.location.replace("tenant.html");
}

if (effectiveRole === "manager" && currentPage === "tenant.html") {
  window.location.replace("dashboard.html");
}

if (effectiveRole === "tenant") {
  document.querySelectorAll('.menu a[href="dashboard.html"], .menu a[href="rooms.html"], .menu a[href="tenants.html"], .menu a[href="accounts.html"]').forEach((link) => {
    link.remove();
  });
}

if (sidebar && logoutBtn && !document.querySelector(".sidebar-account")) {
  const userName = effectiveAccount?.name || "Khách";
  const userEmail = effectiveAccount?.email || "";
  const userRole = effectiveRole;
  const account = document.createElement("div");
  account.className = "sidebar-account";
  account.innerHTML = `
    <div class="account-avatar">${initials(userName, userEmail)}</div>
    <div class="account-copy">
      <strong>${userName}</strong>
      <span>${roleText(userRole)}</span>
    </div>
  `;
  logoutParent.insertBefore(account, logoutBtn);
}

if (appShell && localStorage.getItem("smartroom-sidebar-collapsed") === "1") {
  appShell.classList.add("sidebar-collapsed");
}

sidebarToggle?.addEventListener("click", () => {
  appShell.classList.toggle("sidebar-collapsed");
  localStorage.setItem(
    "smartroom-sidebar-collapsed",
    appShell.classList.contains("sidebar-collapsed") ? "1" : "0"
  );
});

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("smartroomUser");
  localStorage.removeItem("smartroom-current-user");
  localStorage.removeItem("smartroom-auth-user");
  sessionStorage.clear();
  window.location.href = "../index.html";
});
