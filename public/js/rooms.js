import { rooms } from "../data/demo-data.js";
import { initLayout } from "./layout.js";

initLayout();

const roomGrid = document.querySelector("#room-grid");
const detail = document.querySelector("#room-detail");
const search = document.querySelector("#room-search");
const statusFilter = document.querySelector("#room-status");
const floorFilter = document.querySelector("#room-floor");
const emptyState = document.querySelector("#empty-rooms");
let selectedRoom = rooms[0];

const statusBadge = (status) => status === "Đang thuê" ? "badge-success" : status === "Bảo trì" ? "badge-danger" : "badge-warning";

function renderStats() {
  const values = [
    ["Tổng phòng", 24, "fa-building", "blue"],
    ["Đang thuê", 18, "fa-user-check", "green"],
    ["Phòng trống", 4, "fa-door-open", "orange"],
    ["Bảo trì", 2, "fa-screwdriver-wrench", "red"]
  ];
  document.querySelector("#room-stats").innerHTML = values.map(([label, value, icon, color]) => `<article class="stat-card"><span class="stat-icon ${color}"><i class="fa-solid ${icon}"></i></span><div><p>${label}</p><strong>${value}</strong><small>Cập nhật hôm nay</small></div></article>`).join("");
}

function filteredRooms() {
  const keyword = search.value.trim().toLowerCase();
  return rooms.filter((room) => {
    const matchesText = String(room.id).includes(keyword) || room.tenant.toLowerCase().includes(keyword);
    const matchesStatus = statusFilter.value === "all" || room.status === statusFilter.value;
    const matchesFloor = floorFilter.value === "all" || String(room.floor) === floorFilter.value;
    return matchesText && matchesStatus && matchesFloor;
  });
}

function renderRooms() {
  const list = filteredRooms();
  roomGrid.innerHTML = list.map((room) => `
    <article class="room-card ${selectedRoom?.id === room.id ? "selected" : ""}" data-room="${room.id}">
      <div class="room-card-top"><div><h3>${room.id}</h3><p>${room.tenant}</p></div><span class="badge ${statusBadge(room.status)}">${room.status}</span></div>
      <div class="room-sensors"><span><i class="fa-solid fa-temperature-half"></i>${room.temperature}°C</span><span><i class="fa-solid fa-droplet"></i>${room.humidity}%</span><span><i class="fa-solid fa-server"></i>${room.devices}</span><span><i class="fa-regular fa-bell"></i>${room.alerts}</span></div>
      <div class="room-payment"><span>Thanh toán đến:</span><strong>${room.payment}</strong></div>
      <div class="room-actions"><button data-view="${room.id}">Xem</button><button data-edit="${room.id}">Sửa</button><button data-delete="${room.id}">Xóa</button></div>
    </article>`).join("");
  emptyState.hidden = list.length > 0;
}

function renderDetail(room) {
  detail.innerHTML = room ? `
    <div class="detail-heading"><div><h2>Phòng ${room.id}</h2><p>Tầng ${room.floor} · ${room.area} m²</p></div><span class="badge ${statusBadge(room.status)}">${room.status}</span></div>
    <div class="detail-group"><h3>Thông tin người thuê</h3><div class="detail-row"><i class="fa-regular fa-user"></i><span>Họ tên</span><strong>${room.tenant}</strong></div><div class="detail-row"><i class="fa-solid fa-phone"></i><span>Liên hệ</span><strong>${room.phone}</strong></div></div>
    <div class="detail-group"><h3>Dữ liệu mới nhất</h3><div class="detail-row"><i class="fa-solid fa-temperature-half"></i><span>Nhiệt độ</span><strong>${room.temperature}°C</strong></div><div class="detail-row"><i class="fa-solid fa-droplet"></i><span>Độ ẩm</span><strong>${room.humidity}%</strong></div><div class="detail-row"><i class="fa-solid fa-server"></i><span>Thiết bị</span><strong>${room.devices}</strong></div><div class="detail-row"><i class="fa-regular fa-bell"></i><span>Cảnh báo</span><strong>${room.alerts}</strong></div></div>
    <button class="btn btn-primary full-width">Xem chi tiết phòng</button>`
    : `<div class="detail-empty"><i class="fa-regular fa-hand-pointer"></i><p>Chọn một phòng để xem chi tiết.</p></div>`;
}

roomGrid.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton) {
    const roomId = Number(deleteButton.dataset.delete);
    if (window.confirm(`Xóa Phòng ${roomId} khỏi danh sách demo?`)) {
      const index = rooms.findIndex((room) => room.id === roomId);
      rooms.splice(index, 1);
      selectedRoom = rooms[0] || null;
      renderRooms();
      renderDetail(selectedRoom);
    }
    return;
  }

  const editButton = event.target.closest("[data-edit]");
  if (editButton) {
    const room = rooms.find((item) => item.id === Number(editButton.dataset.edit));
    const nextStatus = window.prompt("Nhập trạng thái: Đang thuê, Phòng trống hoặc Bảo trì", room.status);
    if (["Đang thuê", "Phòng trống", "Bảo trì"].includes(nextStatus)) {
      room.status = nextStatus;
      selectedRoom = room;
      renderRooms();
      renderDetail(room);
    }
    return;
  }

  const card = event.target.closest("[data-room]");
  if (!card) return;
  selectedRoom = rooms.find((room) => room.id === Number(card.dataset.room));
  renderRooms();
  renderDetail(selectedRoom);
});

[search, statusFilter, floorFilter].forEach((control) => control.addEventListener("input", renderRooms));

const dialog = document.querySelector("#room-dialog");
document.querySelector("#add-room").addEventListener("click", () => dialog.showModal());
document.querySelector("#save-room").addEventListener("click", (event) => {
  const name = document.querySelector("#new-room-name").value.trim();
  const id = Number(name);
  event.preventDefault();
  if (!id || rooms.some((room) => room.id === id)) {
    window.alert("Số phòng không hợp lệ hoặc đã tồn tại.");
    return;
  }
  const floor = Number(document.querySelector("#new-room-floor").value);
  const room = { id, floor, status: "Phòng trống", tenant: "Chưa có người thuê", phone: "-", temperature: 25, humidity: 55, devices: 0, alerts: 0, payment: "-", area: 25 };
  rooms.push(room);
  selectedRoom = room;
  search.value = "";
  statusFilter.value = "all";
  floorFilter.value = "all";
  renderRooms();
  renderDetail(room);
  dialog.close();
});

renderStats();
renderRooms();
renderDetail(selectedRoom);
