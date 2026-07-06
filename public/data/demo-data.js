/* =========================================================
   DỮ LIỆU MẪU CŨ - GIỮ LẠI CHO CÁC FILE JS LEGACY
   Luồng mới dùng smartroom-store.js và Firebase.
   Chỉ giữ tài khoản quản lý chính và 3 tài khoản người thuê đã gán phòng.
   ========================================================= */

export const rooms = [
  { id: "A101", floor: 1, status: "Đang thuê", tenant: "Trần Minh Huy", phone: "0987 654 321", temperature: 26.2, humidity: 58, devices: 4, alerts: 0, payment: "10/07/2026", area: 28 },
  { id: "A102", floor: 1, status: "Phòng trống", tenant: "Chưa có người thuê", phone: "-", temperature: null, humidity: null, devices: 0, alerts: 0, payment: "-", area: 24 },
  { id: "A201", floor: 2, status: "Đang thuê", tenant: "Lê Thị C", phone: "0902 222 333", temperature: 27.4, humidity: 62, devices: 3, alerts: 0, payment: "10/07/2026", area: 30 },
  { id: "A202", floor: 2, status: "Bảo trì", tenant: "-", phone: "-", temperature: null, humidity: null, devices: 0, alerts: 0, payment: "-", area: 26 },
  { id: "B101", floor: 1, status: "Đang thuê", tenant: "Nguyễn Văn D", phone: "0903 444 555", temperature: 26.7, humidity: 57, devices: 2, alerts: 0, payment: "Đã thanh toán", area: 25 }
];

export const tenants = [
  { name: "Trần Minh Huy", room: "A101", phone: "0987 654 321", start: "2026-01-01", status: "Đang thuê", account: "huy / 123456" },
  { name: "Lê Thị C", room: "A201", phone: "0902 222 333", start: "2026-02-15", status: "Đang thuê", account: "lec / 123456" },
  { name: "Nguyễn Văn D", room: "B101", phone: "0903 444 555", start: "2026-04-10", status: "Đang thuê", account: "nguyend / 123456" }
];

export const accounts = [
  { name: "Quản lý", username: "Google", email: "tailai0868515544@gmail.com", role: "Quản lý", status: "Hoạt động" },
  { name: "Trần Minh Huy", username: "huy", email: "huy@gmail.com", role: "Người thuê", status: "Hoạt động" },
  { name: "Lê Thị C", username: "lec", email: "lec@gmail.com", role: "Người thuê", status: "Hoạt động" },
  { name: "Nguyễn Văn D", username: "nguyend", email: "nguyend@gmail.com", role: "Người thuê", status: "Hoạt động" }
];

export const dashboard = {
  stats: [
    { label: "Tổng phòng", value: 5, note: "Khu A/B", icon: "fa-building", color: "blue" },
    { label: "Đang thuê", value: 3, note: "3 người thuê", icon: "fa-user-check", color: "green" },
    { label: "Phòng trống", value: 1, note: "Có thể cho thuê", icon: "fa-door-open", color: "orange" },
    { label: "Bảo trì", value: 1, note: "Không cho thuê", icon: "fa-triangle-exclamation", color: "red" }
  ],
  alerts: [],
  devices: [],
  activities: [
    { time: "08:00", text: "Khởi tạo dữ liệu mẫu SmartRoom" }
  ]
};

export const tenantDevices = [
  { id: "light_1", name: "Đèn trần", icon: "fa-lightbulb", location: "Trong phòng", enabled: true },
  { id: "fan_1", name: "Quạt trần", icon: "fa-fan", location: "Trần phòng", enabled: true },
  { id: "door_1", name: "Khóa cửa", icon: "fa-door-closed", location: "Cửa phòng", enabled: true }
];
