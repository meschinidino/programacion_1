from flask import request, jsonify, Blueprint
from .. import db
from main.models import UsersModel
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from main.mail.functions import sendMail

#Blueprint para acceder a los métodos de autenticación
auth = Blueprint('auth', __name__, url_prefix='/auth')

#Método de logueo
@auth.route('/login', methods=['POST'])
def login():
    #Busca al user en la db por mail
    user = db.session.query(UsersModel).filter(UsersModel.email == request.get_json().get("email")).first_or_404()
    #Valida la contraseña
    if user.validate_pass(request.get_json().get("password")):
        #Genera un nuevo token
        #Pasa el objeto Users como identidad
        access_token = create_access_token(identity=user)
        #Devolver valores y token
        data = {
            'id': str(user.user_id),
            'email': user.email,
            'access_token': access_token
        }

        return data, 200
    else:
        return 'Incorrect password', 401

#Método de registro
@auth.route('/register', methods=['POST'])
def register():
    #Obtener user
    user = UsersModel.from_json(request.get_json())
    #Verificar si el mail ya existe en la db, scalar() para saber la cantidad de ese email
    exists = db.session.query(UsersModel).filter(UsersModel.email == user.email).scalar() is not None
    if exists:
        return 'Duplicated mail', 409
    else:
        try:
            #Agregar user a la basex
            db.session.add(user)
            db.session.commit()
            send = sendMail([user.email], "Welcome", "register", user = user)
        except Exception as error:
            db.session.rollback()
            return str(error), 409
        return user.to_json_short() , 201