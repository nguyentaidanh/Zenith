# Zenith - Frontend

Đây là ứng dụng client cho nền tảng thương mại điện tử Zenith, được xây dựng bằng React, TypeScript và Vite.

## Tính năng

- **Giao diện người dùng:**
  - Duyệt và tìm kiếm sản phẩm.
  - Xem chi tiết sản phẩm và đánh giá.
  - Giỏ hàng và quy trình thanh toán.
  - Trang hồ sơ người dùng với lịch sử đơn hàng.
- **Bảng điều khiển quản trị:**
  - Tổng quan thống kê (doanh thu, đơn hàng, người dùng).
  - Quản lý sản phẩm (Thêm/Sửa/Xóa).
  - Quản lý đơn hàng và người dùng.
  - Quản lý đánh giá sản phẩm.

## Công nghệ

- **Framework**: React
- **Trình đóng gói**: Vite
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS
- **Định tuyến**: React Router DOM
- **Quản lý trạng thái**: React Context API (`useReducer`)
- **Thư viện biểu đồ**: Chart.js

## Cài đặt và Chạy

1.  **Cài đặt các gói phụ thuộc:**

    ```sh
    npm install
    ```

2.  **Cấu hình môi trường:**
    Đảm bảo backend đang chạy. Frontend được cấu hình để proxy các yêu cầu `/api` đến máy chủ backend (mặc định là `http://localhost:5001`).

3.  **Chạy máy chủ phát triển:**
    ```sh
    npm run dev
    ```
    Ứng dụng sẽ có sẵn tại `http://localhost:3000`.

## Xây dựng cho Production

Để tạo một bản dựng tối ưu hóa cho production, hãy chạy:

```sh
npm run build
```

Các tệp đã xây dựng sẽ được đặt trong thư mục `dist/`.

## Cấu trúc thư mục

- **`components/`**: Các thành phần React có thể tái sử dụng.
  - `components/admin/`: Các thành phần dành riêng cho bảng điều khiển quản trị.
- **`pages/`**: Các thành phần đại diện cho các trang hoàn chỉnh của ứng dụng.
  - `pages/admin/`: Các trang dành cho bảng điều khiển quản trị.
- **`context/`**: Các nhà cung cấp React Context để quản lý trạng thái toàn cục (ví dụ: [`StoreContext.tsx`](./context/StoreContext.tsx)).
- **`utils/api.ts`**: Các hàm để tương tác với API backend.
- **`types.ts`**: Các định nghĩa kiểu TypeScript chung.
