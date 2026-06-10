from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    image_url = Column(String)
    section = Column(String, index=True) # animals, products, services
    created_at = Column(DateTime, default=datetime.utcnow)
