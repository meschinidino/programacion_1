from .. import db


class Ratings(db.Model):
    __tablename__ = 'ratings'
    rating_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)  # Foreign Key
    assessment = db.Column(db.Integer, nullable=False)
    valuation_date = db.Column(db.String, nullable=False)
    comment = db.Column(db.String(45), nullable=False)
    #relations
    book_id = db.Column(db.Integer, db.ForeignKey("books.book_id"), nullable=False)  # Foreign Key
    book = db.relationship("Books", back_populates="ratings")


    def __repr__(self):
        return '<Ratings %r>' % self.rating_id

    def to_json(self):
        rating_json = {
            "rating_id": self.rating_id,
            "user_id": self.user_id,
            "book_id": self.book_id,
            "assessment": self.assessment,
            "valuation_date": self.valuation_date,
            "comment": self.comment,
            "book" : self.book.to_json(),
        }
        return rating_json

    def to_json_short(self):
        rating_json = {
            "rating_id": self.rating_id,
            "user_id": self.user_id,
            "book_id": self.book_id,
            "assessment": self.assessment,
            "valuation_date": self.valuation_date,
            "comment": self.comment
        }
        return rating_json

    @staticmethod
    def from_json(rating_json):
        rating_id = rating_json.get("rating_id")
        user_id = rating_json.get("user_id")
        book_id = rating_json.get("book_id")
        assessment = rating_json.get("assessment")
        valuation_date = rating_json.get("valuation_date")
        comment = rating_json.get("comment")

        return Ratings(
            rating_id=rating_id,
            user_id=user_id,
            book_id=book_id,
            assessment=assessment,
            valuation_date=valuation_date,
            comment=comment
        )
