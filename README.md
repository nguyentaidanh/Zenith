# Zenith - Nền tảng thương mại điện tử Full-Stack

Zenith là một ứng dụng web thương mại điện tử hoàn chỉnh được xây dựng với kiến trúc hiện đại, bao gồm một frontend React và một backend Node.js.

## Tổng quan

Dự án này được chia thành hai phần chính:

- **`fontend/`**: Một ứng dụng React (sử dụng Vite và TypeScript) cung cấp giao diện người dùng cho khách hàng và bảng điều khiển cho quản trị viên.
- **`backend/`**: Một API RESTful được xây dựng bằng Node.js và Express, kết nối với cơ sở dữ liệu PostgreSQL để quản lý dữ liệu.

## Công nghệ sử dụng

- **Backend**: Node.js, Express, PostgreSQL, Redis, JWT (JSON Web Tokens), bcryptjs
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router, Context API
- **Cơ sở dữ liệu**: PostgreSQL

## Bắt đầu

Để chạy dự án này trên máy cục bộ của bạn, hãy làm theo các bước dưới đây.

### Yêu cầu

- Node.js (v18 trở lên)
- npm
- PostgreSQL
- Redis

### Cài đặt Backend

1.  Điều hướng đến thư mục backend:
    ```sh
    cd backend
    ```
2.  Cài đặt các gói phụ thuộc:
    ```sh
    npm install
    ```
3.  Sao chép tệp [`.env.example`](backend/.env.example) thành `.env` và điền thông tin cấu hình của bạn.
    ```sh
    # filepath: backend/.env
    PORT=5001
    DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_database
    JWT_SECRET=your_super_secret_key_that_is_long_and_random
    REDIS_URL=redis://localhost:6379
    ```
4.  Thiết lập cơ sở sở dữ liệu PostgreSQL bằng cách chạy các tệp SQL trong thư mục `sql/`:
    - [`sql/schema.sql`](backend/sql/schema.sql): Tạo cấu trúc bảng.
    - [`sql/seed.sql`](backend/sql/seed.sql): Chèn dữ liệu mẫu (lưu ý: bạn cần thay thế các giá trị hash bcrypt trong tệp này).
5.  Khởi động máy chủ backend:
    ```sh
    npm run dev
    ```
    Máy chủ sẽ chạy tại `http://localhost:5001`.

### Cài đặt Frontend

1.  Điều hướng đến thư mục frontend:
    ```sh
    cd fontend
    ```
2.  Cài đặt các gói phụ thuộc:
    ```sh
    npm install
    ```
3.  Cấu hình proxy trong `vite.config.ts` để chuyển tiếp các yêu cầu API đến backend.
    ```ts
    // filepath: fontend/vite.config.ts
    // ...existing code...
    export default defineConfig(({ mode }) => {
      const env = loadEnv(mode, ".", "");
      return {
        server: {
          port: 3000,
          host: "0.0.0.0",
          proxy: {
            '/api': {
              target: 'http://localhost:5001',
              changeOrigin: true,
            }
          }
        },
        plugins: [react()],
    // ...existing code...
    ```
4.  Khởi động máy chủ phát triển frontend:
    ```sh
    npm run dev
    ```
    Ứng dụng sẽ có thể truy cập tại `http://localhost:3000`.

## Tài khoản mẫu

Bạn có thể sử dụng các tài khoản sau để đăng nhập, được định nghĩa trong [`backend/sql/seed.sql`](backend/sql/seed.sql):

- **Admin**: `taylor@example.com` / `password`
- **Customer**: `john@example.com` / `password`
