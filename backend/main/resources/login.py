from flask_restful import Resource
from flask import request

LOGIN = {
    #????
}

class Login(Resource):

    def post(self):
        new_login = request.get_json()
        id = int(max(LOGIN.keys()))+1
        LOGIN[id] = new_login
        return LOGIN[id], 201