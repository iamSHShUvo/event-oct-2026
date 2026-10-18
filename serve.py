from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
import re


class RangeRequestHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.range_to_send = None
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().send_head()

        try:
            file = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(file.fileno()).st_size
        range_header = self.headers.get("Range")
        selected_range = None

        if range_header and not (
            self.headers.get("If-Range")
            and self.headers["If-Range"] != self.date_time_string(
                os.path.getmtime(path)
            )
        ):
            match = re.fullmatch(r"bytes=(\d*)-(\d*)", range_header.strip())
            if not match or (not match.group(1) and not match.group(2)):
                file.close()
                self.send_range_not_satisfiable(size)
                return None

            first, last = match.groups()
            if first:
                start = int(first)
                end = min(int(last), size - 1) if last else size - 1
            else:
                suffix_length = int(last)
                if suffix_length == 0:
                    file.close()
                    self.send_range_not_satisfiable(size)
                    return None
                start = max(0, size - suffix_length)
                end = size - 1

            if start >= size or end < start:
                file.close()
                self.send_range_not_satisfiable(size)
                return None
            selected_range = (start, end)

        content_type = self.guess_type(path)
        self.send_response(206 if selected_range else 200)
        self.send_header("Content-Type", content_type)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))

        if selected_range:
            start, end = selected_range
            file.seek(start)
            self.range_to_send = end - start + 1
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Content-Length", str(self.range_to_send))
        else:
            self.range_to_send = None
            self.send_header("Content-Length", str(size))

        self.end_headers()
        return file

    def copyfile(self, source, output):
        remaining = self.range_to_send
        if remaining is None:
            return super().copyfile(source, output)

        while remaining:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            output.write(chunk)
            remaining -= len(chunk)

    def send_range_not_satisfiable(self, size):
        self.send_response(416)
        self.send_header("Content-Range", f"bytes */{size}")
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", "0")
        self.end_headers()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), RangeRequestHandler)
    print("Serving locally at http://127.0.0.1:8000")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()
