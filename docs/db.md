departments — Phòng ban
Field	Kiểu	Ghi chú
id	uuid (PK)	
code	string, unique	
name	string	
parent_id	uuid, FK → departments, nullable	Phòng ban cha (nếu có phòng ban con)
created_at / updated_at	datetime	
6. suppliers — Nhà cung cấp
Field	Kiểu	Ghi chú
id	uuid (PK)	
code	string, unique	
name	string	
tax_code	string, nullable	
address	string, nullable	
phone	string, nullable	
email	string, nullable	
contact_person	string, nullable	
created_at / updated_at	datetime	
7. asset_categories — Danh mục tài sản
Field	Kiểu	Ghi chú
id	uuid (PK)	
code	string, unique	
name	string	
parent_id	uuid, FK → asset_categories, nullable	
useful_life_months	int, nullable	Vòng đời sử dụng (phục vụ khấu hao)
depreciation_method	enum, nullable	STRAIGHT_LINE / DECLINING_BALANCE
created_at / updated_at	datetime	
8. assets — Tài sản
Field	Kiểu	Ghi chú
id	uuid (PK)	
asset_code	string, unique	
qr_code	string, unique, nullable	
name	string	
category_id	uuid, FK → asset_categories	
serial_number	string, nullable	
model	string, nullable	
manufacturer	string, nullable	
supplier_id	uuid, FK → suppliers, nullable	
purchase_date	date, nullable	
purchase_price	decimal(18,2), nullable	
warranty_expiry	date, nullable	
status	enum	IN_STOCK, IN_USE, MAINTENANCE, RESERVED, DISPOSED, LOST, DAMAGED
condition	string, nullable	Tình trạng: tốt/trung bình/hỏng
current_location	string, nullable	Vị trí đặt (vd: "Phòng 301", "Kho A") — text đơn giản vì 1 công ty
current_holder_id	uuid, FK → users, nullable	Người đang giữ tài sản
image_url	string, nullable	
note	string, nullable	
created_at / updated_at	datetime	
9. asset_assignments — Lịch sử cấp phát/thu hồi
Field	Kiểu	Ghi chú
id	uuid (PK)	
asset_id	uuid, FK → assets	
assigned_to_id	uuid, FK → users	Người nhận
assigned_by_id	uuid, FK → users	Người cấp phát
assigned_at	datetime	
due_date	date, nullable	
returned_at	datetime, nullable	
status	enum	ACTIVE, RETURNED, TRANSFERRED
note	string, nullable	
created_at / updated_at	datetime	
10. asset_maintenances — Bảo trì/sửa chữa
Field	Kiểu	Ghi chú
id	uuid (PK)	
asset_id	uuid, FK → assets	
type	enum	MAINTENANCE, REPAIR, CALIBRATION
vendor_id	uuid, FK → suppliers, nullable	
cost	decimal(18,2), nullable	
start_date	date	
end_date	date, nullable	
status	enum	SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
description	string, nullable	
created_at / updated_at	datetime	
11. asset_depreciations — Khấu hao
Field	Kiểu	Ghi chú
id	uuid (PK)	
asset_id	uuid, FK → assets	
period	date	Kỳ khấu hao (tháng/năm)
depreciation_amount	decimal(18,2)	
accumulated_depreciation	decimal(18,2)	
book_value	decimal(18,2)	Giá trị còn lại
created_at	datetime	
— unique (asset_id, period)		Tránh tính trùng kỳ
12. asset_disposals — Thanh lý
Field	Kiểu	Ghi chú
id	uuid (PK)	
asset_id	uuid, FK → assets, unique	1 tài sản chỉ thanh lý 1 lần
disposal_date	date	
method	enum	SOLD, DONATED, SCRAPPED, LOST
reason	string, nullable	
disposal_value	decimal(18,2), nullable	
approved_by_id	uuid, FK → users, nullable	
created_at	datetime	
13. inventory_checks — Đợt kiểm kê
Field	Kiểu	Ghi chú
id	uuid (PK)	
name	string	
start_date	date	
end_date	date, nullable	
status	enum	PLANNING, IN_PROGRESS, COMPLETED
created_at / updated_at	datetime	
14. inventory_check_details — Chi tiết kiểm kê
Field	Kiểu	Ghi chú
id	uuid (PK)	
inventory_check_id	uuid, FK → inventory_checks	
asset_id	uuid, FK → assets	
expected_status	enum	Trạng thái theo hệ thống
actual_status	enum, nullable	Trạng thái thực tế kiểm kê
checked_by_id	uuid, FK → users, nullable	
checked_at	datetime, nullable	
note	string, nullable	
15. asset_documents — File đính kèm
Field	Kiểu	Ghi chú
id	uuid (PK)	
asset_id	uuid, FK → assets	
type	string	invoice, warranty, manual, image...
file_url	string	
uploaded_at	datetime	
16. audit_logs — Nhật ký thay đổi
Field	Kiểu	Ghi chú
id	uuid (PK)	
table_name	string	
record_id	uuid	
action	string	CREATE / UPDATE / DELETE
changed_by_id	uuid, FK → users, nullable	
old_value	json, nullable	
new_value	json, nullable	
created_at	datetime