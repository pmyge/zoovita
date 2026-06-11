from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Ad(Base):
    __tablename__ = "ads"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    price = Column(String)
    
    # Location
    location = Column(String)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Contact info
    contact_name = Column(String)
    contact_phone = Column(String)
    contact_email = Column(String, nullable=True)
    contact_telegram = Column(String, nullable=True)
    
    has_delivery = Column(Boolean, default=False)
    
    # Images (comma separated URLs)
    images = Column(Text, nullable=True)
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    category = relationship("Category", backref="ads")
    user = relationship("User", backref="ads")
