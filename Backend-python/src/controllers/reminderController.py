import os
from models.reminder import Reminder
from flask import request, jsonify
from config.db import get_db


def createReminder():
    db = next(get_db())
    try:
        data = request.get_json()
        task_id = data.get('task_id')
        reminder_datetime = data.get('reminder_datetime')

        if not task_id or not reminder_datetime:
            return jsonify({
                "message": "Los campos task_id y reminder_datetime son obligatorios.",
                "status": False,
            }), 400

        new_reminder = Reminder(
            task_id=task_id,
            reminder_datetime=reminder_datetime,
            sent=False  
        )

        db.add(new_reminder)
        db.commit()

        return jsonify({
            "message": "Recordatorio creado exitosamente.",
            "reminder": new_reminder.to_dict(),  # Asegúrate de que el modelo tenga este método
            "status": True,
        }), 201

    except Exception as error:
        print(f"Error al crear recordatorio: {error}")
        return jsonify({
            "message": "Error al crear recordatorio.",
            "error": str(error),
            "status": False,
        }), 500