from flask_restful import Resource
from flask import request, jsonify
from .. import db
from main.models import RatingsModel, UsersModel, BooksModel, LoansModel
from main.resources.loans import UserBorrowedBooks
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required
from sqlalchemy import func, desc, or_, asc
from sqlalchemy.exc import IntegrityError


class Ratings(Resource):
    @jwt_required(optional=True)
    def get(self):
        page = 1
        per_page = 10
        ratings = db.session.query(RatingsModel)

        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        ##FILTERS
        if request.args.get('assessment'):
            assessment_value = request.args.get('assessment')
            ratings = ratings.filter(RatingsModel.assessment == assessment_value)
        if request.args.get('sort_by'):
            if request.args.get('sort_by') == 'd':
                ratings = ratings.order_by(desc(RatingsModel.assessment))
            if request.args.get('sort_by') == 'a':
                ratings = ratings.order_by(asc(RatingsModel.assessment))
        if request.args.get('valuation_date'):
            valuation_date_value = request.args.get('valuation_date')
            ratings = ratings.filter(RatingsModel.valuation_date.like(f"%{valuation_date_value}"))

        if request.args.get('name'):
            user_name = request.args.get('user_id')
            ratings = ratings.join(UsersModel).filter(or_(UsersModel.name.like(f"%{user_name}%"), UsersModel.last_name.like(f"%{user_name}%")))

        if request.args.get('book_title'):
            book = request.args.get('book_title')
            ratings = ratings.join(BooksModel).filter(BooksModel.title.like(f"%{book}%"))

        if request.args.get('book_id'):
            book_id = request.args.get('book_id')
            ratings = ratings.join(BooksModel).filter_by(book_id = book_id)

        if request.args.get('user_id'):
            user_id = request.args.get('user_id')
            ratings = ratings.join(UsersModel).filter_by(user_id = user_id)

        ratings = ratings.paginate(page=page, per_page=per_page, error_out=True, max_per_page=30)

        return jsonify({'ratings': [rating.to_json() for rating in ratings],
                        'total': ratings.total,
                        'pages': ratings.pages,
                        'page': page})

    @jwt_required()
    def post(self):
        try:
            # Obtener el ID del usuario actual
            current_user = get_jwt_identity()
            
            # Obtener datos de la reseña
            rating_data = request.get_json()
            book_id = rating_data.get('book_id')
            
            # Verificar si el usuario puede hacer la reseña
            can_rate = CanUserRate().get(current_user, book_id)
            
            if not can_rate:
                return {'mensaje': 'No puedes hacer una reseña de este libro'}, 400
            
            # Si puede hacer la reseña, crearla
            new_rating = RatingsModel.from_json(rating_data)
            new_rating.user_id = current_user
            
            db.session.add(new_rating)
            db.session.commit()
            return new_rating.to_json_short(), 201
            
        except IntegrityError:
            db.session.rollback()
            return {'mensaje': 'Error: Ya existe una reseña para este libro'}, 400
        except Exception as e:
            db.session.rollback()
            return {'mensaje': str(e)}, 400


class Rating(Resource):
    #obtener rating
    @jwt_required()
    def get(self, rating_id):
        rating = db.session.query(RatingsModel).get_or_404(rating_id)

        current_identity = get_jwt_identity()
        if current_identity:
            return rating.to_json()
        else:
            return rating.to_json_short()

    @jwt_required()
    def put(self, rating_id):
        rating_id = int(rating_id)
        rating = db.session.query(RatingsModel).get_or_404(rating_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(rating, key, value)
        db.session.add(rating)
        db.session.commit()
        return rating.to_json_short(), 201

    @role_required(roles = ["Admin", "Librarian"])
    def delete(self, rating_id):
        rating_id = int(rating_id)
        rating = db.session.query(RatingsModel).get_or_404(rating_id)
        db.session.delete(rating)
        db.session.commit()
        return 'Deleted', 204

class CanUserRate(Resource):
    @jwt_required(optional=True)
    def get(self, user_id, book_id):
        user_id = int(user_id)
        book_id = int(book_id)
        
        # Verificar si ya existe una calificación
        existing_rating = db.session.query(RatingsModel).filter_by(
            user_id=user_id, 
            book_id=book_id
        ).first()
        
        if existing_rating:
            return False
        
        # Verificar si el usuario ha tomado prestado el libro
        borrowed_book = db.session.query(LoansModel)\
            .filter(LoansModel.user_id == user_id)\
            .filter(LoansModel.books.any(book_id=book_id))\
            .first()
        
        can_rate = borrowed_book is not None
        
        return can_rate