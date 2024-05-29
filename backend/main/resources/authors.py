from flask_restful import Resource
from flask import request, jsonify
from main.models import AuthorsModel, BooksModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required
from sqlalchemy import or_
from .. import db


class Authors(Resource):
    #obtener lista de los libros
    @jwt_required(optional=True)
    def get(self):
        page = 1

        per_page = 10

        authors = db.session.query(AuthorsModel)

        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        # acá van los filtros
        
        if request.args.get('last_name'):
            authors = authors.filter(AuthorsModel.last_name.like("%"+request.args.get('last_name')+"%"))
        if request.args.get('author'):
            author_name = request.args.get('author')
            authors = authors.filter(or_(AuthorsModel.name.like(f"%{author_name}%"), AuthorsModel.last_name.like(f"%{author_name}%")))
        if request.args.get('book_title'):
            book = request.args.get('book_title')
            authors = authors.join(AuthorsModel.books).filter(BooksModel.title.like(f"%{book}%"))

        authors = authors.paginate(page=page, per_page=per_page, error_out=True)

        return jsonify({
            'authors': [author.to_json_short() for author in authors.items],
            'total': authors.total,
            'pages': authors.pages,
            'page': page
        })

    #insertar recurso
    @role_required(roles=["Admin"])
    def post(self):
        new_author = AuthorsModel.from_json(request.get_json())
        db.session.add(new_author)
        db.session.commit()
        return new_author.to_json_short(), 201


class Author(Resource):
    #obtener recurso
    @jwt_required()
    def get(self, author_id):
        author = db.session.query(AuthorsModel).get_or_404(author_id)
        return author.to_json()

    #Modificar el recurso libro
    @role_required(roles=["Admin"])
    def put(self, author_id):
        author = db.session.query(AuthorsModel).get_or_404(author_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(author, key, value)
        db.session.add(author)
        db.session.commit()
        return author.to_json_short(), 201

    #Eliminar recurso
    @role_required(roles=["Admin"])
    def delete(self, author_id):
        #Verifico que exista el libro
        author = db.session.query(AuthorsModel).get_or_404(author_id)
        db.session.delete(author)
        db.session.commit()
        return 'Deleted', 204
