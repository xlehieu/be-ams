_cat/indices	Liệt kê index, health, size, docs.count
_cat/health	Sức khỏe cluster (green/yellow/red)
_cat/nodes	Danh sách node trong cluster
_cat/shards	Chi tiết shard (nằm ở node nào, primary/replica)
_cat/aliases	Danh sách alias
_cat/count	Đếm số docs
_cat/plugins	Plugin đang cài



?v — verbose

Hiện header cột. Không có v thì mất dòng tiêu đề, khó đọc.

GET _cat/indices        → không có header
GET _cat/indices?v      → có header (health, status, index, docs.count...)
?h= — headers (chọn cột)

Chỉ lấy cột bạn cần, thay vì lấy hết.

GET _cat/indices?h=index,health,docs.count
?format=json

Mặc định _cat trả về text thuần (đẹp khi xem terminal), nhưng nếu bạn cần code parse thì đổi sang JSON.

GET _cat/indices?format=json
?s= — sort

Sắp xếp theo cột.

GET _cat/indices?v&s=docs.count:desc