from database import SessionLocal, Base, engine
import models
import json

db = SessionLocal()

# Drop and recreate to apply schema changes
models.Question.__table__.drop(engine, checkfirst=True)
models.Question.__table__.create(engine)

new_questions = [
    models.Question(
        type="text",
        text_content="Hey man, just wanted to check if we are still on for tomorrow? I can bring the snacks if you want. Let me know!",
        is_ai=0,
        explanation="This is human-written. It includes casual phrasing, slight imperfections, and a direct, conversational tone without unnecessary exposition.",
        difficulty="easy",
        category="General"
    ),
    models.Question(
        type="artwork",
        content_url="https://rishithareddychalla.github.io/HumanVSAI/ai_artwork.png",
        is_ai=1,
        explanation="Notice the neon signs contain unreadable, gibberish characters—a classic hallmark of AI generation. The architectural structures also blend into each other impossibly.",
        difficulty="medium",
        category="Art"
    ),
    models.Question(
        type="text",
        text_content="I apologize, but I cannot fulfill this request. As an AI language model, I am programmed to be helpful and harmless. If you have any other questions, feel free to ask!",
        is_ai=1,
        explanation="This is a dead giveaway. The model explicitly states 'As an AI language model', a hardcoded safety response typical of LLMs.",
        difficulty="easy",
        category="General"
    ),
    models.Question(
        type="image",
        content_url="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2845&auto=format&fit=crop",
        is_ai=0,
        explanation="This is a real photograph of an artwork in a museum. The lighting, shadows on the frame, and physical texture of the canvas reflect reality.",
        difficulty="medium",
        category="Art"
    ),
    models.Question(
        type="code",
        text_content="const user = await db.users.findUnique({ where: { id: userId } });\nif (!user) throw new Error('User not found');\n\n// TODO: Need to fix the caching layer here later, it's causing race conditions\nreturn res.json(user);",
        is_ai=0,
        explanation="This is likely human. It includes a specific, contextual comment ('TODO: Need to fix the caching layer...') which AI rarely generates unprompted in this conversational, imperfect manner.",
        difficulty="hard",
        category="Programming"
    ),
    models.Question(
        type="voice",
        content_url="https://rishithareddychalla.github.io/HumanVSAI/ai_voice.mp3",
        text_content="[Audio Transcript]: 'Hello, my name is John. I am calling to inform you about your car's extended warranty. Please press 1 to speak with a representative.'\n(Audio sounds slightly robotic, with unnatural pacing between words and perfect monotone pitch).",
        is_ai=1,
        explanation="The audio (perfect monotone, unnatural pacing) indicates a text-to-speech AI generation. Real humans have pitch variation, breaths, and natural pauses.",
        difficulty="medium",
        category="Audio"
    ),
    models.Question(
        type="voice",
        content_url="https://rishithareddychalla.github.io/HumanVSAI/human_voice.ogg",
        text_content="[Audio Transcript]: 'Uhh, yeah, so I was thinking maybe we could... I don't know, grab coffee later? If you're free, that is.'\n(Audio contains natural 'umms', slight stuttering, and background room noise).",
        is_ai=0,
        explanation="This is human. The presence of filler words ('Uhh'), pauses, and background noise are characteristics of authentic human speech.",
        difficulty="medium",
        category="Audio"
    ),
    models.Question(
        type="social",
        text_content="@CryptoKing99: WOW! Just received 500 ETH from the new airdrop event! 🚀 Click here to claim yours before it ends: http://phishing-link.com #Ethereum #Crypto #Airdrop",
        is_ai=1,
        explanation="This is a classic bot/AI-generated scam tweet. The excessive use of emojis, urgency, and suspicious links are key indicators of automated bot behavior.",
        difficulty="easy",
        category="Social Media"
    ),
    models.Question(
        type="social",
        text_content="@SarahCodes: finally fixed that bug that's been haunting me for 3 days 😭 turns out I just forgot to await a promise. I need sleep.",
        is_ai=0,
        explanation="This is human. The self-deprecating humor, relatable situation, and lack of perfect grammar make it highly authentic.",
        difficulty="medium",
        category="Social Media"
    ),
    models.Question(
        type="video",
        content_url="https://www.w3schools.com/html/mov_bbb.mp4",
        is_ai=0,
        explanation="This is real (human-made animation). AI video generation currently struggles with maintaining consistent physics, geometry, and character consistency over long periods.",
        difficulty="medium",
        category="Video"
    ),
    models.Question(
        type="multiple_choice",
        text_content="Which of the following is the most common artifact found in early AI-generated images?",
        options=json.dumps(["Perfectly symmetrical faces", "Mangled hands and fingers", "Hyper-realistic shadows", "Accurate text rendering"]),
        correct_option=1,
        explanation="Historically, AI models have notoriously struggled with generating human hands, often producing too many fingers or impossible joints.",
        difficulty="easy",
        category="General"
    ),
    models.Question(
        type="multiple_choice",
        text_content="In AI-generated text, 'perplexity' refers to:",
        options=json.dumps(["How confused the user is by the text", "A measure of how predictable the text is to the model", "The grammatical complexity of sentences", "The emotional tone of the content"]),
        correct_option=1,
        explanation="In NLP, perplexity measures how well a probability model predicts a sample. Lower perplexity means the text is highly predictable (common in AI).",
        difficulty="hard",
        category="Text"
    )
]

# We already dropped the table above, so no need to delete rows.

# Re-add the 4 old ones + the new ones
samples = [
    models.Question(
        type="image",
        content_url="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=2787&auto=format&fit=crop",
        is_ai=0,
        explanation="This is a real photograph. Notice the consistent lighting, natural skin texture, and physically accurate background elements.",
        difficulty="easy",
        category="General"
    ),
    models.Question(
        type="image",
        content_url="https://rishithareddychalla.github.io/HumanVSAI/ai_image.png",
        is_ai=1,
        explanation="This is AI generated. Look closely at the unnatural blending of objects in the background, and hyper-smooth textures.",
        difficulty="medium",
        category="General"
    ),
    models.Question(
        type="text",
        text_content="The rapid advancement of artificial intelligence has led to numerous breakthroughs in various fields. From natural language processing to computer vision, AI systems are becoming increasingly capable. However, it is crucial to consider the ethical implications of these technologies.",
        is_ai=1,
        explanation="This text exhibits common AI patterns: repetitive structure, broad generalizations without specific examples, and predictable transitions.",
        difficulty="easy",
        category="General"
    ),
    models.Question(
        type="code",
        text_content="def calculate_fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    sequence = [0, 1]\n    while len(sequence) < n:\n        next_val = sequence[-1] + sequence[-2]\n        sequence.append(next_val)\n    return sequence\n\n# Calculate first 10 Fibonacci numbers\nprint(calculate_fibonacci(10))",
        is_ai=1,
        explanation="While perfectly functional, this code represents a textbook algorithm implementation commonly generated by AI, lacking any specific business logic or contextual variable names.",
        difficulty="hard",
        category="Programming"
    )
]

db.add_all(samples)
db.add_all(new_questions)
db.commit()
print(f"Added {len(samples) + len(new_questions)} total questions to DB!")
db.close()
