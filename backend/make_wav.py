import wave, struct, math

def generate_wav(filename, frequency=440.0, duration=1.0, is_robotic=False):
    sample_rate = 44100.0
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # mono
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        for i in range(int(duration * sample_rate)):
            f = frequency if is_robotic else frequency + (math.sin(i / sample_rate * 5) * 10)
            value = int(math.sin(i / sample_rate * f * math.pi * 2) * 10000) # lower volume
            wav_file.writeframes(struct.pack('<h', value))

generate_wav('C:/Vscode/COSC/HumanVSAI/frontend/public/ai_voice.wav', 300.0, 3.0, True)
generate_wav('C:/Vscode/COSC/HumanVSAI/frontend/public/human_voice.wav', 200.0, 3.0, False)
print("Wav files generated.")
