import urllib.request
import urllib.parse

print("Downloading human voice (Wikipedia Commons)...")
# Short English spoken sentence by a human
human_url = "https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg"
req = urllib.request.Request(human_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as response:
        with open("../frontend/public/human_voice.ogg", "wb") as f:
            f.write(response.read())
except Exception as e:
    print("Failed human:", e)

print("Voices updated.")
