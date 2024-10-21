from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base

class Reminder(Base):
    __tablename__ = 'reminders' 

    reminder_id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey('tasks.task_id', ondelete='CASCADE'), nullable=False)
    reminder_datetime = Column(DateTime(timezone=True), nullable=False)
    sent = Column(Boolean, default=False)
    
    # user = relationship('Users', back_populates='schedules')

    def to_dict(self):
        return {
            'reminder_id': self.reminder_id,
            'task_id': self.task_id,
            'reminder_datetime': self.reminder_datetime,
            'sent': self.sent
        }
