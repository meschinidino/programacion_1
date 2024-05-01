from flask_restful import Resource
from flask import request, jsonify
from main.models import BooksModel, AuthorsModel
from sqlalchemy import func, desc
from .. import db

class Books(Resource):
    #obtener lista de los libros
    def get(self):
        books = db.session.query(BooksModel).all()
        return jsonify([books.to_json_short() for books in books])

    #insertar recurso
    def post(self):

        author_ids = request.get_json().get('author_id')
        book = BooksModel.from_json(request.get_json())

        if author_ids:
            #obtener instancias de author recibidas
            authors = AuthorsModel.query.filter(AuthorsModel.author_id.in_(author_ids)).all()
            #agrego instancias de author a la lista de authors de books
            book.authors.extend(authors)

        db.session.add(book)
        db.session.commit()
        return book.to_json(), 201
        """new_book = BooksModel.from_json(request.get_json())
        db.session.add(new_book)
        db.session.commit()
        return new_book.to_json(), 201"""


class Book(Resource):
    #obtener recurso
    def get(self, book_id):
        book = db.session.query(BooksModel).get_or_404(book_id)
        return book.to_json_complete()

    #Modificar el recurso libro
    def put(self, book_id):
        book = db.session.query(BooksModel).get_or_404(book_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(book, key, value)
        db.session.add(book)
        db.session.commit()
        return book.to_json(), 201


    #Eliminar recurso
    def delete(self, book_id):
        #Verifico que exista el libro
        book = db.session.query(BooksModel).get_or_404(book_id)
        db.session.delete(book)
        db.session.commit()
        return 'Deleted', 204


