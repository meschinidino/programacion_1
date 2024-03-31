from flask_restful import Resource
from flask import request

CONFIG = {
    #??????
}

class Configuration(Resource):

    def get(self):
        return CONFIG

    def put(self, id):
        if int(id) in CONFIG:
            conf = CONFIG[int(id)]
            data = request.get_json()
            conf.update(data)
            return '', 201
        return 'Configuración no encontrada', 404