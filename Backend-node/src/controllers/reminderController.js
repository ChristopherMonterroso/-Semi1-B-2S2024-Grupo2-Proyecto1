const Reminder = require('../models/reminder');
const Task = require("../models/task");

const createReminder = async (req, res) => {
    try {
        const { task_id, reminder_datetime } = req.body;

        // Validación de campos
        if (!task_id || !reminder_datetime) {
            return res.status(400).json({
                message: "Los campos task_id y reminder_datetime son obligatorios.",
                status: false,
            });
        }

        // Crear el recordatorio en la base de datos
        const newReminder = await Reminder.create({
            task_id,
            reminder_datetime,
            sent: false // Por defecto, el recordatorio no ha sido enviado
        });

        return res.status(201).json({
            message: "Recordatorio creado exitosamente.",
            reminder: newReminder,
            status: true,
        });

    } catch (error) {
        console.error("Error al crear recordatorio:", error);
        return res.status(500).json({
            message: "Error al crear recordatorio.",
            error: error.message,
            status: false,
        });
    }
};

const getAllReminders = async (req, res) => {
    try {
        const reminders = await Reminder.findAll();
        return res.status(200).json({
            reminders,
            status: true,
        });
    } catch (error) {
        console.error("Error al obtener recordatorios:", error);
        return res.status(500).json({
            message: "Error al obtener recordatorios.",
            error: error.message,
            status: false,
        });
    }
};

const getReminderById = async (req, res) => {
    try {
        const { reminder_id } = req.params;

        const reminder = await Reminder.findByPk(reminder_id);

        if (!reminder) {
            return res.status(404).json({
                message: "Recordatorio no encontrado.",
                status: false,
            });
        }

        return res.status(200).json({
            reminder,
            status: true,
        });

    } catch (error) {
        console.error("Error al obtener recordatorio:", error);
        return res.status(500).json({
            message: "Error al obtener recordatorio.",
            error: error.message,
            status: false,
        });
    }
};

const updateReminder = async (req, res) => {
    try {
        const { reminder_id } = req.params;
        const { reminder_datetime, sent } = req.body;

        const reminder = await Reminder.findByPk(reminder_id);

        if (!reminder) {
            return res.status(404).json({
                message: "Recordatorio no encontrado.",
                status: false,
            });
        }

        // Actualizar solo los campos que vienen en el request
        if (reminder_datetime !== undefined) reminder.reminder_datetime = reminder_datetime;
        if (sent !== undefined) reminder.sent = sent;

        await reminder.save();

        return res.status(200).json({
            message: "Recordatorio actualizado exitosamente.",
            reminder,
            status: true,
        });

    } catch (error) {
        console.error("Error al actualizar recordatorio:", error);
        return res.status(500).json({
            message: "Error al actualizar recordatorio.",
            error: error.message,
            status: false,
        });
    }
};

const deleteReminder = async (req, res) => {
    try {
        const { reminder_id } = req.params;

        const reminder = await Reminder.findByPk(reminder_id);

        if (!reminder) {
            return res.status(404).json({
                message: "Recordatorio no encontrado.",
                status: false,
            });
        }

        await reminder.destroy();

        return res.status(200).json({
            message: "Recordatorio eliminado exitosamente.",
            status: true,
        });

    } catch (error) {
        console.error("Error al eliminar recordatorio:", error);
        return res.status(500).json({
            message: "Error al eliminar recordatorio.",
            error: error.message,
            status: false,
        });
    }
};

const getRemindersByUserId = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      // Consultar los reminders basados en el user_id relacionado con tasks
      const reminders = await Reminder.findAll({
        include: [{
          model: Task,
          where: { user_id }
        }]
      });
  
      if (reminders.length === 0) {
        return res.status(404).json({ message: "No se encontraron recordatorios para este usuario", status: false });
      }
  
      return res.status(200).json({ reminders, status: true });
    } catch (error) {
      console.error("Error al obtener recordatorios por user_id:", error);
      return res.status(500).json({ message: "Error al obtener recordatorios", error: error.message, status: false });
    }
  };

module.exports = {
    createReminder,
    updateReminder,
    deleteReminder,
    getReminderById,
    getAllReminders,
    getRemindersByUserId
};