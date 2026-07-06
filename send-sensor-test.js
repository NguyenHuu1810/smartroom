const DATABASE_URL = "https://smartroom-a7566-default-rtdb.asia-southeast1.firebasedatabase.app";
const roomId = process.argv[2] || "A101";

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function readRoom() {
  const response = await fetch(`${DATABASE_URL}/rooms/${roomId}.json`);

  if (!response.ok) {
    throw new Error(`Không đọc được phòng ${roomId}: HTTP ${response.status}`);
  }

  return response.json();
}

async function patchFirebase(path, data) {
  const response = await fetch(`${DATABASE_URL}/${path}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Không gửi được dữ liệu tới ${path}: HTTP ${response.status}`);
  }
}

async function putFirebase(path, data) {
  const response = await fetch(`${DATABASE_URL}/${path}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Không lưu được dữ liệu tới ${path}: HTTP ${response.status}`);
  }
}

async function sendSensorData() {
  const room = await readRoom();

  if (!room) {
    console.log(`Không tìm thấy phòng ${roomId} trên Firebase.`);
    return;
  }

  const electricStart = number(room.electricStart, number(room.electricCurrent, 0));
  const waterStart = number(room.waterStart, number(room.waterCurrent, 0));

  const oldElectricCurrent = number(room.electricCurrent, electricStart);
  const oldWaterCurrent = number(room.waterCurrent, waterStart);

  const electricCurrent = Number((oldElectricCurrent + Math.random() * 1.8).toFixed(1));
  const waterCurrent = Number((oldWaterCurrent + Math.random() * 0.2).toFixed(1));

  const electricUsage = Math.max(0, Number((electricCurrent - electricStart).toFixed(1)));
  const waterUsage = Math.max(0, Number((waterCurrent - waterStart).toFixed(1)));

  const now = new Date();

  const payload = {
    temperature: Number((26 + Math.random() * 4).toFixed(1)),
    humidity: Math.floor(55 + Math.random() * 12),

    electricStart: electricStart,
    electricCurrent: electricCurrent,
    electricUsage: electricUsage,
    electric: electricUsage,

    waterStart: waterStart,
    waterCurrent: waterCurrent,
    waterUsage: waterUsage,
    water: waterUsage,

    sensorUpdatedAt: now.toLocaleString("vi-VN"),
    timestamp: now.toISOString()
  };

  await patchFirebase(`rooms/${roomId}`, payload);

  const logId = Date.now();
  await putFirebase(`sensorLogs/${roomId}/${logId}`, {
    roomId: roomId,
    ...payload
  });

  console.log(`[${now.toLocaleTimeString("vi-VN")}] Đã gửi dữ liệu phòng ${roomId}`);
  console.log(payload);
}

console.log(`Đang gửi dữ liệu test cho phòng ${roomId}. Nhấn Ctrl + C để dừng.`);

sendSensorData().catch((error) => {
  console.error(error.message);
});

setInterval(() => {
  sendSensorData().catch((error) => {
    console.error(error.message);
  });
}, 3000);