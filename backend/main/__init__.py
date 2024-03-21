from flask import Flask
from dotenv import load_dotenv
from flask_restful import Api
import main.resources as resources


def create_app():
    # inicio flask
    app = Flask(__name__)

    # variables de entorno
    load_dotenv()

    # espacio para modulos de la app

    return app
