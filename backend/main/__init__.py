from flask import Flask
from dotenv import load_dotenv
# Importamos nuevas librerias
from flask_restful import Api

# importamos directorio de recursos
import main.resources as resources

# inicio restful
api = Api()

def create_app():
    # inicio flask
    app = Flask(__name__)

    # variables de entorno
    load_dotenv()
    
    # espacio para modulos de la app

    # cargar a la API el recurso usuarios (users) y especificar la ruta
    api.add_resource(resources.UsersResource, '/users')
    # cargar a la API el recurso usuario (user) y especificar la ruta
    api.add_resource(resources.UserResource, '/user/<user_id>')
    api.add_resource(resources.BooksResource, '/books')
    api.add_resource(resources.BookResource, '/book/<id>')
    api.add_resource(resources.NotificationsResource, '/notifications')
    api.add_resource(resources.LoansResource, '/loans')
    api.add_resource(resources.LoanResource, '/loan/<id>')
    api.add_resource(resources.RatingsResource, '/ratings')
    api.add_resource(resources.RatingResource, '/rating/<id>')

    api.init_app(app)

    return app

