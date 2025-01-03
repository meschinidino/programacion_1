from flask import Flask
from dotenv import load_dotenv
# Importamos nuevas librerias
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS
import os

# importamos directorio de recursos

from flask_sqlalchemy import SQLAlchemy

# inicio restful

api = Api()

db = SQLAlchemy()

jwt = JWTManager()

mailsender = Mail()

def create_app():
    # inicio flask
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}})

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
    import main.resources as resource
    # cargar a la API el recurso usuarios (users) y especificar la ruta
    api.add_resource(resources.UsersResource, '/users')
    api.add_resource(resources.UsersAllResource, '/users/all', endpoint='users_all')
    # cargar a la API el recurso usuario (user) y especificar la ruta
    api.add_resource(resources.UserResource, '/user/<user_id>')
    api.add_resource(resources.BooksResource, '/books')
    api.add_resource(resources.BookResource, '/book/<book_id>')
    api.add_resource(resources.NotificationsResource, '/notifications')
    api.add_resource(resources.ConfigurationsResource, '/configurations')
    api.add_resource(resources.ConfigurationResource, '/configuration/<id>')
    api.add_resource(resources.SigninResource, '/signin')
    api.add_resource(resources.LoginResource, '/login')
    api.add_resource(resources.LoansResource, '/loans')
    api.add_resource(resources.LoansByUserResource, '/loans/user/<user_id>')
    api.add_resource(resources.LoanResource, '/loan/<loan_id>')
    api.add_resource(resources.RatingsResource, '/ratings')
    api.add_resource(resources.RatingResource, '/rating/<rating_id>')
    api.add_resource(resources.AuthorsResource, '/authors')
    api.add_resource(resources.AuthorResource, '/author/<author_id>')
    api.add_resource(resources.UserBorrowedBooksResource, '/users/<int:user_id>/borrowed-books')
    api.add_resource(resources.CanUserRateResource, '/ratings/can-rate/<int:user_id>/<int:book_id>')
    api.add_resource(resources.LoanExtendResource, '/loans/<int:loan_id>/extend')
    api.add_resource(resources.UserSuspendResource, '/user/<int:user_id>/suspend')
    api.add_resource(resources.UserUnsuspendResource , '/user/<int:user_id>/unsuspend')
    api.init_app(app)

    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_EXPIRATION_TIME'] = int(os.getenv('JWT_EXPIRATION_TIME'))
    jwt.init_app(app)

    from main.auth import routes
    app.register_blueprint(routes.auth)

    # Configuración de mail
    app.config['MAIL_HOSTNAME'] = os.getenv('MAIL_HOSTNAME')
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS')
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['FLASKY_MAIL_SENDER'] = os.getenv('FLASKY_MAIL_SENDER')
    # Inicializar en app
    mailsender.init_app(app)

    return app