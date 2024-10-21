from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.userRoutes import userController_bp
from routes.taskRoutes import taskController_bp
from routes.sheduleRoutes import sheduleController_bp

server = Flask(__name__)
CORS(server)
load_dotenv()
PORT = int(os.getenv('PORT'))

server.register_blueprint(userController_bp)
server.register_blueprint(taskController_bp)
server.register_blueprint(sheduleController_bp)

@server.route('/', methods=['GET'])
def home():
    return jsonify({'message':'Servidor Python'})

if __name__ == '__main__':
    server.run(host='0.0.0.0', debug=True, port=PORT)