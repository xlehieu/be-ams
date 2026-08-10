# Roadmap học Elasticsearch (cho dev NestJS + Postgres + TypeORM)

> Mục tiêu: đủ hiểu sâu để tự thiết kế mapping, index dữ liệu từ Postgres, search hiệu quả, và vận hành ổn định trong production — không chỉ dừng ở mức "chạy được".

---

## Giai đoạn 0 — Tư duy nền tảng (trước khi code)

Trước khi viết dòng code nào, cần hiểu rõ ES khác Postgres ở điểm cốt lõi:

- [X] Hiểu ES là **search engine dựa trên Lucene**, không phải database quan hệ — không có transaction/ACID mạnh như Postgres
- [X] Hiểu khái niệm **inverted index** (index ngược) — vì sao search full-text nhanh hơn `LIKE '%...%'` của SQL rất nhiều
- [ ] Hiểu **document, index, mapping** tương ứng gì với **row, table, schema** trong Postgres
- [ ] Hiểu vì sao ES **không nên là nguồn dữ liệu chính (source of truth)** — Postgres vẫn là nơi lưu dữ liệu gốc, ES chỉ là bản sao tối ưu cho search
- [ ] Đọc qua tài liệu chính thức: https://www.elastic.co/guide/en/elasticsearch/reference/current/elasticsearch-intro.html

**Câu hỏi tự kiểm tra:** Nếu ES bị mất dữ liệu hoàn toàn, hệ thống của bạn có bị mất dữ liệu thật không? (Nếu có → bạn đang dùng sai vai trò của ES)

---

## Giai đoạn 1 — Vận hành cơ bản (CRUD document)

- [ ] Cài ES local bằng Docker (`docker-compose` với `elasticsearch` + `kibana`)
- [ ] Làm quen Kibana Dev Tools (giao diện chạy query thay vì curl)
- [ ] Thực hành CRUD document cơ bản:
  - `PUT /index/_doc/1` — tạo/ghi đè document
  - `GET /index/_doc/1` — lấy document theo ID
  - `POST /index/_update/1` — update một phần
  - `DELETE /index/_doc/1` — xoá document
- [ ] Hiểu sự khác nhau giữa `index API` (ghi đè toàn bộ) và `update API` (merge một phần)
- [ ] Thực hành `_bulk API` — insert/update/delete hàng loạt trong 1 request (bắt buộc phải biết vì dữ liệu thật luôn là hàng nghìn/hàng triệu record)
- [ ] Hiểu `_id` tự sinh vs `_id` tự đặt (nên dùng ID từ Postgres làm `_id` trong ES để dễ đồng bộ)

**Thực hành:** Viết script Node.js đọc 100 record từ Postgres (dùng TypeORM) và bulk insert sang ES.

---

## Giai đoạn 2 — Mapping (đã học phần cơ bản, giờ đào sâu)

- [ ] Ôn lại: dynamic mapping vs explicit mapping, `text` vs `keyword`, multi-field
- [ ] Học các field type còn lại chưa dùng tới:
  - `ip` — lưu địa chỉ IP, query theo dải CIDR
  - `geo_point` / `geo_shape` — dữ liệu toạ độ, query bán kính (rất hữu ích nếu có tính năng "tìm gần đây")
  - `range` types (`integer_range`, `date_range`) — lưu khoảng giá trị
  - `alias` — đặt tên khác cho field đã có, hữu ích khi đổi tên field mà không cần reindex
- [ ] Học `object` vs `nested` cho tới khi thật sự hiểu (đã học sơ ở buổi trước — giờ tự làm bài tập)
- [ ] Học `dynamic templates` — quy tắc tự động áp type theo pattern tên field (vd mọi field kết thúc bằng `_at` tự động là `date`)
- [ ] Học giới hạn: **không đổi type field sau khi có dữ liệu** → phải biết quy trình `reindex API` để chuyển dữ liệu sang mapping mới an toàn

**Thực hành:** Tự thiết kế mapping đầy đủ cho 1 entity thật trong dự án của bạn (Department/User/Product...), review lại với checklist: field nào cần keyword, field nào cần nested, field nào không cần index.

---

## Giai đoạn 3 — Analyzer & Full-text search

- [ ] Hiểu pipeline: **character filter → tokenizer → token filter**
- [ ] Thực hành `_analyze API` để xem 1 chuỗi bị tách token như thế nào với từng analyzer
- [ ] Học các analyzer có sẵn: `standard`, `simple`, `whitespace`, `keyword`
- [ ] Tự viết **custom analyzer** (đã học sơ phần asciifolding cho tiếng Việt — giờ mở rộng thêm synonym, stop words)
- [ ] Cài và thử `analysis-icu` plugin cho tiếng Việt/Unicode
- [ ] Tìm hiểu bộ tokenizer tiếng Việt cộng đồng (vd tích hợp qua ICU hoặc service tách từ riêng) nếu dự án cần search tiếng Việt chính xác cao
- [ ] Học **synonym filter** — để search "sếp" ra luôn cả "quản lý", "trưởng phòng"
- [ ] Học **N-gram / Edge N-gram** — dùng cho tính năng autocomplete/gợi ý khi gõ

**Thực hành:** Làm tính năng search-as-you-type (autocomplete) cho 1 field tên trong dự án.

---

## Giai đoạn 4 — Query DSL (phần dùng nhiều nhất hàng ngày)

- [ ] Phân biệt **Query context** (tính điểm relevance, dùng cho search) vs **Filter context** (chỉ đúng/sai, có cache, nhanh hơn — dùng cho điều kiện lọc chắc chắn)
- [ ] Học các query cơ bản:
  - `match` — full-text search 1 field
  - `multi_match` — search nhiều field cùng lúc
  - `term` / `terms` — exact match (dùng với `keyword`)
  - `range` — khoảng giá trị (số, ngày)
  - `bool` (`must`, `should`, `must_not`, `filter`) — kết hợp nhiều điều kiện, **quan trọng nhất, dùng liên tục**
- [ ] Học `match_phrase` — search cụm từ đúng thứ tự
- [ ] Học `fuzziness` — search chấp nhận gõ sai chính tả (fuzzy match)
- [ ] Học **pagination**: `from/size` (đơn giản nhưng chậm với dữ liệu lớn) vs `search_after` (hiệu quả hơn cho deep pagination)
- [ ] Học **sort** nhiều field, sort theo `_score` kết hợp field khác
- [ ] Học **highlight** — tô đậm từ khoá khớp trong kết quả trả về (tính năng UX rất hay dùng)

**Thực hành:** Xây API search department có filter theo status, sort theo tên, highlight từ khoá tìm kiếm, phân trang.

---

## Giai đoạn 5 — Aggregation (thống kê, báo cáo)

- [ ] Hiểu aggregation dùng để làm gì: thống kê, group by, giống `GROUP BY` trong SQL nhưng mạnh hơn nhiều
- [ ] Học **metric aggregations**: `avg`, `sum`, `min`, `max`, `cardinality` (đếm giá trị unique)
- [ ] Học **bucket aggregations**: `terms` (group theo giá trị), `date_histogram` (group theo khoảng thời gian), `range`
- [ ] Học **nested aggregation** kết hợp nhiều tầng (vd: group theo phòng ban, trong mỗi phòng ban tính avg tuổi nhân viên)
- [ ] So sánh hiệu năng aggregation trên ES vs `GROUP BY` trên Postgres với data lớn

**Thực hành:** Làm dashboard thống kê số lượng nhân viên theo từng phòng ban, theo từng tháng gia nhập.

---

## Giai đoạn 6 — Đồng bộ dữ liệu Postgres ↔ Elasticsearch (phần khó nhất thực tế)

Đây là phần hầu hết tutorial không dạy kỹ nhưng lại là vấn đề lớn nhất khi lên production.

- [ ] Hiểu 3 chiến lược đồng bộ phổ biến và trade-off của từng loại:
  1. **Đồng bộ đồng thời (dual write)** — mỗi lần ghi Postgres thì ghi luôn ES trong cùng transaction logic. Đơn giản nhưng dễ lệch dữ liệu nếu 1 trong 2 bên fail.
  2. **Đồng bộ qua queue/event** (RabbitMQ, Kafka, BullMQ...) — ghi Postgres xong bắn event, worker riêng nghe event và update ES. An toàn hơn, decoupled, nhưng cần hạ tầng thêm.
  3. **CDC (Change Data Capture)** — dùng công cụ như Debezium đọc trực tiếp WAL log của Postgres, tự động đẩy thay đổi sang ES real-time. Mạnh nhất nhưng phức tạp nhất để setup.
- [ ] Học cách xử lý **out-of-order update** (event đến ES không đúng thứ tự do queue) — dùng `version`/`seq_no` của ES để tránh ghi đè dữ liệu mới bằng dữ liệu cũ
- [ ] Học **reindex chiến lược zero-downtime**: dùng alias để chuyển traffic từ index cũ sang index mới không gián đoạn
- [ ] Viết cron job hoặc endpoint "resync toàn bộ" để chữa lệch dữ liệu khi cần (luôn cần có, không có hệ thống nào đồng bộ hoàn hảo 100%)

**Thực hành:** Chọn 1 trong 3 chiến lược, tự triển khai đồng bộ 1 chiều Postgres → ES cho entity Department của bạn, có xử lý update/delete.

---

## Giai đoạn 7 — Vận hành & hiệu năng (production-ready)

- [ ] Hiểu **shard & replica** — vì sao chọn số lượng shard sai lúc đầu rất khó sửa (giống chọn sai `dynamic` mapping, phải reindex)
- [ ] Học cách dùng **alias** để tách biệt tên index logic khỏi tên index vật lý — bắt buộc cho reindex an toàn
- [ ] Học `_refresh` interval — vì sao document mới insert đôi khi chưa search thấy ngay (near real-time, không phải real-time)
- [ ] Học cách theo dõi cluster health (`green/yellow/red`), disk watermark, memory usage
- [ ] Học index lifecycle management (ILM) nếu dữ liệu có tính chất theo thời gian (logs, event) cần tự động xoá dữ liệu cũ
- [ ] Học cách viết health check endpoint tích hợp vào NestJS (đã làm ở phần trước — giờ mở rộng thêm check shard status)
- [ ] Học bảo mật cơ bản: API key, role-based access control nếu ES expose ra ngoài

**Thực hành:** Setup alias cho index Department, viết script reindex an toàn chuyển traffic mà API không downtime.

---

## Tài liệu tham khảo nên đọc song song

- Elasticsearch official guide: https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html
- Elasticsearch: The Definitive Guide (sách miễn phí, hơi cũ nhưng nền tảng vẫn đúng): https://www.elastic.co/guide/en/elasticsearch/guide/current/index.html
- `@elastic/elasticsearch` Node.js client docs: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/introduction.html
- `@nestjs/elasticsearch` package docs (bạn đang dùng sẵn)

---

## Gợi ý thứ tự học thực tế

Không cần học tuần tự cứng nhắc từng giai đoạn xong mới qua giai đoạn sau. Cách hiệu quả hơn:

1. Học giai đoạn 1–2–4 trước (CRUD, mapping, query cơ bản) — đủ để làm tính năng search thật trong dự án
2. Vừa làm dự án thật vừa quay lại học giai đoạn 3 (analyzer) khi gặp vấn đề search không chính xác
3. Học giai đoạn 5 (aggregation) khi có yêu cầu thống kê/dashboard thật
4. Giai đoạn 6 (đồng bộ dữ liệu) học sớm nhất có thể, vì đây là phần quyết định dự án có "sống" được lâu dài hay không
5. Giai đoạn 7 (vận hành) học dần khi hệ thống bắt đầu có traffic thật, không cần học sâu ngay từ đầu