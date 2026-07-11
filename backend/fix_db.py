from database import SessionLocal
import models

db = SessionLocal()
# The nightcafe image was question ID 2
q = db.query(models.Question).filter(models.Question.id == 2).first()
if q:
    q.content_url = "/ai_image.png"
    db.commit()
    print("Successfully updated database image URL")
db.close()
