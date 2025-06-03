from .. import jwt, db
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps
from main.models import UsersModel

#Decorador para restringir el acceso a usuarios/animales por rol
def role_required(roles):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            #Verificar que el JWT es correcto
            verify_jwt_in_request()
            #Obtener claims de adentro del JWT
            claims = get_jwt()
            #Verificar que el rol sea uno de los permitidos por la ruta
            if claims['role'] in roles :
                #Ejecutar función
                return fn(*args, **kwargs)
            else:
                return 'Sin permisos de acceso al recurso', 403
        return wrapper
    return decorator

#Define el atributo que se utilizará para identificar el usuario
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user['id']

#Define que atributos se guardarán dentro del token
@jwt.additional_claims_loader
def add_claims_to_access_token(identity):
    return {
        'role': identity['role'],
        'id': identity['id'],
        'email': identity['email']
    }

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    return db.session.query(UsersModel).filter(
        UsersModel.user_id == jwt_data["id"]
    ).one_or_none()