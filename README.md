
## Smart Order - Server

### Mô tả
Backend sử dụng Node.js + Express, quản lý API cho nhân viên, khách hàng, đặt món và phân quyền.

### Cấu hình môi trường
Tạo file `.env` với các biến cần thiết:

```
NODE_ENV=development
PORT=8000
SERVER_BASE_URL=http://localhost:8000
DATABASE_URI=mongodb://localhost:27017/smartorder
...
```

### Khởi động server
```bash
npm install
npm run dev
```

---