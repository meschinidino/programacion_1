from .. import db

class AuthorBooks(db.Model):
    __tablename__= 'author_books'
    author_id = db.Column(db.Integer, db.ForeignKey('authors.author_id'), primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.book_id'), primary_key=True)
    book = db.relationship('Books', back_populates='author_books')
    author = db.relationship('Authors', back_populates='author_books')
