# Zenith - Backend

Đây là API backend cho nền tảng thương mại điện tử Zenith, được xây dựng bằng Node.js, Express và PostgreSQL.

## Tính năng

- API RESTful để quản lý sản phẩm, đơn hàng, người dùng và đánh giá.
- Xác thực dựa trên JWT (JSON Web Token).
- Phân quyền cho quản trị viên.
- Tích hợp Redis để caching dữ liệu sản phẩm.
- Giao dịch cơ sở dữ liệu an toàn khi tạo đơn hàng.

## Công nghệ

- **Framework**: Express.js
- **Cơ sở dữ liệu**: PostgreSQL (với `pg`)
- **Xác thực**: `jsonwebtoken`, `bcryptjs`
- **Validation**: `express-validator`
- **Bảo mật**: `helmet`, `cors`, `express-rate-limit`
- **Phát triển**: `nodemon`

## Cài đặt và Chạy

1.  **Cài đặt các gói phụ thuộc:**

    ```sh
    npm install --legacy-peer-deps
    ```

2.  **Cấu hình môi trường:**
    Tạo một tệp `.env` từ [`.env.example`](./.env.example) và điền các biến cần thiết.

3.  **Thiết lập cơ sở dữ liệu:**
    Kết nối với cơ sở dữ liệu PostgreSQL của bạn và chạy các tập lệnh trong thư mục `sql/`:

    - [`sql/schema.sql`](./sql/schema.sql): Tạo tất cả các bảng cần thiết.
    - [`sql/seed.sql`](./sql/seed.sql): Điền dữ liệu mẫu vào cơ sở dữ liệu.

4.  **Chạy máy chủ:**
    - Để phát triển với tính năng tự động tải lại:
      ```sh
      npm run dev
      ```
    - Để chạy trong môi trường production:
      `sh
npm start
`
      Máy chủ sẽ khởi động trên cổng được chỉ định trong tệp `.env` của bạn (mặc định là 5001).

## Cấu trúc API

Các điểm cuối chính của API được định tuyến trong [`server.js`](./server.js):

- `/api/auth`: Xác thực người dùng (đăng nhập, đăng ký). Xem [`src/api/routes/auth.routes.js`](./src/api/routes/auth.routes.js).
- `/api/products`: Lấy và quản lý sản phẩm. Xem [`src/api/routes/products.routes.js`](./src/api/routes/products.routes.js).
- `/api/orders`: Tạo và xem đơn hàng của người dùng. Xem [`src/api/routes/orders.routes.js`](./src/api/routes/orders.routes.js).
- `/api/admin`: Các điểm cuối dành cho quản trị viên. Xem [`src/api/routes/admin.routes.js`](./src/api/routes/admin.routes.js).
