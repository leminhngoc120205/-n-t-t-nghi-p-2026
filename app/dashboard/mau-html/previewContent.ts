/* HTML content cho mẫu Interactive1 — scrollytelling về 12 ngày đêm 1972 */
export const INTERACTIVE1_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Be Vietnam Pro',system-ui,-apple-system,sans-serif;color:#1a1a1a;overflow-x:hidden}

/* HERO */
.hero{background:linear-gradient(180deg,#0a1628 0%,#0f2248 100%);color:white;padding:56px 40px;min-height:300px}
.hero .label{color:#17c3d8;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin-bottom:14px;font-family:sans-serif}
.hero h1{font-size:24px;line-height:1.35;margin-bottom:14px;max-width:560px}
.hero .meta{color:#94a3b8;font-size:12px;margin-bottom:18px;font-family:sans-serif}
.hero p{color:#cbd5e1;font-size:13.5px;line-height:1.9;max-width:560px}

/* SECTION */
.section{padding:44px 40px}
.section h2{font-size:21px;margin-bottom:18px;color:#0a1628;border-left:4px solid #17c3d8;padding-left:12px}
.section p{font-size:13.5px;line-height:1.9;color:#374151;margin-bottom:12px}
.img-ph{background:linear-gradient(135deg,#e2e8f0,#f1f5f9);height:200px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:13px;font-family:sans-serif;margin:22px 0;border:1px dashed #cbd5e1}

/* BANNER */
.banner{background:linear-gradient(160deg,#0a1628 0%,#1e3a5f 100%);color:white;text-align:center;padding:64px 40px}
.banner .sub{color:#17c3d8;font-size:10px;text-transform:uppercase;letter-spacing:4px;font-family:sans-serif;margin-bottom:10px}
.banner h2{font-size:34px;color:#fbbf24;letter-spacing:2px;margin-bottom:6px}
.banner .dates{color:#94a3b8;font-size:13px;font-family:sans-serif;margin-bottom:10px}
.banner .tagline{color:#cbd5e1;font-size:12px;font-family:sans-serif}

/* TIMELINE */
.tl-section{padding:44px 20px;background:#f8fafc}
.tl-section>h2{text-align:center;font-size:21px;color:#0a1628;margin-bottom:36px}
.tl-wrap{position:relative;max-width:680px;margin:0 auto}
.tl-line{position:absolute;left:50%;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,#17c3d8,#0e7c8a);transform:translateX(-50%)}
.tl-item{display:flex;align-items:flex-start;margin-bottom:36px;position:relative;gap:0}
.tl-card{width:43%;background:white;border-radius:10px;padding:14px;box-shadow:0 2px 12px rgba(0,0,0,0.08);flex-shrink:0}
.tl-card h4{font-size:12.5px;font-weight:bold;color:#0a1628;margin-bottom:5px}
.tl-card p{color:#6b7280;font-size:11.5px;line-height:1.7;font-family:sans-serif}
.tl-blank{width:43%;flex-shrink:0}
.tl-mid{width:14%;display:flex;justify-content:center;align-items:flex-start;padding-top:10px;flex-shrink:0}
.tl-dot{background:#17c3d8;color:white;border-radius:999px;padding:4px 9px;font-size:8.5px;font-weight:bold;font-family:sans-serif;white-space:nowrap;border:2px solid white;box-shadow:0 2px 8px rgba(23,195,216,0.35);position:relative;z-index:2}

/* CAROUSEL */
.car-section{padding:44px 40px}
.car-section>h2{font-size:21px;color:#0a1628;margin-bottom:22px;border-left:4px solid #fbbf24;padding-left:12px}
.car-wrap{overflow:hidden;border-radius:10px;border:1px solid #e2e8f0}
.car-track{display:flex;transition:transform 0.42s cubic-bezier(0.4,0,0.2,1)}
.car-slide{min-width:100%}
.slide-body{display:flex}
.slide-img{width:42%;height:190px;display:flex;align-items:center;justify-content:center;font-size:11.5px;font-family:sans-serif;font-weight:bold;color:white;text-align:center;padding:10px;cursor:pointer;transition:transform 0.25s,filter 0.25s;flex-shrink:0}
.slide-img:hover{transform:scale(1.03);filter:brightness(1.1)}
.slide-text{padding:18px 22px;flex:1}
.slide-text .tag{display:inline-block;background:#e8f7f9;color:#17a2b8;font-size:9.5px;font-family:sans-serif;font-weight:bold;padding:2px 8px;border-radius:4px;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}
.slide-text h4{font-size:14px;font-weight:bold;color:#0a1628;margin-bottom:6px}
.slide-text p{font-size:12.5px;color:#4b5563;line-height:1.8;font-family:sans-serif}
.car-nav{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#f8fafc;border-top:1px solid #e2e8f0}
.nav-btn{background:#17a2b8;color:white;border:none;padding:7px 16px;border-radius:6px;cursor:pointer;font-size:12.5px;font-weight:bold;font-family:sans-serif;transition:background 0.18s}
.nav-btn:hover{background:#138496}
.dots-row{display:flex;gap:7px;align-items:center}
.dot{width:8px;height:8px;border-radius:50%;background:#cbd5e1;cursor:pointer;transition:all 0.2s}
.dot.on{background:#17a2b8;transform:scale(1.25)}
.car-ctr{font-size:11.5px;color:#6b7280;font-family:sans-serif}
</style>
</head>
<body>

<div class="hero">
  <div class="label">&#128197; Lịch sử &middot; 12 ngày đêm &middot; Tháng 12/1972</div>
  <h1>Cuộc đối đầu trên bầu trời Hà Nội năm 1972</h1>
  <div class="meta">Bởi ban biên tập lịch sử &middot; Cập nhật 12/12/2024</div>
  <p>Từ ngày 18 đến 29/12/1972, không quân Mỹ tiến hành chiến dịch Linebacker II — ném bom rải thảm Hà Nội bằng máy bay chiến lược B-52. Đây là một trong những chiến dịch ném bom dữ dội nhất lịch sử chiến tranh hiện đại và kết thúc bằng thất bại thảm hại của không lực Hoa Kỳ.</p>
</div>

<div class="section">
  <h2>Sức mạnh B-52 Stratofortress</h2>
  <p>Boeing B-52 là máy bay ném bom chiến lược tầm xa của Không quân Mỹ. Mỗi chiếc dài 48m, sải cánh 56m, có thể mang tới <strong>32 tấn vũ khí</strong> các loại. Tốc độ tối đa 1.000 km/h, tầm bay 14.000 km không cần tiếp nhiên liệu.</p>
  <div class="img-ph">&#9992;&#65039; &nbsp; Hình ảnh minh họa: Máy bay B-52 Stratofortress</div>
  <p>Trong chiến dịch Linebacker II, Mỹ huy động tới <strong>193 lần chiếc B-52</strong> cùng hàng trăm máy bay chiến thuật hộ tống, thả hơn <strong>20.000 tấn bom</strong> xuống Hà Nội, Hải Phòng và nhiều tỉnh thành khác.</p>
  <p>Người Mỹ tự tin rằng B-52 sẽ "bất khả xâm phạm" — nhưng họ đã sai.</p>
</div>

<div class="banner">
  <div class="sub">&#9889; Trận quyết định</div>
  <h2>12 Ngày Đêm Lịch Sử</h2>
  <div class="dates">18 – 29 tháng 12 năm 1972</div>
  <div class="tagline">"Điện Biên Phủ trên không" — Chiến thắng vang dội của quân dân Việt Nam</div>
</div>

<div class="tl-section">
  <h2>Diễn biến theo thời gian</h2>
  <div class="tl-wrap">
    <div class="tl-line"></div>
    <div class="tl-item">
      <div class="tl-card"><h4>&#127919; Mở màn chiến dịch</h4><p>Đêm 18/12, 129 lần chiếc B-52 tập kích Hà Nội. Tên lửa SAM-2 khai hỏa — chiếc B-52 đầu tiên bị bắn hạ ngay trong đêm đầu.</p></div>
      <div class="tl-mid"><div class="tl-dot">18-19/12</div></div>
      <div class="tl-blank"></div>
    </div>
    <div class="tl-item">
      <div class="tl-blank"></div>
      <div class="tl-mid"><div class="tl-dot">20-23/12</div></div>
      <div class="tl-card"><h4>&#128293; Tăng cường hỏa lực</h4><p>Mỹ leo thang, mở rộng ném bom sang Thái Nguyên, Hải Phòng. Quân ta bắn hạ thêm nhiều B-52, buộc phi công Mỹ thay đổi chiến thuật.</p></div>
    </div>
    <div class="tl-item">
      <div class="tl-card"><h4>&#11088; Đêm Giáng sinh</h4><p>24/12, Mỹ tạm dừng ném bom. Quân dân Hà Nội tranh thủ củng cố trận địa và cứu thương. Tinh thần chiến đấu vẫn nguyên vẹn.</p></div>
      <div class="tl-mid"><div class="tl-dot">24/12</div></div>
      <div class="tl-blank"></div>
    </div>
    <div class="tl-item">
      <div class="tl-blank"></div>
      <div class="tl-mid"><div class="tl-dot">29/12</div></div>
      <div class="tl-card"><h4>&#127942; Chiến thắng hoàn toàn</h4><p>29/12, Mỹ tuyên bố ngừng ném bom từ vĩ tuyến 20 trở ra Bắc. Tổng cộng 34 B-52 bị bắn hạ. Nixon thất bại hoàn toàn.</p></div>
    </div>
  </div>
</div>

<div class="car-section">
  <h2>Những khoảnh khắc lịch sử</h2>
  <div class="car-wrap">
    <div class="car-track" id="ct">
      <div class="car-slide"><div class="slide-body">
        <div class="slide-img" style="background:linear-gradient(135deg,#1e3a5f,#2d5f8a)">&#127919;<br>Trận địa<br>tên lửa SAM-2</div>
        <div class="slide-text"><div class="tag">Vũ khí chiến lược</div><h4>Trận địa tên lửa SAM-2</h4><p>Hệ thống tên lửa phòng không SAM-2 là vũ khí chủ lực bảo vệ bầu trời Hà Nội. Trong 12 ngày đêm, bộ đội ta bắn hạ <strong>34 B-52</strong> bằng loại tên lửa này — chiến tích vang dội nhất lịch sử phòng không Việt Nam.</p></div>
      </div></div>
      <div class="car-slide"><div class="slide-body">
        <div class="slide-img" style="background:linear-gradient(135deg,#2d1b00,#4a3000);border:2px dashed #6b5a00;color:#fbbf24">&#9888;&#65039;<br>[Ảnh lỗi]<br>Tiêm kích MiG-21</div>
        <div class="slide-text"><div class="tag">Không chiến</div><h4>Tiêm kích MiG-21 "Fishbed"</h4><p>Phi công Việt Nam điều khiển tiêm kích MiG-21 thực hiện các trận không chiến táo bạo, ngăn chặn máy bay hộ tống, tạo điều kiện tên lửa tiêu diệt B-52.</p></div>
      </div></div>
      <div class="car-slide"><div class="slide-body">
        <div class="slide-img" style="background:linear-gradient(135deg,#1a2744,#2d3f6b)">&#127961;&#65039;<br>Hà Nội<br>kiên cường</div>
        <div class="slide-text"><div class="tag">Tinh thần nhân dân</div><h4>Hà Nội kiên cường dưới làn bom</h4><p>Dù hứng chịu hàng chục nghìn tấn bom, người dân Hà Nội vẫn bám trụ. Các tổ dân phòng, đội cứu thương hoạt động không ngừng nghỉ suốt 12 ngày đêm.</p></div>
      </div></div>
      <div class="car-slide"><div class="slide-body">
        <div class="slide-img" style="background:linear-gradient(135deg,#1a3a1a,#2d6b2d)">&#127942;<br>Chiến thắng<br>lịch sử</div>
        <div class="slide-text"><div class="tag">Kết quả lịch sử</div><h4>Chiến thắng "Điện Biên Phủ trên không"</h4><p><strong>34 B-52 bị bắn hạ</strong>. Nixon ký Hiệp định Paris ngày 27/1/1973, chấm dứt chiến tranh xâm lược — đỉnh cao của ý chí Việt Nam.</p></div>
      </div></div>
    </div>
    <div class="car-nav">
      <button class="nav-btn" onclick="cp()">&#8592; Trước</button>
      <div class="dots-row">
        <div class="dot on" id="d0" onclick="cg(0)"></div>
        <div class="dot" id="d1" onclick="cg(1)"></div>
        <div class="dot" id="d2" onclick="cg(2)"></div>
        <div class="dot" id="d3" onclick="cg(3)"></div>
      </div>
      <span class="car-ctr" id="cc">1 / 4</span>
      <button class="nav-btn" onclick="cn()">Sau &#8594;</button>
    </div>
  </div>
</div>

<script>
var c=0,t=4;
function upd(){
  document.getElementById('ct').style.transform='translateX(-'+(c*100)+'%)';
  for(var i=0;i<t;i++){var d=document.getElementById('d'+i);if(d)d.className='dot'+(i===c?' on':'');}
  document.getElementById('cc').textContent=(c+1)+' / '+t;
}
function cn(){c=(c+1)%t;upd();}
function cp(){c=(c-1+t)%t;upd();}
function cg(n){c=n;upd();}
</script>
</body>
</html>`

/* HTML đơn giản cho các mẫu còn lại */
export function makeSimpleHTML(name: string, desc: string, color1: string, color2: string): string {
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;padding:40px;background:#f8fafc}
.hero{background:linear-gradient(135deg,${color1},${color2});color:white;padding:48px 40px;border-radius:12px;margin-bottom:24px;text-align:center}
.hero h1{font-size:26px;margin-bottom:8px}.hero p{font-size:14px;opacity:0.85}
.card{background:white;border-radius:8px;padding:24px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.card h3{color:#0a1628;margin-bottom:8px;font-size:16px}.card p{color:#6b7280;font-size:13px;line-height:1.8}
.ph{background:#e2e8f0;height:160px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:13px;font-family:sans-serif;margin:16px 0}
</style></head><body>
<div class="hero"><h1>${name}</h1><p>${desc}</p></div>
<div class="card"><h3>Phần nội dung 1</h3><p>Đây là vùng nội dung của mẫu HTML. Trong mẫu thực tế, đây sẽ chứa các thành phần tương tác được lập trình sẵn.</p><div class="ph">&#128247; Hình ảnh minh họa</div></div>
<div class="card"><h3>Phần nội dung 2</h3><p>Mẫu HTML cho phép nhà báo nhúng nội dung tương tác vào bài viết mà không cần kiến thức lập trình chuyên sâu.</p></div>
<div class="card"><h3>Phần nội dung 3</h3><p>Hỗ trợ đa nền tảng: Desktop, Tablet và Mobile. Tất cả tương tác đều được kiểm thử trên nhiều thiết bị.</p></div>
</body></html>`
}
