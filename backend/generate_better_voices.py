import urllib.request
import urllib.parse

print("Downloading human voice (Harvard Sentences)...")
# Harvard sentence spoken by a human male
human_url = "https://www.voiptroubleshooter.com/open_speech/american/OSR_us_000_0010_8k.wav"
try:
    urllib.request.urlretrieve(human_url, "../frontend/public/human_voice.wav")
except Exception as e:
    print("Failed human:", e)

print("Generating AI voice (Google Translate TTS)...")
text = "Hello, my name is John. I am calling to inform you about your car's extended warranty. Please press 1 to speak with a representative."
encoded = urllib.parse.quote(text)
url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q={encoded}&tl=en"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as response:
        with open("../frontend/public/ai_voice.mp3", "wb") as f:
            f.write(response.read())
except Exception as e:
    print("Failed AI:", e)

print("Voices updated.")
