from flask_restful import Resource
from flask import request, jsonify
from main.models import BooksModel
from .. import db

class Books(Resource):
    #obtener lista de los libros
    def get(self):
        books = db.session.query(BooksModel).all()
        return jsonify([books.to_json() for books in books])

    #insertar recurso
    def post(self):
        new_book = BooksModel.from_json(request.get_json())
        db.session.add(new_book)
        db.session.commit()
        return new_book.to_json(), 201


class Book(Resource):
    #obtener recurso
    def get(self, book_id):
        book = db.session.query(BooksModel).get_or_404(book_id)
        return book.to_json()

    #Modificar el recurso libro
    def put(self, book_id):
        book_id = int(book_id)
        book = db.session.query(BooksModel).get_or_404(book_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(book, key, value)
        db.session.add(book)
        db.session.commit()
        return book.to_json(), 201


    #Eliminar recurso
    def delete(self, id):
        #Verifico que exista el libro
        book_id = int(id)
        book = db.session.query(BooksModel).get_or_404(book_id)
        db.session.delete(book)
        db.session.commit()
        return 'Deleted', 204


