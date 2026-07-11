import urllib.request
import os

print("Downloading human voice...")
# A random sample voice wav (male voice saying "one")
urllib.request.urlretrieve("https://raw.githubusercontent.com/Jakobovski/free-spoken-digit-dataset/master/recordings/0_jackson_0.wav", "../frontend/public/human_voice.wav")

print("Downloading AI voice...")
# A sample mp3 file
urllib.request.urlretrieve("https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3", "../frontend/public/ai_voice.mp3")

print("Files downloaded.")
