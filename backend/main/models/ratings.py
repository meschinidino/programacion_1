from .. import db

class Ratings(db.Model):
    __tablename__ = 'ratings'
    rating_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable = False) # Foreign Key
    book_id = db.Column(db.Integer, nullable = False) # Foreign Key
    assessment = db.Column(db.Integer, nullable = False)
    valuation_date = db.Column(db.Date, nullable = False)
    comment = db.Column(db.String(45), nullable = False)

    def to_json(self):
        rating_json = {
            "rating_id": self.rating_id,
            "user_id": self.user_id,
            "book_id": self.book_id,
            "assessment": self.assessment,
            "valuation_date": self.valuation_date.isoformat(),
            "comment": self.comment
        }
        return rating_json
