# SmartRoom - Website quản lý phòng trọ thông minh

## 1. Giới thiệu

SmartRoom là website mô phỏng hệ thống quản lý phòng trọ thông minh. Hệ thống hỗ trợ quản lý phòng, người thuê, tài khoản đăng nhập, nhân viên, thiết bị trong phòng, dữ liệu cảm biến và yêu cầu hỗ trợ từ người thuê.

Website được xây dựng bằng HTML, CSS và JavaScript. Dữ liệu được lưu trên Firebase Realtime Database, chức năng đăng nhập sử dụng Firebase Authentication và website được triển khai bằng Firebase Hosting.

Link demo:

```text
https://smartroom-a7566.web.app
```

## 2. Công nghệ sử dụng

- HTML
- CSS
- JavaScript
- Firebase Hosting
- Firebase Realtime Database
- Firebase Authentication
- Node.js
- VSCode

## 3. Chức năng chính

### 3.1. Giao diện quản lý

Giao diện quản lý dành cho tài khoản quản lý và nhân viên. Các chức năng chính gồm:

- Xem trang tổng quan hệ thống.
- Xem tổng số phòng, phòng đang thuê, phòng trống và phòng bảo trì.
- Quản lý danh sách phòng.
- Quản lý người thuê.
- Gán người thuê vào phòng.
- Quản lý tài khoản người thuê, nhân viên và quản lý.
- Thêm nhân viên.
- Khóa hoặc mở khóa tài khoản.
- Theo dõi dữ liệu nhiệt độ, độ ẩm, điện và nước.
- Quản lý thiết bị trong phòng.
- Theo dõi yêu cầu hỗ trợ từ người thuê.

### 3.2. Giao diện người thuê

Giao diện người thuê chỉ hiển thị thông tin liên quan đến phòng của người đang đăng nhập. Các chức năng gồm:

- Xem thông tin phòng đang thuê.
- Xem chỉ số điện, nước.
- Xem nhiệt độ và độ ẩm.
- Xem trạng thái thiết bị trong phòng.
- Gửi yêu cầu hỗ trợ đến quản lý.

### 3.3. Chức năng nhân viên

Nhân viên được thêm trực tiếp trong trang Tài khoản. Sau khi được cấp quyền, nhân viên có thể đăng nhập vào giao diện quản lý để hỗ trợ quản lý hệ thống.

## 4. Cấu trúc thư mục

```text
public/
├── index.html
├── css/
│   ├── base.css
│   └── manager-redesign.css
├── js/
│   ├── firebase-config.js
│   ├── smartroom-store.js
│   ├── smartroom-layout.js
│   └── auth.js
├── pages/
│   ├── dashboard.html
│   ├── rooms.html
│   ├── tenants.html
│   ├── accounts.html
│   └── tenant.html
└── data/
    └── demo-data.js
```

## 5. Giải thích các file quan trọng

### `public/js/firebase-config.js`

File này chứa cấu hình kết nối Firebase. Website sử dụng file này để kết nối với Firebase Authentication và Firebase Realtime Database.

### `public/js/smartroom-store.js`

Đây là file xử lý dữ liệu chính của hệ thống. File này có nhiệm vụ:

- Đọc dữ liệu từ Firebase.
- Lưu dữ liệu tạm vào localStorage.
- Chuẩn hóa dữ liệu phòng, người thuê và tài khoản.
- Kiểm tra liên kết giữa phòng và người thuê.
- Kiểm tra tài khoản người thuê có được gán phòng hợp lệ hay không.
- Tạo hoặc cập nhật các tài khoản cần thiết.
- Xử lý logic gán phòng và trả phòng.
- Tính tiền phòng, tiền điện và tiền nước.
- Đồng bộ dữ liệu thay đổi lên Firebase.

### `public/pages/dashboard.html`

Trang tổng quan của hệ thống. Trang này hiển thị các thông tin chính như số lượng phòng, trạng thái phòng, doanh thu, tiền điện nước và yêu cầu hỗ trợ.

### `public/pages/rooms.html`

Trang quản lý phòng. Trang này hiển thị danh sách phòng, trạng thái phòng, người thuê đang ở, chỉ số điện nước và trạng thái thanh toán.

### `public/pages/tenants.html`

Trang quản lý người thuê. Trang này dùng để thêm người thuê, gán người thuê vào phòng và tạo tài khoản đăng nhập cho người thuê.

### `public/pages/accounts.html`

Trang quản lý tài khoản. Trang này cho phép xem danh sách tài khoản quản lý, nhân viên và người thuê. Trang cũng hỗ trợ thêm nhân viên, khóa hoặc mở khóa tài khoản.

### `public/pages/tenant.html`

Trang dành cho người thuê. Sau khi đăng nhập, người thuê chỉ xem được thông tin phòng của mình.

### `send-sensor-test.js`

File này dùng để giả lập dữ liệu cảm biến gửi lên Firebase Realtime Database. Dữ liệu mới nhất được cập nhật vào nhánh `rooms/{roomId}`, còn lịch sử từng lần gửi được lưu vào `sensorLogs/{roomId}`.

## 6. Luồng hoạt động của hệ thống

Khi người dùng mở website, hệ thống sẽ kiểm tra trạng thái đăng nhập.

Nếu tài khoản là quản lý hoặc nhân viên, hệ thống chuyển vào giao diện quản lý.

Nếu tài khoản là người thuê, hệ thống chuyển vào giao diện người thuê và chỉ hiển thị thông tin phòng được gán với người thuê đó.

Dữ liệu được đọc từ Firebase Realtime Database. Sau khi đọc dữ liệu, file `smartroom-store.js` sẽ chuẩn hóa dữ liệu để đảm bảo phòng, người thuê và tài khoản liên kết đúng với nhau.

Ví dụ:

- Phòng đang thuê phải có mã người thuê.
- Người thuê phải được gán với một phòng cụ thể.
- Tài khoản người thuê phải liên kết với đúng người thuê và đúng phòng.
- Tài khoản không hợp lệ sẽ không được hiển thị hoặc bị loại bỏ.

## 7. Cấu trúc dữ liệu trên Firebase

Một số nhánh dữ liệu chính trong Firebase Realtime Database:

```text
rooms
tenants
accounts
devices
requests
activityLogs
controlLogs
allowedUsers
sensorLogs
```

Ý nghĩa:

- `rooms`: lưu thông tin phòng.
- `tenants`: lưu thông tin người thuê.
- `accounts`: lưu tài khoản quản lý, nhân viên và người thuê.
- `devices`: lưu trạng thái thiết bị trong phòng.
- `requests`: lưu yêu cầu hỗ trợ từ người thuê.
- `activityLogs`: lưu lịch sử hoạt động hệ thống.
- `controlLogs`: lưu lịch sử điều khiển thiết bị.
- `allowedUsers`: lưu email được phép đăng nhập.
- `sensorLogs`: lưu lịch sử dữ liệu cảm biến.

## 8. Gửi dữ liệu test cảm biến

Có thể chạy file `send-sensor-test.js` bằng Node.js để giả lập dữ liệu cảm biến.

Ví dụ gửi dữ liệu cho phòng A101:

```bash
node send-sensor-test.js A101
```

Gửi dữ liệu cho phòng khác:

```bash
node send-sensor-test.js A201
node send-sensor-test.js B101
```

Dữ liệu sẽ được gửi định kỳ lên Firebase.

Trong đó:

```text
rooms/A101
```

lưu dữ liệu mới nhất để giao diện hiển thị.

```text
sensorLogs/A101
```

lưu lịch sử từng lần gửi dữ liệu.

## 9. Deploy website

Lệnh deploy website lên Firebase Hosting:

```bash
firebase deploy --only hosting
```

Sau khi deploy, website chạy tại:

```text
https://smartroom-a7566.web.app
```

## 10. Kết luận

Project SmartRoom mô phỏng một hệ thống quản lý phòng trọ thông minh. Hệ thống có phân quyền tài khoản, quản lý phòng, quản lý người thuê, quản lý nhân viên, quản lý thiết bị và nhận dữ liệu cảm biến theo thời gian thực thông qua Firebase.