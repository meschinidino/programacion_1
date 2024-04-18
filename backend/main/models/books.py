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

    def to_json_short(self):
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

    @staticmethod
    def from_json(book_json):
        book_id = book_json.get('book_id')
        author_id = book_json.get('author_id')
        title = book_json.get('title')
        genre = book_json.get('genre')
        year = book_json.get('year')
        editorial = book_json.get('editorial')
        isbn = book_json.get('isbn')
        available = book_json.get('available')
        return Books(
            book_id = book_id,
            author_id = author_id,
            title = title,
            genre = genre,
            year = year,
            editorial = editorial,
            isbn = isbn,
            available = available,
        )

