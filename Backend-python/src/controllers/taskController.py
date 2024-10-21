import os
from flask import request, jsonify


def createTask():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        user_id = data.get('user_id')
        due_date = data.get('due_date')
        priority = data.get('priority')
        status = data.get('status')

        if not title or not description or not user_id or not due_date or not priority or not status:
            return jsonify({
                'message': "Todos los campos son obligatorios: title, description, user_id, due_date, priority, status.",
                'status': False,
            }), 400
        

        body = {
            'title': title,
            'description': description,
            'user_id': user_id,
            'due_date': due_date,
            'priority': priority,
            'status': status,
        }

        response = request.post(
            f"{os.getenv('APIGATEWAY')}/Test/create-task",
            json={'body': body}
        )

        if not response.ok:
            data = response.json()
            raise Exception(data.get('message', 'Error creating task'))

        
        response_data = response.json()
        task_response = response_data.get('body')

        return jsonify({
            'message': task_response['message'],
            'taskId': task_response['taskId'],
            'status': task_response['status'],
        }), response_data['status']
    
    except Exception as error:
        print('Error creating task:', error)

        return jsonify({
            'message': 'Error interno al crear la tarea',
            'error': str(error),
            'status': False,
        }), 500


def updateTask(task_id):
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        due_date = data.get('due_date')
        priority = data.get('priority')
        status = data.get('status')

        if not task_id:
            return jsonify({
                'message': "El campo task_id es obligatorio.",
                'status': False,
            }), 400

        body = {
            'title': title,
            'description': description,
            'task_id': task_id,
            'due_date': due_date,
            'priority': priority,
            'status': status,
        }

        response = request.put(
            f"{os.getenv('APIGATEWAY')}/Test/updateTask",
            json={'body': body}
        )

        if not response.ok:
            data = response.json()
            raise Exception(data.get('message', 'Error updating task'))

        response_data = response.json()
        task_response = response_data.get('body')

        return jsonify({
            'message': task_response['message'],
            'taskId': task_response['taskId'],
            'status': task_response['status'],
        }), response_data['status']

    except Exception as error:
        print('Error updating task:', error)

        return jsonify({
            'message': 'Error interno al actualizar la tarea',
            'error': str(error),
            'status': False,
        }), 500
    
def deleteTask(task_id):
    try:
        if not task_id:
            return jsonify({
                'message': "El campo task_id es obligatorio.",
                'status': False,
            }), 400

        response = request.delete(
            f"{os.getenv('APIGATEWAY')}/Test/deleteTask",
            json={'body': {'task_id': task_id}}  
        )

        if not response.ok:
            data = response.json()
            raise Exception(data.get('message', 'Error deleting task'))

        response_data = response.json()
        task_response = response_data.get('body')

        return jsonify({
            'message': task_response['message'],
            'taskId': task_response['taskId'],
            'status': task_response['status'],
        }), response_data['status']

    except Exception as error:
        print('Error deleting task:', error)

        return jsonify({
            'message': 'Error interno al eliminar la tarea',
            'error': str(error),
            'status': False,
        }), 500


def getTask(task_id):
    try:
        if not task_id:
            return jsonify({
                'message': "El campo task_id es obligatorio.",
                'status': False,
            }), 400

        response = request.post(
            f"{os.getenv('APIGATEWAY')}/Test/getTaskById",
            json={'body': {'task_id': task_id}}  
        )

        if not response.ok:
            data = response.json()
            raise Exception(data.get('message', 'Error get task'))

        response_data = response.json()
        task_response = response_data.get('body')

        return jsonify({
            'task': task_response.get('task'),
            'status': task_response.get('status'),
        }), response_data['status']

    except Exception as error:
        print('Error get task:', error)

        return jsonify({
            'message': 'Error interno al obtener la tarea',
            'error': str(error),
            'status': False,
        }), 500

def getAllTask():
    try:
        response = request.get(
            f"{os.getenv('APIGATEWAY')}/Test/getAllTask",
            headers={'Content-Type': 'application/json'}
        )

        if not response.ok:
            data = response.json()
            raise Exception(data.get('message', 'Error get task'))

        response_data = response.json()
        tasks_response = response_data.get('body')

        return jsonify({
            'tasks': tasks_response.get('tasks'),
            'status': tasks_response.get('status'),
        }), response.status_code

    except Exception as error:
        print('Error get task:', error)

        return jsonify({
            'message': 'Error interno al obtener las tareas',
            'error': str(error),
            'status': False,
        }), 500