from flask_restful import Resource
from flask import request

RATINGS = {
    1: {'book_id': 1, 'user_id': 1, 'rating': 5},
    2: {'book_id': 2, 'user_id': 2, 'rating': 4}

}

class Ratings(Resource):
    def get(self):
        return RATINGS

    def post(self):
        new_rating = request.get_json()
        rating_id = max(RATINGS.keys()) + 1
        RATINGS[rating_id] = new_rating
        return RATINGS[rating_id], 201
    
class Rating(Resource):
    def get(self, rating_id):
        rating_id = int(rating_id)
        if rating_id in RATINGS:
            return RATINGS[rating_id]
        else:
            return {'error': 'Rating no encontrado'}, 404

    def put(self, rating_id):
        rating_id = int(rating_id)
        if rating_id in RATINGS:
            rating_data = request.get_json()
            RATINGS[rating_id].update(rating_data)
            return RATINGS[rating_id], 200
        else:
            return {'error': 'Rating no encontrado'}, 404

    def delete(self, rating_id):
        rating_id = int(rating_id)
        if rating_id in RATINGS:
            del RATINGS[rating_id]
            return '', 204
        else:
            return {'error': 'Rating no encontrado'}, 404