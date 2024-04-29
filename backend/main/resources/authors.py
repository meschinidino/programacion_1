from flask_restful import Resource
from flask import request, jsonify
from main.models import AuthorsModel
from .. import db


class Authors(Resource):
    #obtener lista de los libros
    def get(self):
        page = 1

        per_page = 10

        authors = db.session.query(AuthorsModel).all()

        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        # acá van las relaciones

        authors = authors.paginate(page=page, per_page=per_page, error_out=True)

        return jsonify([authors.to_json() for authors in authors])

    #insertar recurso
    def post(self):
        new_author = AuthorsModel.from_json(request.get_json())
        db.session.add(new_author)
        db.session.commit()
        return new_author.to_json(), 201


class Author(Resource):
    #obtener recurso
    def get(self, author_id):
        author = db.session.query(AuthorsModel).get_or_404(author_id)
        return author.to_json()

    #Modificar el recurso libro
    def put(self, author_id):
        author = db.session.query(AuthorsModel).get_or_404(author_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(author, key, value)
        db.session.add(author)
        db.session.commit()
        return author.to_json(), 201

    #Eliminar recurso
    def delete(self, author_id):
        #Verifico que exista el libro
        author = db.session.query(AuthorsModel).get_or_404(author_id)
        db.session.delete(author)
        db.session.commit()
        return 'Deleted', 204
