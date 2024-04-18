from flask_restful import Resource
from flask import request, jsonify
from main.models import UsersModel
from .. import db


class Users(Resource):
    # obtener lista de usuarios
    def get(self):
        users = db.session.query(UsersModel).all()
        return jsonify([user.to_json()for user in users])
    # instertar recurso
    def post(self):
        new_user = UsersModel.from_json(request.get_json())
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_json(), 201


class User(Resource):
    #obtener recurso
    def get(self, user_id):
        user = db.session.query(UsersModel).get_or_404(user_id)
        return user.to_json()


    # Modificar el recurso usuario
    def put(self, user_id):
        user_id = int(user_id)
        user = db.session.query(UsersModel).get_or_404(user_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(user, key, value)
        db.session.add(user)
        db.session.commit()
        return user.to_json(), 201

    # Eliminar recurso
    def delete(self, user_id):
        user_id = int(user_id)
        user = db.session.query(UsersModel).get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return 'Deleted', 204
