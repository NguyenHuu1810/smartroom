const DATABASE_URL = "https://smartroom-a7566-default-rtdb.asia-southeast1.firebasedatabase.app";
const roomId = process.argv[2] || "A101";

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function readRoom() {
  const response = await fetch(`${DATABASE_URL}/rooms/${roomId}.json`);
  if (!response.ok) throw new Error(`Không đọc được phòng ${roomId}: HTTP ${response.status}`);
  return response.json();
}

async function sendSensorData() {
  const room = await readRoom();
  if (!room) {
    console.log(`Không tìm thấy phòng ${roomId} trên Firebase.`);
    return;
  }

  const electricStart = number(room.electricStart, number(room.electricCurrent, 0));
  const waterStart = number(room.waterStart, number(room.waterCurrent, 0));
  const electricCurrent = Number((number(room.electricCurrent, electricStart) + Math.random() * 1.8).toFixed(1));
  const waterCurrent = Number((number(room.waterCurrent, waterStart) + Math.random() * 0.2).toFixed(1));
  const electricUsage = Math.max(0, Number((electricCurrent - electricStart).toFixed(1)));
  const waterUsage = Math.max(0, Number((waterCurrent - waterStart).toFixed(1)));

  const payload = {
    temperature: Number((26 + Math.random() * 4).toFixed(1)),
    humidity: Math.floor(55 + Math.random() * 12),
    electricStart,
    electricCurrent,
    electricUsage,
    electric: electricUsage,
    waterStart,
    waterCurrent,
    waterUsage,
    water: waterUsage,
    sensorUpdatedAt: new Date().toLocaleString("vi-VN")
  };

  const response = await fetch(`${DATABASE_URL}/rooms/${roomId}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Không gửi được dữ liệu: HTTP ${response.status}`);
  console.log(`[${new Date().toLocaleTimeString("vi-VN")}] ${roomId}`, payload);
}

console.log(`Đang giả lập dữ liệu cảm biến cho phòng ${roomId}. Nhấn Ctrl + C để dừng.`);
sendSensorData().catch((error) => console.error(error.message));
setInterval(() => sendSensorData().catch((error) => console.error(error.message)), 3000);
