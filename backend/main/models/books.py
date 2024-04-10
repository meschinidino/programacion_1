from .. import db

class Books(db.Model):
    __tablename__ = 'books'
    book_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    author_id = db.Column(db.Integer) #db.ForeignKey('authors.author_id'
    title = db.Column(db.String(50), nullable=False)
    genre = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    editorial = db.Column(db.String(50), nullable=False)
    isbn = db.Column(db.Integer, nullable=False)
    available = db.Column(db.Integer, nullable=False)

    def to_json(self):
        book_json = {
            'book_id': self.book_id,
            'author_id': self.author_id,
            'title': str(self.title),
            'genre': str(self.genre),
            'year': self.year,
            'editorial': str(self.editorial),
            'isbn': self.isbn,
            'available': self.available
        }
        return book_json