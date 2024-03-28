from flask_restful import Resource
from flask import request

NOTIFICATIONS = {
    1:{'tipo':'por vencer','mensaje':'está por vencer el préstamo'},
    2:{'tipo':'recordatorio','mensaje':'recuerde puntuar el libro'},
}

class Notifications(Resource):
    #insertar recurso
    def post(self):
        animal = request.get_json()
        id = int(max(NOTIFICATIONS.keys()))+1
        NOTIFICATIONS[id] = animal
        return NOTIFICATIONS[id], 201