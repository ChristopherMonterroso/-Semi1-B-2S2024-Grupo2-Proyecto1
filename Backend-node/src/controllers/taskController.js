const createTask = async (req, res) => {
    try {
        const { title, description, user_id, due_date, priority, status } = req.body;

        if (!title || !description || !user_id || !due_date || !priority || !status) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios: title, description, user_id, due_date, priority, status.",
                status: false,
            });
        }

        const response = await fetch(`${process.env.APIGATEWAY}/Test/create-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body: JSON.stringify({
                    title,
                    description,
                    user_id,
                    due_date,
                    priority,
                    status,
                })
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error creating task');
            
        }

        // Deserializamos el cuerpo que viene en 'data.body'
        const responseData = JSON.parse(data.body);

        // Devolvemos una respuesta exitosa con `status: true`
        return res.status(response.status).json({
            message: responseData.message,
            taskId: responseData.taskId,
            status: responseData.status,
        });
    } catch (error) {
        console.error('Error creating task:', error);

        // En caso de error, devolvemos `status: false`
        return res.status(500).json({
            message: 'Error interno al crear la tarea',
            error: error.message,
            status: false,
        });
    }
};

const updateTask = async (req, res) => {
    const { task_id } = req.params;
    try {
        const { title, description, due_date, priority, status } = req.body;
        if (!task_id ) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios: task_id.",
                status: false,
            });
        }

        const response = await fetch(`${process.env.APIGATEWAY}/Test/updateTask`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body: JSON.stringify({
                    title,
                    description,
                    task_id,
                    due_date,
                    priority,
                    status,
                })
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error updating task');
        }

        // Deserializamos el cuerpo que viene en 'data.body'
        const responseData = JSON.parse(data.body);

        // Devolvemos una respuesta exitosa con `status: true`
        return res.status(response.status).json({
            message: responseData.message,
            taskId: responseData.taskId,
            status: responseData.status,
        });
    } catch (error) {
        console.error('Error updating task:', error);

        // En caso de error, devolvemos `status: false`
        return res.status(500).json({
            message: 'Error interno al actualizar la tarea',
            error: error.message,
            status: false,
        });
    }
};

const deleteTask = async (req, res) => {
    const { task_id } = req.params;
    try {
        if (!task_id ) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios: task_id.",
                status: false,
            });
        }

        const response = await fetch(`${process.env.APIGATEWAY}/Test/deleteTask`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body: JSON.stringify({
                    task_id
                })
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error delete task');
        }

        // Deserializamos el cuerpo que viene en 'data.body'
        const responseData = JSON.parse(data.body);

        // Devolvemos una respuesta exitosa con `status: true`
        return res.status(response.status).json({
            message: responseData.message,
            taskId: responseData.taskId,
            status: responseData.status,
        });
    } catch (error) {
        console.error('Error delete task:', error);

        // En caso de error, devolvemos `status: false`
        return res.status(500).json({
            message: 'Error interno al eliminar la tarea',
            error: error.message,
            status: false,
        });
    }
};

const getTask = async (req, res) => {
    const { task_id } = req.params;
    try {
        if (!task_id ) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios: task_id.",
                status: false,
            });
        }

        const response = await fetch(`${process.env.APIGATEWAY}/Test/getTaskById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body: JSON.stringify({
                    task_id
                })
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error get task');
        }

        // Deserializamos el cuerpo que viene en 'data.body'
        const responseData = JSON.parse(data.body);

        // Devolvemos una respuesta exitosa con `status: true`
        return res.status(response.status).json({
            task: responseData.task,
            status: responseData.status,
        });
    } catch (error) {
        console.error('Error get task:', error);

        // En caso de error, devolvemos `status: false`
        return res.status(500).json({
            message: 'Error interno al obtener la tarea',
            error: error.message,
            status: false,
        });
    }
};

const getAllTask = async (req, res) => {
    try {

        const response = await fetch(`${process.env.APIGATEWAY}/Test/getAllTask`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error get task');
        }

        // Deserializamos el cuerpo que viene en 'data.body'
        const responseData = JSON.parse(data.body);

        // Devolvemos una respuesta exitosa con `status: true`
        return res.status(response.status).json({
            tasks: responseData.tasks,
            status: responseData.status,
        });
    } catch (error) {
        console.error('Error get task:', error);

        // En caso de error, devolvemos `status: false`
        return res.status(500).json({
            message: 'Error interno al obtener la tarea',
            error: error.message,
            status: false,
        });
    }
};

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTask,
    getAllTask
};
