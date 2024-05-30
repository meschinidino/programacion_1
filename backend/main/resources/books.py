from flask_restful import Resource
from flask import request, jsonify
from sqlalchemy import select
from main.models import BooksModel, AuthorsModel, RatingsModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required
from sqlalchemy import func, desc, or_, asc
from .. import db

class Books(Resource):
    #obtener lista de los libros
    @jwt_required(optional=True)
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
            if request.args.get('sortby_rating') == 'd':
                books = books.outerjoin(BooksModel.ratings).group_by(BooksModel.book_id).order_by(func.avg(RatingsModel.assessment).desc()) 
            if request.args.get('sortby_rating') == 'a':
                books = books.outerjoin(BooksModel.ratings).group_by(BooksModel.book_id).order_by(func.avg(RatingsModel.assessment).asc()) 
        if request.args.get('author'):
            author_name = request.args.get('author')
            books = books.filter(BooksModel.authors.any(or_(AuthorsModel.name.like(f"%{author_name}%"), AuthorsModel.last_name.like(f"%{author_name}%"))))

        books = books.paginate(page=page, per_page=per_page, error_out=True, max_per_page=30)

        return jsonify({'books': [book.to_json() for book in books],
                        'total':books.total,
                        'pages':books.pages,
                        'page': page})

    #insertar recurso
    @role_required(roles=["Admin"])
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
        return book.to_json_short(), 201


class Book(Resource):
    #obtener recurso
    @jwt_required()
    def get(self, book_id):
        book = db.session.query(BooksModel).get_or_404(book_id)
        return book.to_json()

    #Modificar el recurso libro
    @role_required(roles=["Admin"])
    def put(self, book_id):
        book = db.session.query(BooksModel).get_or_404(book_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(book, key, value)
        db.session.add(book)
        db.session.commit()
        return book.to_json_short(), 201


    #Eliminar recurso
    @role_required(roles=["Admin"])
    def delete(self, book_id):
        #Verifico que exista el libro
        book = db.session.query(BooksModel).get_or_404(book_id)
        db.session.delete(book)
        db.session.commit()
        return 'Deleted', 204


