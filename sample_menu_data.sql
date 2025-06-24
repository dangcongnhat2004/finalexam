-- Sample menu data with Vietnamese dishes and VND pricing
-- Run this script in HeidiSQL to populate your menu

INSERT INTO menu_items (name, description, price, category, available, imageUrl, icon) VALUES 
-- Món khai vị (Appetizers)
('Gỏi Cuốn', 'Gỏi cuốn tôm thịt tươi ngon với rau thơm', 45000, 'appetizers', true, './images/goi-cuon.jpg', '🥗'),
('Chả Cá Lã Vọng', 'Chả cá truyền thống Hà Nội với bánh tráng', 85000, 'appetizers', true, './images/cha-ca.jpg', '🐟'),
('Nem Nướng Nha Trang', 'Nem nướng thơm ngon đặc sản Nha Trang', 65000, 'appetizers', true, './images/nem-nuong.jpg', '🍢'),
('Bánh Mì Thịt Nướng', 'Bánh mì giòn với thịt nướng thơm lừng', 35000, 'appetizers', true, './images/banh-mi.jpg', '🥖'),

-- Món chính (Main dishes)
('Phở Bò Tái', 'Phở bò tái truyền thống với nước dùng đậm đà', 85000, 'mains', true, './images/pho-bo.jpg', '🍜'),
('Bún Bò Huế', 'Bún bò Huế cay nồng đặc trưng miền Trung', 75000, 'mains', true, './images/bun-bo-hue.jpg', '🍲'),
('Cơm Tấm Sườn Nướng', 'Cơm tấm sườn nướng với chả trứng', 95000, 'mains', true, './images/com-tam.jpg', '🍚'),
('Bánh Xèo Miền Tây', 'Bánh xèo giòn rụm với tôm thịt đầy đặn', 120000, 'mains', true, './images/banh-xeo.jpg', '🥞'),
('Cà Ri Gà', 'Cà ri gà thơm ngon ăn kèm bánh mì', 110000, 'mains', true, './images/ca-ri-ga.jpg', '🍛'),
('Lẩu Thái Hải Sản', 'Lẩu Thái chua cay với hải sản tươi sống', 450000, 'mains', true, './images/lau-thai.jpg', '🍲'),

-- Tráng miệng (Desserts)
('Chè Ba Màu', 'Chè ba màu truyền thống mát lạnh', 25000, 'desserts', true, './images/che-ba-mau.jpg', '🍧'),
('Bánh Flan', 'Bánh flan mềm mịn thơm ngon', 30000, 'desserts', true, './images/banh-flan.jpg', '🍮'),
('Chè Đậu Xanh', 'Chè đậu xanh nước cốt dừa thơm béo', 28000, 'desserts', true, './images/che-dau-xanh.jpg', '🥥'),
('Kem Xôi', 'Kem xôi dẻo ngọt mát lạnh', 35000, 'desserts', true, './images/kem-xoi.jpg', '🍨'),
('Bánh Chuối Nướng', 'Bánh chuối nướng thơm lừng', 40000, 'desserts', true, './images/banh-chuoi.jpg', '🍌'),

-- Đồ uống (Beverages)
('Cà Phê Sữa Đá', 'Cà phê sữa đá đậm đà truyền thống', 25000, 'beverages', true, './images/ca-phe-sua-da.jpg', '☕'),
('Trà Đá Chanh', 'Trà đá chanh tươi mát giải khát', 15000, 'beverages', true, './images/tra-da-chanh.jpg', '🍋'),
('Nước Mía', 'Nước mía tươi ngọt mát', 20000, 'beverages', true, './images/nuoc-mia.jpg', '🌾'),
('Sinh Tố Bơ', 'Sinh tố bơ béo ngậy thơm ngon', 35000, 'beverages', true, './images/sinh-to-bo.jpg', '🥑'),
('Trà Sữa Trân Châu', 'Trà sữa trân châu đường đen', 45000, 'beverages', true, './images/tra-sua.jpg', '🧋'),
('Nước Dừa Tươi', 'Nước dừa tươi mát lạnh tự nhiên', 30000, 'beverages', true, './images/nuoc-dua.jpg', '🥥');

-- Update existing items to VND if any exist
-- UPDATE menu_items SET price = price * 24000 WHERE price < 1000;

-- Check the inserted data
-- SELECT * FROM menu_items ORDER BY category, name;