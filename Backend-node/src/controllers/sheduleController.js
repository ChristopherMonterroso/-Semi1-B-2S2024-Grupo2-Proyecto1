const Schedule = require('../models/schedule');

const createSchedule = async (req, res) => {
    try {
        const { user_id, course_name, event_datetime, professor, location } = req.body;

        // Validaciones de campos obligatorios
        if (!user_id || !course_name || !event_datetime) {
            return res.status(400).json({
                message: "user_id, course_name y event_datetime son campos obligatorios.",
                status: false,
            });
        }

        const newSchedule = await Schedule.create({
            user_id,
            course_name,
            event_datetime,
            professor,
            location,
        });

        return res.status(201).json({
            message: "Horario creado exitosamente",
            schedule: newSchedule,
            status: true,
        });
    } catch (error) {
        console.error("Error al crear el horario:", error);
        return res.status(500).json({
            message: "Error en la creación del horario",
            error: error.message,
            status: false,
        });
    }
};

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll();
        return res.status(200).json({
            schedules,
            status: true,
        });
    } catch (error) {
        console.error("Error al obtener los horarios:", error);
        return res.status(500).json({
            message: "Error al obtener los horarios",
            error: error.message,
            status: false,
        });
    }
};

const getScheduleById = async (req, res) => {
    try {
        const { schedule_id } = req.params;
        const schedule = await Schedule.findByPk(schedule_id);

        if (!schedule) {
            return res.status(404).json({
                message: "Horario no encontrado",
                status: false,
            });
        }

        return res.status(200).json({
            schedule,
            status: true,
        });
    } catch (error) {
        console.error("Error al obtener el horario:", error);
        return res.status(500).json({
            message: "Error al obtener el horario",
            error: error.message,
            status: false,
        });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const { schedule_id } = req.params;
        const { user_id, course_name, event_datetime, professor, location } = req.body;

        // Buscar el horario a actualizar
        const schedule = await Schedule.findByPk(schedule_id);

        if (!schedule) {
            return res.status(404).json({
                message: "Horario no encontrado",
                status: false,
            });
        }

        // Actualizar solo los campos que vienen en la petición
        schedule.user_id = user_id || schedule.user_id;
        schedule.course_name = course_name || schedule.course_name;
        schedule.event_datetime = event_datetime || schedule.event_datetime;
        schedule.professor = professor || schedule.professor;
        schedule.location = location || schedule.location;

        await schedule.save();

        return res.status(200).json({
            message: "Horario actualizado exitosamente",
            schedule,
            status: true,
        });
    } catch (error) {
        console.error("Error al actualizar el horario:", error);
        return res.status(500).json({
            message: "Error al actualizar el horario",
            error: error.message,
            status: false,
        });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        const { schedule_id } = req.params;

        // Buscar el horario
        const schedule = await Schedule.findByPk(schedule_id);

        if (!schedule) {
            return res.status(404).json({
                message: "Horario no encontrado",
                status: false,
            });
        }

        await schedule.destroy();

        return res.status(200).json({
            message: "Horario eliminado exitosamente",
            status: true,
        });
    } catch (error) {
        console.error("Error al eliminar el horario:", error);
        return res.status(500).json({
            message: "Error al eliminar el horario",
            error: error.message,
            status: false,
        });
    }
};

const getSchedulesByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Consultar los schedules basados en el user_id
        const schedules = await Schedule.findAll({
            where: { user_id },
        });

        if (schedules.length === 0) {
            return res.status(404).json({ message: "No se encontraron horarios para este usuario", status: false });
        }

        return res.status(200).json({ schedules, status: true });
    } catch (error) {
        console.error("Error al obtener horarios por user_id:", error);
        return res.status(500).json({ message: "Error al obtener horarios", error: error.message, status: false });
    }
};

module.exports = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    getSchedulesByUserId,
    updateSchedule,
    deleteSchedule,
};