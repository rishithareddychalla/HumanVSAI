from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    score = Column(Integer, default=0)
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String) # 'image', 'text', 'code', 'voice', 'artwork'
    content_url = Column(String, nullable=True) # for media
    text_content = Column(String, nullable=True) # for text/code
    is_ai = Column(Integer) # 1 for AI, 0 for Human
    explanation = Column(String)
    difficulty = Column(String) # 'easy', 'medium', 'hard'
    category = Column(String)
