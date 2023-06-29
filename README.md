# Tiến Lên Miền Nam Bot - TLMN Bot
API bot tiến lên miền nam, đánh bài như 1 người bình thường

Đầu vào là trạng thái bàn chơi, đầu ra là lựa chọn tối ưu cho lượt hiện tại

API miễn phí, sử dụng làm game offline hoặc online đều được
# Cấu trúc API
```
POST https://turing-mark-391110.as.r.appspot.com/tlmn/bot
Content-Type: application/json
```
Body:

- ps `Array`: danh sách người đang chơi trên bàn, theo thứ tự vòng, bắt đầu từ ai cũng được , miễn là theo vòng
- ct `Number`: vị trí của bot phiên hiện tại ở trong ps trên, vị trí đầu tiên là 0
- mc `Array`: bộ bài trên bàn cần phải chặn, nếu vòng mới thì không cần, mặc định là rỗng
- if `Number`: ván đầu tiên của bàn, cần phải đánh 3 Bích trước thì đặt if là 1, còn không thì không cần, mặc định là 0
