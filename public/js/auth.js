import { auth, db } from "./firebase-config.js?v=101";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
  ref,
  get
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import {
  accountByEmail,
  loadStore,
  loadStoreWithFirebase,
  saveStore,
  addActivityLog,
  syncFirebaseUpdates
} from "./smartroom-store.js?v=101";

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const loginMessage = document.getElementById("login-message");
const passwordToggle = document.querySelector(".password-toggle");
const forgotPasswordBtn = document.getElementById("forgot-password");
const googleLoginBtn = document.getElementById("googleLoginBtn");

loadStoreWithFirebase().catch((error) => {
  console.warn("Không thể khởi tạo dữ liệu Firebase từ trang đăng nhập:", error);
});

function showMessage(message, type) {
  if (!loginMessage) return;
  loginMessage.textContent = message;
  loginMessage.className = `form-message ${type || ""}`;
}

function saveLoginSession(user) {
  localStorage.setItem("smartroomUser", JSON.stringify(user));
}

async function recordLogin(user) {
  try {
    const store = await loadStoreWithFirebase();
    const method = user.loginType === "google" ? "Google" : "Email/Mật khẩu";
    const log = addActivityLog(
      store,
      "Đăng nhập hệ thống",
      `accounts/${user.uid || user.email || "local"}`,
      `${user.name} đăng nhập bằng ${method}`
    );
    saveStore(store);
    await syncFirebaseUpdates({ [`activityLogs/${log.id}`]: log });
  } catch (error) {
    console.warn("Không thể ghi lịch sử đăng nhập:", error);
  }
}

async function finishLogin(user, redirectUrl) {
  saveLoginSession(user);
  await recordLogin(user);
  window.location.href = redirectUrl;
}

function emailToKey(email) {
  return email.toLowerCase().replace(/[.#$/\[\]@]/g, "_");
}

async function getAllowedUserByEmail(email) {
  const key = emailToKey(email);
  const userRef = ref(db, `allowedUsers/${key}`);
  const snapshot = await get(userRef).catch(() => null);

  if (!snapshot || !snapshot.exists()) {
    return null;
  }

  return snapshot.val();
}

if (passwordToggle && passwordInput) {
  passwordToggle.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    const icon = passwordToggle.querySelector("i");
    if (icon) {
      icon.className = isPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
    }
  });
}

if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener("click", () => {
    alert("Vui lòng liên hệ quản lý để cấp lại mật khẩu.");
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showMessage("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.", "error");
      return;
    }

    const store = await loadStoreWithFirebase();
    const localAccount = store.accounts.find((account) => {
      const loginNames = [account.username, account.email].filter(Boolean).map((value) => value.toLowerCase());
      return ["password", "both"].includes(account.authMethod)
        && loginNames.includes(username.toLowerCase())
        && account.password === password;
    });

    if (localAccount) {
      if (localAccount.status !== "active") {
        showMessage("Tài khoản này đang bị khóa.", "error");
        return;
      }

      const user = {
        uid: localAccount.id,
        name: localAccount.name,
        email: localAccount.email,
        role: localAccount.role,
        status: localAccount.status,
        tenantId: localAccount.tenantId || "",
        roomId: localAccount.roomId || "",
        loginType: "password"
      };

      await finishLogin(user, localAccount.role === "tenant" ? "pages/tenant.html" : "pages/dashboard.html");
      return;
    }

    showMessage("Sai tên đăng nhập hoặc mật khẩu.", "error");
  });
}

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();

    try {
      showMessage("Đang đăng nhập Google...", "success");

      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      const email = googleUser.email.toLowerCase();

      const store = await loadStoreWithFirebase();
      const storeAccount = accountByEmail(store, email);
      const allowedRecord = await getAllowedUserByEmail(email);
      const googleAllowedAccount = storeAccount && ["google", "both"].includes(storeAccount.authMethod) ? storeAccount : null;
      const allowedUser = googleAllowedAccount || allowedRecord;

      const active = allowedUser?.status === "active" || allowedUser?.active === true;
      if (!allowedUser || !active) {
        alert("Tài khoản Google này chưa được cấp quyền.");
        await signOut(auth);
        showMessage("", "");
        return;
      }

      const user = {
        uid: allowedUser.id || googleUser.uid,
        name: allowedUser.name || googleUser.displayName || "Người dùng",
        email: email,
        role: allowedUser.role || "tenant",
        status: allowedUser.status || "active",
        tenantId: allowedUser.tenantId || "",
        roomId: allowedUser.roomId || "",
        loginType: "google"
      };

      if (allowedUser.redirect) {
        await finishLogin(user, allowedUser.redirect);
      } else {
        await finishLogin(user, allowedUser.role === "tenant" ? "pages/tenant.html" : "pages/dashboard.html");
      }
    } catch (error) {
      console.error(error);
      alert("Đăng nhập Google thất bại.");
      showMessage("", "");
    }
  });
}
