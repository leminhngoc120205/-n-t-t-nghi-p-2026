"""
IMS Dashboard - Dev Server Launcher
Cách dùng: python app.py
"""

import subprocess
import sys
import os
import time
import webbrowser
import socket
import threading

# ─── Màu sắc terminal ────────────────────────────────────
CYAN   = "\033[96m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def c(text, color):
    return f"{color}{text}{RESET}"

# ─── Kiểm tra cổng có đang bị chiếm không ───────────────
def is_port_in_use(port):
    """Trả về True nếu cổng đang bị chiếm."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", port)) == 0

# ─── Tìm cổng trống ──────────────────────────────────────
def find_free_port(start=3000, end=3020):
    for port in range(start, end):
        if not is_port_in_use(port):
            return port
    return start

# ─── Giải phóng cổng đang bị chiếm (Windows) ────────────
def kill_port(port):
    """Tắt process đang chiếm cổng trên Windows."""
    try:
        # Tìm PID đang dùng cổng
        result = subprocess.run(
            f"netstat -ano | findstr :{port}",
            shell=True, capture_output=True, text=True
        )
        pids = set()
        for line in result.stdout.splitlines():
            parts = line.strip().split()
            if parts and f":{port}" in parts[1]:
                pids.add(parts[-1])
        for pid in pids:
            if pid.isdigit() and pid != "0":
                subprocess.run(
                    f"taskkill /PID {pid} /F",
                    shell=True, capture_output=True
                )
        return len(pids) > 0
    except Exception:
        return False

# ─── Kiểm tra Node.js ────────────────────────────────────
def check_node():
    try:
        r = subprocess.run("node --version", shell=True,
                           capture_output=True, text=True)
        return r.stdout.strip() if r.returncode == 0 else None
    except Exception:
        return None

# ─── Mở trình duyệt khi server sẵn sàng ─────────────────
def wait_and_open_browser(port, dashboard_url):
    for _ in range(60):  # đợi tối đa 60 giây
        if is_port_in_use(port):
            time.sleep(0.8)  # chờ thêm chút cho Next.js ổn định
            print()
            print(c(f"  ✅  Server sẵn sàng!", GREEN))
            print(c(f"  🌐  Đang mở: {dashboard_url}", CYAN))
            print()
            webbrowser.open(dashboard_url)
            return
        time.sleep(1)
    print(c(f"\n  ⚠️  Hết thời gian chờ. Mở thủ công: {dashboard_url}", YELLOW))

# ─── Main ────────────────────────────────────────────────
def main():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)

    # Banner
    print()
    print(c("═" * 58, CYAN))
    print(c("  IMS — Information Management System", BOLD + CYAN))
    print(c("  Đồ án tốt nghiệp 2026", CYAN))
    print(c("═" * 58, CYAN))

    # Kiểm tra Node.js
    node_ver = check_node()
    if not node_ver:
        print(c("\n  ❌  Không tìm thấy Node.js!", RED))
        print("      Hãy cài tại: https://nodejs.org/")
        input("\n  Nhấn Enter để thoát...")
        sys.exit(1)

    print(f"\n  {c('Node.js', YELLOW)} : {node_ver}")

    # Tìm cổng trống
    port = find_free_port()

    # Nếu cổng 3000-3019 đều bị chiếm → hỏi có muốn giải phóng không
    if is_port_in_use(port):
        print(c(f"\n  ⚠️  Cổng {port} đang bị chiếm. Đang giải phóng...", YELLOW))
        killed = kill_port(port)
        time.sleep(1)
        if killed:
            print(c(f"  ✅  Đã giải phóng cổng {port}.", GREEN))
        else:
            # Tìm cổng khác
            port = find_free_port(3010, 3030)
            print(c(f"  ➡️   Dùng cổng dự phòng: {port}", YELLOW))

    dashboard_url = f"http://localhost:{port}/dashboard"

    print(f"  {c('Cổng   ', YELLOW)} : {port}")
    print(f"  {c('URL    ', YELLOW)} : {c(dashboard_url, CYAN)}")
    print()
    print(c("  Đang khởi động Next.js...", YELLOW))
    print(c("─" * 58, CYAN))
    print(c("  Nhấn Ctrl+C để dừng server", YELLOW))
    print(c("─" * 58, CYAN))
    print()

    # Khởi thread mở trình duyệt
    t = threading.Thread(
        target=wait_and_open_browser,
        args=(port, dashboard_url),
        daemon=True
    )
    t.start()

    # Khởi động Next.js
    try:
        process = subprocess.Popen(
            f"npx next dev --port {port}",
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            cwd=project_dir,
        )

        for line in iter(process.stdout.readline, ""):
            stripped = line.rstrip()
            if stripped:
                # Tô màu dòng lỗi
                if any(w in stripped.lower() for w in ["error", "failed", "lỗi"]):
                    print(c(f"  {stripped}", RED))
                elif any(w in stripped.lower() for w in ["warn", "warning"]):
                    print(c(f"  {stripped}", YELLOW))
                elif "ready" in stripped.lower() or "started" in stripped.lower():
                    print(c(f"  {stripped}", GREEN))
                else:
                    print(f"  {stripped}")
                sys.stdout.flush()

        process.wait()

    except KeyboardInterrupt:
        print()
        print(c("─" * 58, CYAN))
        print(c("  ⛔  Server đã dừng. Tạm biệt!", YELLOW))
        print(c("─" * 58, CYAN))
        print()
        try:
            process.terminate()
        except Exception:
            pass
        sys.exit(0)

    except FileNotFoundError:
        print(c("\n  ❌  Không tìm thấy lệnh 'npx'.", RED))
        print("      Hãy cài Node.js tại: https://nodejs.org/")
        input("\n  Nhấn Enter để thoát...")
        sys.exit(1)

    except Exception as e:
        print(c(f"\n  ❌  Lỗi: {e}", RED))
        input("\n  Nhấn Enter để thoát...")
        sys.exit(1)


if __name__ == "__main__":
    main()
