# Tiến Lên Miền Nam Bot - TLMN Bot
API bot tiến lên miền nam, đánh bài như 1 người bình thường

Đầu vào là trạng thái bàn chơi, đầu ra là lựa chọn tối ưu cho lượt hiện tại

API miễn phí, sử dụng làm game offline hoặc online đều được
# Cấu trúc API
```
POST https://turing-mark-391110.as.r.appspot.com/tlmn/bot
Content-Type: application/json
```
**Body:**

- ps `Array` `*`: danh sách người đang chơi trên bàn, theo thứ tự vòng, bắt đầu từ ai cũng được , miễn là theo vòng
  
  Mỗi người chơi là 1 `Object` bao gồm:
  - cs `Array` `*` : bộ bài trên tay
  - hb `Int`: vòng này còn đánh hay đã bỏ bài, đã bỏ bài thì hb = 1, mặc định không có
  - ir `Int`: nếu đây là người chơi thật thì khi thêm ir = 1 sẽ tăng độ khó cho game, bot sẽ ưu tiên chú ý player này, mặc định không có
- ct `Int` `*`: vị trí của bot phiên hiện tại ở trong ps trên, vị trí đầu tiên là 0
- mc `Array`: bộ bài trên bàn cần phải chặn, vòng mới và mặc định là không có
- if `Int`: ván đầu tiên của bàn, cần phải đánh 3 Bích trước thì đặt if là 1, mặc định không có

<sub>Chú thích: 
  `*` trường bắt buộc phải có
</sub>

**Response**
- err `Int`: mã lỗi, bằng 0 là không có lỗi, khác 0 là có lỗi(xem mã lỗi bên dưới)
- cs `Array`: bộ bài mà bot chọn ra để đánh, chỉ có khi err = 0

52 lá bài có id từ 0-51, thứ tự tăng dần từ 3->JQKA2, chất tăng theo thứ tự bích tép rô cơ, trong đó:
```
0 = 3 bích
1 = 3 tép
2 = 3 rô
3 = 3 cơ
4 = 4 bích
5 = 4 tép
......
46 = A rô
47 = A cơ
48 = 2 bích
49 = 2 tép
50 = 2 rô
51 = 2 cơ
```
Ví dụ data gửi
```
{"ps":[{"cs":[16,19,38,51],"ir":1},{"cs":[5,18,48],"hb":1},{"cs":[1,8,10,11,17,21,23,25,28,30,40]}],"ct":2,"mc":[2,6,9]}
```
Mã lỗi:
```
1 : Gửi sai định dạng
2 : Danh sách người chơi sai định dạng (ít hơn 2n ...)
3 : Bài không hợp lệ ( mỗi lá bài phải là 1 số từ 1 đến 51 )
4 : Không tìm thấy bot (ct và ps không khớp, ct phải là vị trí của bot trong mảng ps, vị trí đầu là 0)
5 : Ván đầu tiên nhưng lại có bài trên bàn cần chặt?
6 : Đã bỏ bài hết hặc chỉ còn 1 người
7 : Gửi thừa dữ liệu. Chỉ truyền các dữ liệu được liệt kê trong hướng dẫn, không truyền dư thừa các giá trị khác
```

# Lưu ý :
- API đang được phát triển để nâng cấp khả năng của Bot nên sau này sẽ có những sửa đổi về cấu trúc API, các bạn cần lưu ý khi sử dụng.
- Nếu có bất kỳ câu hỏi cũng như đóng góp nào, vui lòng liên hệ với chúng tôi

# API cũng cấp miễn phí. Chúng tôi không chịu trách nhiệm cho mục đích sử dụng của người dùng
