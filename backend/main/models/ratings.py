from .. import db

class Ratings(db.Model):
    __tablename__ = 'ratings'
    rating_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer) # Foreign Key
    book_id = db.Column(db.Integer) # Foreign Key
    assessment = db.Column(db.Integer)
    valuation_date = db.Column(db.Date)
    book_idbook = db.Column(db.Integer) # Foreign Key
    comment = db.Column(db.String(45))

    def to_json(self):
        rating_json = {
            "rating_id": self.rating_id,
            "user_id": self.user_id,
            "book_id": self.book_id,
            "assessment": self.assessment,
            "valuation_date": self.valuation_date,
            "book_idbook": self.book_idbook,
            "comment": self.comment
        }
        return rating_json
