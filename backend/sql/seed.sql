-- Dữ liệu mẫu cho bảng Users
-- Mật khẩu cho cả hai là 'password'
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Taylor Admin', 'taylor@example.com', '123456789', '<bcrypt_hash_for_''password''>', 'admin'),
('John Customer', 'john@example.com', '987654321', '<bcrypt_hash_for_''password''>', 'customer');

-- Dữ liệu mẫu cho bảng Products
INSERT INTO products (name, category, price, cost_price, description, images, variants, stock) VALUES
(
    'Classic Leather Watch', 'Accessories', 150.00, 75.00,
    'A timeless piece that combines classic design with modern functionality. Perfect for any occasion.',
    '{"https://picsum.photos/id/1025/800/800", "https://picsum.photos/id/1026/800/800"}',
    '[{"id": "v1_color", "name": "Color", "options": ["Black", "Brown"]}, {"id": "v1_size", "name": "Size", "options": ["40mm", "44mm"]}]',
    50
),
(
    'Minimalist Desk Lamp', 'Home Goods', 75.50, 30.00,
    'Sleek and modern, this lamp provides perfect lighting for your workspace without cluttering your desk.',
    '{"https://picsum.photos/id/201/800/800", "https://picsum.photos/id/202/800/800"}',
    '[{"id": "v2_color", "name": "Color", "options": ["White", "Gray", "Black"]}]',
    30
),
(
    'Wireless Noise-Cancelling Headphones', 'Electronics', 249.99, 120.00,
    'Immerse yourself in sound. These headphones offer superior noise cancellation and all-day comfort.',
    '{"https://picsum.photos/id/301/800/800", "https://picsum.photos/id/302/800/800"}',
    '[]',
    25
);

-- Dữ liệu mẫu cho bảng Reviews
INSERT INTO reviews (product_id, user_id, author_name, rating, comment, is_hidden) VALUES
(1, 2, 'John Customer', 5, 'Absolutely love this watch! It looks even better in person.', FALSE),
(1, 1, 'Taylor Admin', 4, 'Great quality for the price. The leather is very soft.', FALSE),
(2, 2, 'John Customer', 3, 'It’s a bit smaller than I expected, but it works well.', TRUE); -- Đánh giá này bị ẩn

-- Dữ liệu mẫu cho bảng Orders và Order Items
-- Đơn hàng 1
INSERT INTO orders (user_id, customer_name, customer_email, total_amount, status, shipping_address) VALUES
(
    2, 'John Customer', 'john@example.com', 225.50, 'Delivered',
    '{"fullName": "John Customer", "street": "123 Main St", "city": "Anytown", "state": "CA", "zip": "12345", "country": "USA"}'
) RETURNING id; -- Giả sử id trả về là 1
INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, selected_variant) VALUES
(1, 1, 1, 150.00, '{"Color": "Brown", "Size": "44mm"}'),
(1, 2, 1, 75.50, '{"Color": "White"}');

-- Đơn hàng 2
INSERT INTO orders (user_id, customer_name, customer_email, total_amount, status, shipping_address) VALUES
(
    2, 'John Customer', 'john@example.com', 249.99, 'Processing',
    '{"fullName": "John Customer", "street": "123 Main St", "city": "Anytown", "state": "CA", "zip": "12345", "country": "USA"}'
) RETURNING id; -- Giả sử id trả về là 2
INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES
(2, 3, 1, 249.99);