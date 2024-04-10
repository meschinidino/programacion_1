from flask import Flask
from dotenv import load_dotenv
# Importamos nuevas librerias
from flask_restful import Api
import os


# importamos SQLAlchemy
from flask_sqlalchemy import SQLAlchemy

# inicio restful
api = Api()

# inicio SQLAlchemy

db = SQLAlchemy()

def create_app():
    # inicio flask
    app = Flask(__name__)
    
    # importamos directorio de recursos
    import main.resources as resources

    # variables de entorno
    load_dotenv()
        
    #Si no existe el archivo de base de datos crearlo (solo válido si se utiliza SQLite)
    if not os.path.exists(os.getenv('DATABASE_PATH')+os.getenv('DATABASE_NAME')):
        os.mknod(os.getenv('DATABASE_PATH')+os.getenv('DATABASE_NAME'))

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    #Url de configuración de base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////'+os.getenv('DATABASE_PATH')+os.getenv('DATABASE_NAME')
    db.init_app(app)

    # espacio para modulos de la app

    # cargar a la API el recurso usuarios (users) y especificar la ruta
    api.add_resource(resources.UsersResource, '/users')
    # cargar a la API el recurso usuario (user) y especificar la ruta
    api.add_resource(resources.UserResource, '/user/<user_id>')
    api.add_resource(resources.BooksResource, '/books')
    api.add_resource(resources.BookResource, '/book/<id>')
    api.add_resource(resources.NotificationsResource, '/notifications')
    api.add_resource(resources.CommentsResource, '/comments')
    api.add_resource(resources.CommentResource, '/comment/<id>')
    api.add_resource(resources.ConfigurationsResource, '/configurations')
    api.add_resource(resources.ConfigurationResource, '/configuration/<id>')
    api.add_resource(resources.SigninResource, '/signin')
    api.add_resource(resources.LoginResource, '/login')
    api.add_resource(resources.LoansResource, '/loans')
    api.add_resource(resources.LoanResource, '/loan/<loan_id>')
    api.add_resource(resources.RatingsResource, '/ratings')
    api.add_resource(resources.RatingResource, '/rating/<rating_id>')

    api.init_app(app)

    return app
