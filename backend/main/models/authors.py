from .. import db

author_books = db.Table(
        "author_books",
        db.Column('author_id',db.Integer,db.ForeignKey('authors.author_id'),primary_key=True),
        db.Column('book_id',db.Integer,db.ForeignKey('books.book_id'),primary_key=True),
    )

class Authors(db.Model):
    __tablename__ = 'authors'
    author_id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    books = db.relationship('Books', secondary=author_books,backref=db.backref('authors', lazy='dynamic'))

    def to_json(self):
        author_json = {
            "author_id": self.author_id,
            "name": self.name,
            "last_name": self.last_name,
        }
        return author_json

    def to_json_complete(self):
        books = [book.to_json() for book in self.books]
        author_json = {
            "author_id": self.author_id,
            "name": self.name,
            "last_name": self.last_name,
            "books" : books,
        }
        return author_json
    
    def to_json_short(self):
        author_json = {
            "author_id": self.author_id,
            "name": self.name,
            "last_name": self.last_name,
        }
        return author_json

    @staticmethod
    def from_json(author_json):
        author_id = author_json.get("author_id")
        name = author_json.get("name")
        last_name = author_json.get("last_name")
        return Authors(
            author_id = author_id,
            name = name,
            last_name = last_name,
        )