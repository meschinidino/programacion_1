from .. import db
import json

books_authors = db.Table("books_authors",
    db.Column("book_id", db.Integer, db.ForeignKey("book_id"),primary_key=True),
    db.Column("author_id", db.Integer,db.ForeignKey("author_id"),primary_key=True)
    )

class Books(db.Model):
    __tablename__ = 'books'
    book_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50), nullable=False)
    genre = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    editorial = db.Column(db.String(50), nullable=False)
    isbn = db.Column(db.Integer, nullable=False)
    available = db.Column(db.Integer, nullable=False)
    author_id = db.relationship('Author', secondary=books_authors, backref=db.backref('books', lazy='dynamic'))

    def to_json(self):
        ratings = [rating.to_json_short() for rating in self.ratings]
        book_json = {
            'book_id': self.book_id,
            'author_id': self.author_id,
            'title': str(self.title),
            'genre': str(self.genre),
            'year': self.year,
            'editorial': str(self.editorial),
            'isbn': self.isbn,
            'available': self.available,
            'ratings': ratings
        }
        return book_json

    def to_json_complete(self):
        book_json = {
            'book_id': self.book_id,
            'author_id': self.author_id,
            'title': str(self.title),
            'genre': str(self.genre),
            'year': self.year,
            'editorial': str(self.editorial),
            'isbn': self.isbn,
            'available': self.available,
            'ratings': self.ratings
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

