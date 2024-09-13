from http.server import SimpleHTTPRequestHandler, HTTPServer
import webbrowser
import threading

# Define request handler
class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(b"<html><body><h1>Welcome to the Python HTTP Server!</h1></body></html>")
        elif self.path == "/data":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"message": "Hello from Python!"}')
        else:
            self.send_response(404)
            self.end_headers()

# Function to start the server
def run_server():
    server_address = ('localhost', 8000)
    httpd = HTTPServer(server_address, CustomHandler)
    print(f"Starting server on {server_address[0]}:{server_address[1]}")
    httpd.serve_forever()

# Function to open the browser automatically
def open_browser():
    webbrowser.open("http://localhost:8000")

# Running server and browser in parallel
if __name__ == "__main__":
    threading.Thread(target=run_server).start()
    threading.Thread(target=open_browser).start()
