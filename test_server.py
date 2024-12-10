from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

# 切换到测试数据目录
os.chdir('test_data')

# 启动服务器
httpd = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
print("测试服务器运行在 http://localhost:8000")
httpd.serve_forever()
