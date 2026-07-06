import { get, ref, set, update } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
import { db } from "./firebase-config.js?v=101";

const KEY = "smartroom-market-store-v1";

// Không reset Firebase tự động trong giao diện.
// Nếu cần xóa dữ liệu để test, hãy dùng script riêng/manual trên Firebase để tránh mất dữ liệu khi đang thao tác.
const FIREBASE_ONE_TIME_RESET_VERSION = "";

// Các tài khoản cũ bị loại bỏ khỏi hệ thống. Viết tách chuỗi để tránh trình duyệt/cache bám dữ liệu mẫu cũ.
const ADMIN_EMAIL = "tailai0868515544@gmail.com";
const LEGACY_UNASSIGNED_EMAIL = ["tenant", "test.com"].join("@");
const LEGACY_SECONDARY_EMAIL = ["st" + "aff" + "01", "gmail.com"].join("@");
const REMOVED_ACCOUNT_EMAILS = new Set([LEGACY_UNASSIGNED_EMAIL, LEGACY_SECONDARY_EMAIL]);
const DEFAULT_TENANT_ACCOUNT_IDS = {
  T001: "A002",
  T002: "A003",
  T003: "A004"
};

const seed = {
  month: "2026-07",
  rates: {
    "2026-07": { electricRate: 3500, waterRate: 10000, maintenanceCost: 850000 },
    "2026-06": { electricRate: 3500, waterRate: 10000, maintenanceCost: 600000 }
  },
  rooms: [
    { id: "A101", building: "Khu A", floor: 1, area: 28, rent: 2500000, status: "occupied", tenantId: "T001", electricStart: 1250, electricCurrent: 1378, electricUsage: 128, electric: 128, waterStart: 86, waterCurrent: 98, waterUsage: 12, water: 12, temperature: 26.2, humidity: 58, paymentStatus: "unpaid", dueDate: "10/07/2026" },
    { id: "A102", building: "Khu A", floor: 1, area: 24, rent: 2300000, status: "vacant", tenantId: "", electricStart: 0, electricCurrent: 0, electricUsage: 0, electric: 0, waterStart: 0, waterCurrent: 0, waterUsage: 0, water: 0, temperature: null, humidity: null, paymentStatus: "none", dueDate: "" },
    { id: "A201", building: "Khu A", floor: 2, area: 30, rent: 2700000, status: "occupied", tenantId: "T002", electricStart: 1860, electricCurrent: 2028, electricUsage: 168, electric: 168, waterStart: 120, waterCurrent: 134, waterUsage: 14, water: 14, temperature: 27.4, humidity: 62, paymentStatus: "late", dueDate: "10/07/2026" },
    { id: "A202", building: "Khu A", floor: 2, area: 26, rent: 2400000, status: "maintenance", tenantId: "", electricStart: 0, electricCurrent: 0, electricUsage: 0, electric: 0, waterStart: 0, waterCurrent: 0, waterUsage: 0, water: 0, temperature: null, humidity: null, paymentStatus: "none", dueDate: "" },
    { id: "B101", building: "Khu B", floor: 1, area: 25, rent: 2400000, status: "occupied", tenantId: "T003", electricStart: 980, electricCurrent: 1076, electricUsage: 96, electric: 96, waterStart: 70, waterCurrent: 78, waterUsage: 8, water: 8, temperature: 26.7, humidity: 57, paymentStatus: "paid", dueDate: "10/07/2026" }
  ],
  tenants: [
    { id: "T001", name: "Trần Minh Huy", phone: "0987 654 321", email: "huy@gmail.com", roomId: "A101", startDate: "2026-01-01", deposit: 2500000, status: "active" },
    { id: "T002", name: "Lê Thị C", phone: "0902 222 333", email: "lec@gmail.com", roomId: "A201", startDate: "2026-02-15", deposit: 2700000, status: "active" },
    { id: "T003", name: "Nguyễn Văn D", phone: "0903 444 555", email: "nguyend@gmail.com", roomId: "B101", startDate: "2026-04-10", deposit: 2400000, status: "active" }
  ],
  accounts: [
    { id: "A001", name: "Quản lý", email: ADMIN_EMAIL, role: "manager", status: "active", tenantId: "", roomId: "", authMethod: "google" },
    { id: "A002", name: "Trần Minh Huy", email: "huy@gmail.com", username: "huy", role: "tenant", status: "active", tenantId: "T001", roomId: "A101", authMethod: "both", password: "123456" },
    { id: "A003", name: "Lê Thị C", email: "lec@gmail.com", username: "lec", role: "tenant", status: "active", tenantId: "T002", roomId: "A201", authMethod: "both", password: "123456" },
    { id: "A004", name: "Nguyễn Văn D", email: "nguyend@gmail.com", username: "nguyend", role: "tenant", status: "active", tenantId: "T003", roomId: "B101", authMethod: "both", password: "123456" }
  ],
  requests: [
    { id: "R001", roomId: "A101", tenantId: "T001", title: "Quạt không chạy", detail: "Quạt trần bật không quay.", status: "new", createdAt: "2026-07-04 10:15" },
    { id: "R002", roomId: "B101", tenantId: "T003", title: "Nước yếu", detail: "Nước phòng tắm chảy yếu.", status: "processing", createdAt: "2026-07-04 09:50" }
  ],
  devices: {
    A101: [
      { id: "light_1", name: "Đèn trần 1", type: "light", power: false },
      { id: "fan_1", name: "Quạt trần 1", type: "fan", power: false, speed: 1 },
      { id: "ac_1", name: "Máy lạnh 1", type: "ac", power: false, temp: 26, mode: "cool", fanSpeed: "auto" },
      { id: "door_1", name: "Khóa cửa 1", type: "door", state: "locked" }
    ],
    A201: [
      { id: "light_1", name: "Đèn trần 1", type: "light", power: true },
      { id: "fan_1", name: "Quạt trần 1", type: "fan", power: true, speed: 2 },
      { id: "door_1", name: "Khóa cửa 1", type: "door", state: "locked" }
    ],
    B101: [
      { id: "light_1", name: "Đèn trần 1", type: "light", power: false },
      { id: "door_1", name: "Khóa cửa 1", type: "door", state: "unlocked" }
    ]
  },
  controlLogs: {
    A101: [
      { id: "L001", roomId: "A101", deviceId: "door_1", deviceName: "Cửa phòng", action: "Khóa cửa", by: "Trần Minh Huy", role: "tenant", time: "2026-07-04 22:10" }
    ],
    A201: [],
    B101: []
  },
  activityLogs: [
    { id: "ACT001", actorName: "Quản lý", role: "manager", action: "Khởi tạo dữ liệu hệ thống", target: "system", detail: "Tạo dữ liệu mẫu ban đầu", time: "2026-07-04 08:00" }
  ],
  infrastructure: {
    waterTank: { level: 68, current: 13.6, capacity: 20 },
    lighting: { start: "18:00", end: "05:30", status: "Đang bật" },
    power: { currentKw: 4.2, load: "Thấp" }
  }
};

export function money(value) {
  return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

export function numericValue(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function sensorText(value, unit = "") {
  if (value === null || value === undefined || value === "") return "Chưa có dữ liệu";
  return `${value}${unit}`;
}

export function syncMeterUsage(room) {
  const electricStart = numericValue(room.electricStart, 0);
  const electricCurrent = numericValue(room.electricCurrent, electricStart + numericValue(room.electric, 0));
  const waterStart = numericValue(room.waterStart, 0);
  const waterCurrent = numericValue(room.waterCurrent, waterStart + numericValue(room.water, 0));
  const electricUsage = Math.max(0, Number((electricCurrent - electricStart).toFixed(1)));
  const waterUsage = Math.max(0, Number((waterCurrent - waterStart).toFixed(1)));

  room.electricStart = electricStart;
  room.electricCurrent = electricCurrent;
  room.electricUsage = electricUsage;
  room.electric = electricUsage;
  room.waterStart = waterStart;
  room.waterCurrent = waterCurrent;
  room.waterUsage = waterUsage;
  room.water = waterUsage;
  return room;
}

export function loadStore() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return structuredClone(seed);
  }
  const store = JSON.parse(raw);
  return normalizeStore(store);
}

export async function loadStoreWithFirebase() {
  const store = loadStore();
  try {
    const snapshot = await get(ref(db));
    const remote = snapshot.exists() ? snapshot.val() : null;

    if (!snapshot.exists()) {
      const normalized = normalizeStore(store);
      await syncFirebaseUpdates({
        ...firebaseSnapshotFromStore(normalized),
        ...firebaseDeletionUpdates()
      });
      return normalized;
    }

    const hasCoreData = remote?.rooms || remote?.tenants || remote?.accounts || remote?.requests;
    if (!hasCoreData) {
      const normalized = normalizeStore(store);
      await syncFirebaseUpdates({
        ...firebaseSnapshotFromStore(normalized),
        ...firebaseDeletionUpdates()
      });
      return normalized;
    }

    mergeRemoteStore(store, remote);
    const normalized = normalizeStore(store);

    // Ghi lại dữ liệu đã làm sạch và xóa các account thừa còn nằm trong Firebase.
    await syncFirebaseUpdates({
      ...firebaseSnapshotFromStore(normalized),
      ...firebaseDeletionUpdates(remote, normalized)
    });

    return normalized;
  } catch (error) {
    console.warn("Firebase read failed, using local store:", error);
    return store;
  }
}

export function saveStore(store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}


export function firebaseSnapshotFromStore(store) {
  return {
    month: store.month,
    rates: store.rates,
    rooms: Object.fromEntries(store.rooms.map((room) => [room.id, room])),
    tenants: Object.fromEntries(store.tenants.map((tenant) => [tenant.id, tenant])),
    accounts: Object.fromEntries(store.accounts.map((account) => [account.id, account])),
    allowedUsers: Object.fromEntries(
      (store.accounts || [])
        .filter((account) => account?.email && ["manager", "staff", "tenant"].includes(account.role))
        .map((account) => [firebaseKeyFromEmail(account.email), allowedUserFromAccount(account)])
    ),
    requests: Object.fromEntries(store.requests.map((request) => [request.id, request])),
    activityLogs: Object.fromEntries((store.activityLogs || []).map((log) => [log.id, log])),
    devices: Object.fromEntries(
      Object.entries(store.devices || {}).map(([roomId, devices]) => [
        roomId,
        Object.fromEntries((devices || []).map((device) => [device.id, device]))
      ])
    ),
    controlLogs: Object.fromEntries(
      Object.entries(store.controlLogs || {}).map(([roomId, logs]) => [
        roomId,
        Object.fromEntries((logs || []).map((log) => [log.id, log]))
      ])
    ),
    infrastructure: store.infrastructure
  };
}

export function resetStore() {
  localStorage.setItem(KEY, JSON.stringify(seed));
}

function normalizeStore(store) {
  store.month ||= seed.month;
  store.rates ||= structuredClone(seed.rates);
  store.rooms ||= [];
  store.tenants ||= [];
  store.accounts ||= [];
  store.requests ||= [];
  store.activityLogs ||= [];
  store.devices ||= {};
  store.controlLogs ||= {};
  store.infrastructure ||= structuredClone(seed.infrastructure);
  store.infrastructure.waterTank ||= structuredClone(seed.infrastructure.waterTank);
  store.infrastructure.lighting ||= structuredClone(seed.infrastructure.lighting);
  store.infrastructure.power ||= structuredClone(seed.infrastructure.power);

  const lighting = store.infrastructure.lighting;
  if (!lighting.start || !lighting.end) {
    const parts = String(lighting.schedule || "18:00 - 05:30").split("-");
    lighting.start = (parts[0] || "18:00").trim();
    lighting.end = (parts[1] || "05:30").trim();
  }
  lighting.status ||= "Đang bật";
  if (lighting.status === "Dang bat") lighting.status = "Đang bật";
  if (lighting.status === "Dang tat") lighting.status = "Đang tắt";
  delete lighting.schedule;

  if (store.infrastructure.power.load === "Thap") {
    store.infrastructure.power.load = "Thấp";
  }

  store.rooms.forEach((room) => {
    syncMeterUsage(room);
    store.devices[room.id] ||= [];
    store.devices[room.id] = normalizeDeviceCollection(store.devices[room.id]);
    store.controlLogs[room.id] ||= [];
  });

  store.tenants.forEach((tenant) => {
    tenant.status ||= "active";
    tenant.roomId ||= "";
    tenant.email = normalizeEmail(tenant.email || "");
  });

  const activeTenantsById = new Map(
    store.tenants
      .filter((tenant) => tenant.status === "active")
      .map((tenant) => [tenant.id, tenant])
  );

  store.rooms.forEach((room) => {
    const linkedTenant = room.tenantId ? activeTenantsById.get(room.tenantId) : null;
    const roomLinkIsValid = linkedTenant && linkedTenant.roomId === room.id;

    if (room.tenantId && !roomLinkIsValid) {
      room.tenantId = "";
    }

    if (room.status === "occupied" && !room.tenantId) {
      room.status = "vacant";
    }

    if (room.status === "occupied") {
      room.paymentStatus ||= "unpaid";
      room.dueDate ||= "10/07/2026";
    } else {
      room.paymentStatus = "none";
      room.dueDate = "";
    }
  });

  ensureEssentialAccounts(store);
  cleanupInvalidTenantAccounts(store, activeTenantsById);

  store.accounts.forEach((account) => {
    account.email = normalizeEmail(account.email || "");
    account.authMethod ||= "google";
    if (account.role === "tenant" && account.authMethod === "password") {
      account.authMethod = "both";
    }
    account.tenantId ||= "";
    account.roomId ||= "";

    if (account.role !== "tenant") {
      account.tenantId = "";
      account.roomId = "";
      return;
    }

    const linkedTenant = account.tenantId ? activeTenantsById.get(account.tenantId) : null;
    const linkedRoom = linkedTenant ? roomById(store, linkedTenant.roomId) : null;
    const accountLinkIsValid = linkedTenant
      && linkedRoom
      && linkedRoom.status === "occupied"
      && linkedRoom.tenantId === linkedTenant.id
      && linkedTenant.roomId === linkedRoom.id;

    if (accountLinkIsValid) {
      account.roomId = linkedTenant.roomId;
    } else {
      account.tenantId = "";
      account.roomId = "";
    }
  });

  // Chạy thêm lần nữa sau khi chuẩn hóa link để xóa sạch account tenant không có phòng.
  cleanupInvalidTenantAccounts(store, activeTenantsById);

  if (!store.activityLogs.length) {
    store.activityLogs = structuredClone(seed.activityLogs);
  }

  saveStore(store);
  return store;
}

function valuesFromRecord(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value && typeof value === "object") return Object.values(value).filter(Boolean);
  return [];
}

function normalizeEmail(value = "") {
  return String(value || "").trim().toLowerCase();
}

function firebaseKeyFromEmail(email = "") {
  return normalizeEmail(email).replace(/[.#$/\[\]@]/g, "_");
}

function usernameFromEmail(email = "") {
  return normalizeEmail(email).split("@")[0].replace(/[^a-z0-9._-]/gi, "") || "tenant";
}

function allowedUserFromAccount(account) {
  const redirect = account.role === "tenant" ? "pages/tenant.html" : "pages/dashboard.html";
  return {
    id: account.id,
    name: account.name,
    email: normalizeEmail(account.email || ""),
    role: account.role,
    status: account.status || "active",
    active: account.status !== "locked",
    tenantId: account.tenantId || "",
    roomId: account.roomId || "",
    authMethod: account.authMethod || "google",
    redirect
  };
}

function accountNeedsHardDelete(account, activeTenantsById, store) {
  if (!account) return true;
  const email = normalizeEmail(account.email || "");

  // Xóa tài khoản mẫu cũ, kể cả khi Firebase còn lưu lại.
  if (REMOVED_ACCOUNT_EMAILS.has(email)) return true;

  // Chỉ giữ lại tài khoản quản lý chính, cho phép thêm nhân viên hợp lệ.
  if (account.role === "manager") return email !== ADMIN_EMAIL;
  if (account.role === "staff") return !email;
  if (account.role !== "tenant") return true;

  const linkedTenant = account.tenantId ? activeTenantsById.get(account.tenantId) : null;
  const linkedRoom = linkedTenant ? roomById(store, linkedTenant.roomId) : null;

  return !Boolean(
    linkedTenant
    && linkedTenant.status === "active"
    && linkedRoom
    && linkedRoom.status === "occupied"
    && linkedRoom.tenantId === linkedTenant.id
    && linkedTenant.roomId === linkedRoom.id
  );
}

function cleanupInvalidTenantAccounts(store, activeTenantsById) {
  const usedTenantIds = new Set();

  store.accounts = (store.accounts || []).filter((account) => {
    if (accountNeedsHardDelete(account, activeTenantsById, store)) return false;
    if (account.role !== "tenant") return true;

    if (usedTenantIds.has(account.tenantId)) return false;
    usedTenantIds.add(account.tenantId);
    return true;
  });
}

function firebaseDeletionUpdates() {
  return {
    [`allowedUsers/${firebaseKeyFromEmail(LEGACY_UNASSIGNED_EMAIL)}`]: null,
    [`allowedUsers/${firebaseKeyFromEmail(LEGACY_SECONDARY_EMAIL)}`]: null
  };
}

function ensureEssentialAccounts(store) {
  store.accounts ||= [];
  store.accounts = store.accounts.filter((account) => !REMOVED_ACCOUNT_EMAILS.has(normalizeEmail(account?.email || "")));
  const accountsByEmail = new Map(
    store.accounts
      .filter((account) => account.email)
      .map((account) => [normalizeEmail(account.email), account])
  );

  const upsertAccount = (account) => {
    const email = normalizeEmail(account.email);
    const existing = accountsByEmail.get(email);
    if (existing) {
      Object.assign(existing, { ...account, id: existing.id || account.id });
      return existing;
    }
    store.accounts.push(account);
    accountsByEmail.set(email, account);
    return account;
  };

  upsertAccount({
    id: "A001",
    name: "Quản lý",
    email: ADMIN_EMAIL,
    role: "manager",
    status: "active",
    tenantId: "",
    roomId: "",
    authMethod: "google"
  });

  store.tenants
    .filter((tenant) => tenant.status === "active" && tenant.email && tenant.roomId)
    .forEach((tenant) => {
      const room = roomById(store, tenant.roomId);
      if (!room || room.status !== "occupied" || room.tenantId !== tenant.id) return;

      const email = normalizeEmail(tenant.email);
      const existingByTenant = store.accounts.find((account) => account.role === "tenant" && account.tenantId === tenant.id);
      const existingByEmail = accountsByEmail.get(email);
      const account = existingByTenant || existingByEmail || {
        id: nextId("A", store.accounts),
        email
      };

      account.id = DEFAULT_TENANT_ACCOUNT_IDS[tenant.id] || account.id;
      account.name = tenant.name;
      account.email = email;
      account.role = "tenant";
      account.status = account.status === "locked" ? "locked" : "active";
      account.tenantId = tenant.id;
      account.roomId = tenant.roomId;
      if (!account.authMethod || account.authMethod === "password") {
        account.authMethod = "both";
      }
      if (["password", "both"].includes(account.authMethod)) {
        account.username ||= usernameFromEmail(email);
        account.password ||= "123456";
      } else {
        account.username ||= "";
        account.password ||= "";
      }

      if (!store.accounts.includes(account)) {
        store.accounts.push(account);
      }
      accountsByEmail.set(email, account);
    });

}

function mergeRecordsById(localItems = [], remoteItems = [], preferLocal = () => false) {
  const byId = new Map();
  localItems.filter(Boolean).forEach((item) => byId.set(item.id, item));
  remoteItems.filter(Boolean).forEach((item) => {
    const local = byId.get(item.id);
    byId.set(item.id, local && preferLocal(local, item) ? local : item);
  });
  return Array.from(byId.values()).filter(Boolean);
}

function mergeRemoteStore(store, remote) {
  if (remote.month) store.month = remote.month;
  if (remote.rates) store.rates = remote.rates;
  if (remote.infrastructure) store.infrastructure = remote.infrastructure;

  const remoteRooms = valuesFromRecord(remote.rooms);
  const remoteTenants = valuesFromRecord(remote.tenants);
  const remoteAccounts = valuesFromRecord(remote.accounts);
  const remoteRequests = valuesFromRecord(remote.requests);
  const remoteActivityLogs = valuesFromRecord(remote.activityLogs);
  const remoteTenantIds = new Set(remoteTenants.map((tenant) => tenant.id));

  if (remoteRooms.length) {
    store.rooms = mergeRecordsById(store.rooms, remoteRooms, (localRoom) => {
      return Boolean(localRoom.tenantId && !remoteTenantIds.has(localRoom.tenantId));
    });
  }
  if (remoteTenants.length) store.tenants = mergeRecordsById(store.tenants, remoteTenants);
  if (remoteAccounts.length) store.accounts = mergeRecordsById(store.accounts, remoteAccounts);
  if (remoteRequests.length) store.requests = mergeRecordsById(store.requests, remoteRequests);
  if (remoteActivityLogs.length) store.activityLogs = mergeRecordsById(store.activityLogs, remoteActivityLogs);

  if (remote.devices) {
    const remoteDevices = { ...(store.devices || {}) };
    store.rooms.forEach((room) => {
      const localDevices = valuesFromRecord(store.devices?.[room.id]);
      const firebaseDevices = valuesFromRecord(remote.devices?.[room.id]);
      remoteDevices[room.id] = firebaseDevices.length
        ? mergeRecordsById(localDevices, firebaseDevices)
        : localDevices;
    });
    store.devices = remoteDevices;
  }

  if (remote.controlLogs) {
    const remoteControlLogs = { ...(store.controlLogs || {}) };
    store.rooms.forEach((room) => {
      const localLogs = valuesFromRecord(store.controlLogs?.[room.id]);
      const firebaseLogs = valuesFromRecord(remote.controlLogs?.[room.id]);
      remoteControlLogs[room.id] = firebaseLogs.length
        ? mergeRecordsById(localLogs, firebaseLogs)
        : localLogs;
    });
    store.controlLogs = remoteControlLogs;
  }
}

function deviceBaseId(type) {
  return {
    light: "light",
    fan: "fan",
    ac: "ac",
    door: "door"
  }[type] || "device";
}

function nextDeviceNumber(type, collection = [], usedIds = new Set()) {
  const baseId = deviceBaseId(type);
  const numbers = collection
    .map((device) => String(device.id || ""))
    .filter((id) => id.startsWith(`${baseId}_`))
    .map((id) => Number(id.replace(`${baseId}_`, "")))
    .filter((number) => Number.isFinite(number));
  let number = numbers.length ? Math.max(...numbers) + 1 : 1;
  while (usedIds.has(`${baseId}_${number}`)) number += 1;
  return number;
}

function normalizeDeviceCollection(devices = []) {
  const counters = {};
  const usedIds = new Set();
  return devices.map((device) => {
    const type = device.type || "light";
    const baseId = deviceBaseId(type);
    const baseName = deviceTypeText(type);
    let id = String(device.id || "");
    if (!id || usedIds.has(id)) {
      const number = nextDeviceNumber(type, devices, usedIds);
      id = `${baseId}_${number}`;
    }
    usedIds.add(id);
    counters[type] = (counters[type] || 0) + 1;

    const legacyNames = [baseName, "Cửa phòng"];
    const shouldRename = !device.name || legacyNames.includes(device.name);
    return {
      ...device,
      id,
      name: shouldRename ? `${baseName} ${counters[type]}` : device.name
    };
  });
}

export function statusText(status) {
  return {
    occupied: "Đang thuê",
    vacant: "Phòng trống",
    maintenance: "Bảo trì",
    inactive: "Ngưng dùng"
  }[status] || status;
}

export function statusBadge(status) {
  return {
    occupied: "badge-green",
    vacant: "badge-yellow",
    maintenance: "badge-red",
    inactive: "badge-gray",
    active: "badge-green",
    locked: "badge-red",
    manager: "badge-blue",
    staff: "badge-yellow",
    tenant: "badge-green",
    new: "badge-red",
    processing: "badge-yellow",
    done: "badge-green"
  }[status] || "badge-gray";
}

export function roleText(role) {
  return { manager: "Quản lý", staff: "Nhân viên", tenant: "Người thuê" }[role] || role;
}

export function paymentStatusText(status) {
  return { paid: "Đã thanh toán", unpaid: "Chưa thanh toán", late: "Chậm thanh toán", none: "-" }[status] || status;
}

export function requestStatusText(status) {
  return { new: "Mới", processing: "Đang xử lý", done: "Đã xong" }[status] || status;
}

export function tenantById(store, id) {
  return store.tenants.find((tenant) => tenant.id === id);
}

export function roomById(store, id) {
  return store.rooms.find((room) => room.id === id);
}

export function requestsByRoom(store, roomId) {
  return store.requests.filter((request) => request.roomId === roomId && request.status !== "done");
}

export function currentRates(store) {
  if (!store.rates[store.month]) {
    store.rates[store.month] = { electricRate: 3500, waterRate: 10000, maintenanceCost: 0 };
  }
  return store.rates[store.month];
}

export function roomBill(store, room) {
  const rates = currentRates(store);
  if (room.status !== "occupied" || !room.tenantId) {
    return {
      rent: 0,
      electricFee: 0,
      waterFee: 0,
      total: 0
    };
  }
  const rent = room.status === "occupied" ? Number(room.rent || 0) : 0;
  syncMeterUsage(room);
  const electricFee = Number(room.electricUsage || 0) * Number(rates.electricRate || 0);
  const waterFee = Number(room.waterUsage || 0) * Number(rates.waterRate || 0);
  return {
    rent,
    electricFee,
    waterFee,
    total: rent + electricFee + waterFee
  };
}

export function dashboardSummary(store) {
  const rates = currentRates(store);
  const rooms = store.rooms;
  const occupied = rooms.filter((room) => room.status === "occupied");
  const vacant = rooms.filter((room) => room.status === "vacant");
  const maintenance = rooms.filter((room) => room.status === "maintenance");
  const totalDue = occupied.reduce((sum, room) => sum + roomBill(store, room).total, 0);
  const unpaidRooms = occupied.filter((room) => room.paymentStatus === "unpaid" || room.paymentStatus === "late");
  const unpaid = unpaidRooms.reduce((sum, room) => sum + roomBill(store, room).total, 0);
  const paid = totalDue - unpaid;
  const electricFee = occupied.reduce((sum, room) => sum + roomBill(store, room).electricFee, 0);
  const waterFee = occupied.reduce((sum, room) => sum + roomBill(store, room).waterFee, 0);
  const openRequests = store.requests.filter((request) => request.status !== "done");
  return {
    totalRooms: rooms.length,
    occupied: occupied.length,
    vacant: vacant.length,
    maintenance: maintenance.length,
    late: unpaidRooms.length,
    totalDue,
    paid,
    unpaid,
    electricFee,
    waterFee,
    maintenanceCost: Number(rates.maintenanceCost || 0),
    remain: paid - electricFee - waterFee - Number(rates.maintenanceCost || 0),
    openRequests
  };
}

export function nextId(prefix, collection) {
  const max = collection
    .map((item) => Number(String(item.id || "").replace(prefix, "")))
    .filter((number) => !Number.isNaN(number))
    .reduce((a, b) => Math.max(a, b), 0);
  return prefix + String(max + 1).padStart(3, "0");
}

export function assignTenantToRoom(store, tenant) {
  const room = roomById(store, tenant.roomId);
  if (!room || !tenant?.id) return null;
  if (room.tenantId) return null;
  if (room.status !== "vacant") return null;
  syncMeterUsage(room);
  room.tenantId = tenant.id;
  room.status = "occupied";
  room.paymentStatus = "unpaid";
  room.dueDate ||= "10/07/2026";
  room.electricStart = numericValue(room.electricCurrent, 0);
  room.waterStart = numericValue(room.waterCurrent, 0);
  syncMeterUsage(room);
  return room;
}

export function releaseRoom(store, roomId) {
  const room = roomById(store, roomId);
  if (!room) return null;
  syncMeterUsage(room);
  room.tenantId = "";
  room.status = "vacant";
  room.paymentStatus = "none";
  room.dueDate = "";
  room.electricStart = numericValue(room.electricCurrent, 0);
  room.waterStart = numericValue(room.waterCurrent, 0);
  syncMeterUsage(room);
  return room;
}

export function authUser() {
  try {
    return JSON.parse(localStorage.getItem("smartroomUser") || "null");
  } catch {
    return null;
  }
}

export function accountByEmail(store, email) {
  if (!email) return null;
  const normalizedEmail = normalizeEmail(email);
  if (REMOVED_ACCOUNT_EMAILS.has(normalizedEmail)) return null;
  return store.accounts.find((account) => account.email && normalizeEmail(account.email) === normalizedEmail) || null;
}

export function tenantForAuthUser(store, user = authUser()) {
  if (!user?.email) return null;

  const account = accountByEmail(store, user.email);
  if (!account || account.role !== "tenant" || account.status !== "active" || !account.tenantId) return null;

  const tenant = tenantById(store, account.tenantId);
  if (!tenant || tenant.status !== "active") return null;

  const room = roomById(store, tenant.roomId);
  if (!room || room.status !== "occupied" || room.tenantId !== tenant.id) return null;

  return tenant;
}

export function roomDevices(store, roomId) {
  store.devices ||= {};
  store.devices[roomId] ||= [];
  return store.devices[roomId];
}

export function roomControlLogs(store, roomId) {
  store.controlLogs ||= {};
  store.controlLogs[roomId] ||= [];
  store.controlLogs[roomId].sort((a, b) => {
    const left = Number(String(a.id || "").replace("L", ""));
    const right = Number(String(b.id || "").replace("L", ""));
    return right - left;
  });
  return store.controlLogs[roomId];
}

export function systemActivityLogs(store) {
  store.activityLogs ||= [];
  store.activityLogs.sort((a, b) => {
    const left = Number(String(a.id || "").replace("ACT", ""));
    const right = Number(String(b.id || "").replace("ACT", ""));
    return right - left;
  });
  return store.activityLogs;
}

export function currentActor() {
  const user = authUser();
  return {
    name: user?.name || "Quản lý",
    role: user?.role || "manager",
    id: user?.uid || ""
  };
}

export function addActivityLog(store, action, target = "", detail = "") {
  const actor = currentActor();
  const logs = systemActivityLogs(store);
  const log = {
    id: nextId("ACT", logs),
    actorName: actor.name,
    actorId: actor.id,
    role: actor.role,
    action,
    target,
    detail,
    time: new Date().toLocaleString("vi-VN")
  };
  logs.unshift(log);
  return log;
}

export function deviceTypeText(type) {
  return {
    light: "Đèn trần",
    fan: "Quạt trần",
    ac: "Máy lạnh",
    door: "Cửa/khóa cửa"
  }[type] || type;
}

export function deviceStatusText(device) {
  if (!device) return "-";
  if (device.type === "door") return device.state === "locked" ? "Đang khóa" : "Đang mở";
  if (device.type === "fan") return device.power ? `Đang bật · Mức ${device.speed || 1}` : "Đang tắt";
  if (device.type === "ac") {
    const mode = { cool: "Làm lạnh", dry: "Hút ẩm", fan: "Quạt gió", auto: "Tự động" }[device.mode] || device.mode;
    return device.power ? `Đang bật · ${device.temp || 26}°C · ${mode}` : "Đang tắt";
  }
  return device.power ? "Đang bật" : "Đang tắt";
}

export function defaultDevice(type, collection = []) {
  const baseId = deviceBaseId(type);
  const count = nextDeviceNumber(type, collection);
  const id = `${baseId}_${count}`;
  if (type === "fan") return { id, name: `Quạt trần ${count}`, type, power: false, speed: 1 };
  if (type === "ac") return { id, name: `Máy lạnh ${count}`, type, power: false, temp: 26, mode: "cool", fanSpeed: "auto" };
  if (type === "door") return { id, name: `Khóa cửa ${count}`, type, state: "locked" };
  return { id, name: `Đèn trần ${count}`, type: "light", power: false };
}

export function buildRoomDevices(config = {}) {
  const devices = [];
  const addMany = (type, count) => {
    const total = Math.max(0, Math.min(Number(count || 0), 20));
    for (let index = 0; index < total; index += 1) {
      devices.push(defaultDevice(type, devices));
    }
  };
  addMany("light", config.lightCount ?? 1);
  addMany("fan", config.fanCount ?? 1);
  addMany("ac", config.acCount ?? 0);
  addMany("door", config.doorCount ?? 1);
  return devices;
}

export function addControlLog(store, roomId, payload) {
  const logs = roomControlLogs(store, roomId);
  const log = {
    id: nextId("L", logs),
    roomId,
    deviceId: payload.deviceId || "",
    deviceName: payload.deviceName || "",
    action: payload.action || "",
    by: payload.by || "Hệ thống",
    role: payload.role || "system",
    time: payload.time || new Date().toLocaleString("vi-VN")
  };
  logs.unshift(log);
  return log;
}

export async function syncFirebaseUpdates(updates) {
  const cleanUpdates = Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined));
  if (!Object.keys(cleanUpdates).length) return;
  cleanUpdates["systemFlags/lastWriteAt"] = new Date().toISOString();
  await update(ref(db), cleanUpdates);
}

export async function replaceFirebaseStore(store) {
  await set(ref(db), firebaseSnapshotFromStore(store));
}

export function firebaseWriteError(error) {
  console.error("Firebase write failed:", error);
  alert("Đã lưu trên giao diện, nhưng chưa ghi được Firebase. Kiểm tra lại Database Rules hoặc kết nối mạng.");
}
