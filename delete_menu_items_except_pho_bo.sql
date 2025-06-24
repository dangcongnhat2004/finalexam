-- Script để xóa tất cả món ăn trừ Phở Bò Tái
-- Chạy script này trong HeidiSQL hoặc MySQL Workbench

-- Xóa tất cả món ăn trừ Phở Bò Tái
DELETE FROM menu_items 
WHERE name != '';

-- Kiểm tra kết quả sau khi xóa
SELECT * FROM menu_items;

-- Nếu muốn reset lại ID về 1 cho món còn lại (tùy chọn)
-- ALTER TABLE menu_items AUTO_INCREMENT = 1;

-- Thông báo hoàn thành
SELECT 'Đã xóa thành công tất cả món ăn' as message;