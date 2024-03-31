from flask_restful import Resource
from flask import request

SIGNIN = {
    1: {'name': 'Alicia', 'email': 'alicia@example.com'},
    2: {'name': 'Roberto', 'email': 'roberto@example.com'}
}

class Signin(Resource):

    def post(self):
        new_signin = request.get_json()
        user_id = max(SIGNIN.keys()) + 1
        SIGNIN[user_id] = new_signin
        return SIGNIN[user_id], 201