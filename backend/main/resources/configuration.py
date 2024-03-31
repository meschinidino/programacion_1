from flask_restful import Resource
from flask import request

CONFIG = {
    1: {'type': 'books reconditioning', 'text': 'every 5 years'},
    2: {'type': 'book loan especification', 'text': 'two books at the time'}
}

class Configurations(Resource):

    def get(self):
        return CONFIG

class Configuration(Resource):
    def put(self, id):
        if int(id) in CONFIG:
            conf = CONFIG[int(id)]
            data = request.get_json()
            conf.update(data)
            return '', 201
        return 'Configuración no encontrada', 404