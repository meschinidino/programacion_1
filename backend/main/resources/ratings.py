from flask_restful import Resource
from flask import request, jsonify
from .. import db
from main.models import RatingsModel


class Ratings(Resource):
    def get(self):
        ratings = db.session.query(RatingsModel).all()
        return jsonify([rating.to_json() for rating in ratings])

    def post(self):
        new_rating = RatingsModel.from_json(request.get_json())
        db.session.add(new_rating)
        db.session.commit()
        return new_rating.to_json(), 201


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
        return rating.to_json(), 201

    def delete(self, rating_id):
        rating_id = int(rating_id)
        rating = db.session.query(RatingsModel).get_or_404(rating_id)
        db.session.delete(rating)
        db.session.commit()
        return 'Deleted', 204
