from flask_restful import Resource
from flask import request
from main.models import BooksModel
from .. import db

BOOKS = {
    1:{'name':'book1', 'author':'author1'},
    2:{'name':'book2','author':'author2'},
}


class Books(Resource):
    #obtener lista de los libros
    def get(self):
        return BOOKS

    #insertar recurso
    def post(self):
        new_book = request.get_json()
        id = int(max(BOOKS.keys()))+1
        BOOKS[id] = new_book
        return BOOKS[id], 201
    
class Book(Resource):
    #obtener recurso
    def get(self, id):
        book = db.session.query(BooksModel).get_or_404(id)
        return book.to_json
        """#Verifico que exista el libro
        if int(id) in BOOKS:
            #retorno libro
            return BOOKS[int(id)]
        #Si no existe 404
        return 'Libro no encontrado', 404"""
    
    #Eliminar recurso
    def delete(self, id):
        #Verifico que exista el libro
        if int(id) in BOOKS:
            #elimino libro
            del BOOKS[int(id)]
            return '', 204
        #Si no existe 404
        return 'Libro no encontrado', 404
    
    #Modificar el recurso libro
    def put(self, id):
        if int(id) in BOOKS:
            book = BOOKS[int(id)]
            data = request.get_json()
            book.update(data)
            return '', 201
        return 'Libro no encontrado', 404
