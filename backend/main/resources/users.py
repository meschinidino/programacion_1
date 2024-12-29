from flask_restful import Resource
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.models import UsersModel
from main.auth.decorators import role_required
from sqlalchemy import or_
from .. import db


class Users(Resource):
    # obtener lista de usuarios solo lo puede hacer el admin
    @role_required(roles=["Admin", "Librarian"])
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

class UsersAll(Resource):
    @role_required(roles=["Admin", "Librarian"])
    def get(self):
        users = db.session.query(UsersModel).all()
        return jsonify({
            'users': [user.to_json_short() for user in users]
        })



class User(Resource):

    #obtener usuario
    @role_required(roles = ["User", "Admin", "Librarian"])
    def get(self, user_id):
        user = db.session.query(UsersModel).get_or_404(user_id)

        current_identity = get_jwt_identity()
        if current_identity:
            return user.to_json()
        else:
            return user.to_json_short()

    # Modificar el recurso usuario
    @role_required(roles=["User", "Admin", "Librarian"])
    def put(self, user_id):
        user_id = int(user_id)
        user = db.session.query(UsersModel).get_or_404(user_id)
        data = request.get_json()

        current_user_id = get_jwt_identity()
        current_user = db.session.query(UsersModel).get_or_404(current_user_id)

        # Verificar si el usuario tiene permiso para cambiar el rol
        if "role" in data and current_user.role.lower() == "user":
            return {"message": "Only admins and librarians can change user roles"}, 403

        # Actualizar los atributos del usuario
        try:
            for key, value in data.items():
                setattr(user, key, value)
            db.session.commit()  # Guardar los cambios en la base de datos
            return user.to_json_short(), 200  # Cambiar el código de estado a 200
        except Exception as e:
            db.session.rollback()  # Revertir cambios en caso de error
            return {"message": str(e)}, 500  # Retornar el error

    # Eliminar usuario
    @role_required(roles = ["Librarian", "Admin"])
    def delete(self, user_id):
        user_id = int(user_id)
        user = db.session.query(UsersModel).get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return 'Deleted', 204
