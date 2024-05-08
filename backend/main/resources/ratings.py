from flask_restful import Resource
from flask import request, jsonify
from .. import db
from main.models import RatingsModel, UsersModel, BooksModel
from sqlalchemy import func, desc, or_


class Ratings(Resource):
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
        if request.args.get('sort_descending'):
            ratings = ratings.order_by(desc(RatingsModel.assessment))
        if request.args.get('valuation_date'):
            valuation_date_value = request.args.get('valuation_date')
            ratings = ratings.filter(RatingsModel.valuation_date == valuation_date_value)
        if request.args.get('user_id'):
            user_name = request.args.get('user_id')
            ratings = ratings.filter(RatingsModel.users.any(
                or_(UsersModel.name.like(f"%{user_name}%"), UsersModel.last_name.like(f"%{user_name}%"))))
        # if request.args.get('book_id'):
        #     book = request.args.get('book_id')
        #     ratings = ratings.filter(RatingsModel.books.any(or_(BooksModel.title.like(f"%{book}%"))))

        ratings = ratings.paginate(page=page, per_page=per_page, error_out=True, max_per_page=30)

        return jsonify({'ratings': [rating.to_json_short() for rating in ratings],
                        'total': ratings.total,
                        'pages': ratings.pages,
                        'page': page})

    def post(self):
        new_rating = RatingsModel.from_json(request.get_json())
        db.session.add(new_rating)
        db.session.commit()
        return new_rating.to_json_short(), 201


class Rating(Resource):
    def get(self, rating_id):
        #rating_id = int(rating_id)
        rating = db.session.query(RatingsModel).get_or_404(rating_id)
        return rating.to_json()

    def put(self, rating_id):
        rating_id = int(rating_id)
        rating = db.session.query(RatingsModel).get_or_404(rating_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(rating, key, value)
        db.session.add(rating)
        db.session.commit()
        return rating.to_json_short(), 201

    def delete(self, rating_id):
        rating_id = int(rating_id)
        rating = db.session.query(RatingsModel).get_or_404(rating_id)
        db.session.delete(rating)
        db.session.commit()
        return 'Deleted', 204
