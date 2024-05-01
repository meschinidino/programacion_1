from flask_restful import Resource
from flask import request, jsonify
from sqlalchemy import select
from main.models import BooksModel, AuthorsModel, RatingsModel
from sqlalchemy import func, desc, or_
from .. import db

class Books(Resource):
    #obtener lista de los libros
    def get(self):

        page = 1

        per_page = 10

        books = db.session.query(BooksModel)

        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        #FILTROS POR AUTOR, GENERO, TITULO, ORDENAR POR RATING

        if request.args.get('genre'):
            books = books.filter(BooksModel.genre.like("%"+request.args.get('genre')+"%"))
        if request.args.get('title'):
            books = books.filter(BooksModel.title.like("%"+request.args.get('title')+"%"))
        if request.args.get('sortby_rating'):
            pass
        if request.args.get('author'):
            author_name = request.args.get('author')
            books = books.filter(BooksModel.authors.any(or_(AuthorsModel.name.like(f"%{author_name}%"), AuthorsModel.last_name.like(f"%{author_name}%"))))

        books = books.paginate(page=page, per_page=per_page, error_out=True, max_per_page=30)

        return jsonify({'books': [book.to_json_complete() for book in books],
                        'total':books.total,
                        'pages':books.pages,
                        'page': page})

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


