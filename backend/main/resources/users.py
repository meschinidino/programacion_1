from flask_restful import Resource
from flask import request, jsonify
from main.models import UsersModel
from sqlalchemy import or_
from .. import db


class Users(Resource):
    # obtener lista de usuarios
    def get(self):
        page = 1

        per_page = 10

        users = db.session.query(UsersModel)

        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        #acá van los filtros

        if request.args.get('role'):
            users = users.filter(UsersModel.role.like("%" + request.args.get('role') + "%"))
        if request.args.get('email'):
            users = users.filter(UsersModel.email.like("%" + request.args.get('email') + "%"))
        if request.args.get('name'):
            user_name = request.args.get('name')
            users = users.filter((UsersModel.name.like(f"%{user_name}%")) | (UsersModel.last_name.like(f"%{user_name}%")))


        users = users.paginate(page=page, per_page=per_page, error_out=True)
        
        return jsonify({
            'users': [user.to_json_short() for user in users.items],
            'total': users.total,
            'pages': users.pages,
            'page': page
        })

    # instertar recurso
    def post(self):
        new_user = UsersModel.from_json(request.get_json())
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_json_short(), 201


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
        return user.to_json_short(), 201

    # Eliminar recurso
    def delete(self, user_id):
        user_id = int(user_id)
        user = db.session.query(UsersModel).get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return 'Deleted', 204
