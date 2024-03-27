from flask_restful import Resource
from flask import request

# ejemplo de datos que van  ser cambiados por una DB eventualmente
USERS = {
    1: {'name': 'Alicia', 'email': 'alicia@example.com'},
    2: {'name': 'Roberto', 'email': 'roberto@example.com'}
}


class Users(Resource):
    # obtener lista de usuarios
    def get(self):
        return USERS

    # instertar recurso
    def post(self):
        new_user = request.get_json()
        user_id = max(USERS.keys()) + 1
        USERS[user_id] = new_user
        return USERS[user_id], 201


class User(Resource):
    #obtener recurso
    def get(self, user_id):
        user_id = int(user_id)
        if user_id in USERS:
            return USERS[user_id]
        else:
            return {'error': 'Usuario no encontrado'}, 404

    # Modificar el recurso usuario
    def put(self, user_id):
        user_id = int(user_id)
        if user_id in USERS:
            user_data = request.get_json()
            USERS[user_id].update(user_data)
            return USERS[user_id], 200
        else:
            return {'error': 'Usuario no encontrado'}, 404

    # Eliminar recurso
    def delete(self, user_id):
        user_id = int(user_id)
        if user_id in USERS:
            del USERS[user_id]
            return '', 204
        else:
            return {'error': 'Usuario no encontrado'}, 404
