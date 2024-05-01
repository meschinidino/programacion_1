from .. import db
from . import UsersModel
from . import BooksModel

loans_books = db.Table(
    'loans_books',
    db.Column('loan_id', db.Integer, db.ForeignKey("loans.loan_id"), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey("books.book_id"), primary_key=True),
)

class Loans(db.Model):
    __tablename__ = 'loans'
    loan_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    loan_date = db.Column(db.String, nullable=False)
    finish_date = db.Column(db.String, nullable=False)
    users = db.relationship('Users', back_populates='loans', uselist=False, single_parent=True)
    books = db.relationship('Books', secondary=loans_books, backref=db.backref('loans', lazy='dynamic'))

    def __repr__(self):
        return '<Loan %r>' % self.loan_id

    def to_json(self):
        loan_json = {
            'loan_id': self.loan_id,
            'user_id': self.user_id,
            'loan_date': self.loan_date,
            'finish_date': self.finish_date,
            'user': self.users.to_json(), #muestra el user de ese loan
            'books': [book.to_json() for book in self.books] #muestra el book de ese loan
        }
        return loan_json

    def to_json_short(self):
        loan_json = {
            'loan_id': self.loan_id,
            'user_id': self.user_id,
            'loan_date': self.loan_date,
            'finish_date': self.finish_date
        }
        return loan_json

    @staticmethod
    def from_json(loan_json):
        loan_id = loan_json.get('loan_id')
        user_id = loan_json.get('user_id')
        loan_date = loan_json.get('loan_date')
        finish_date = loan_json.get('finish_date')
        return Loans(
            loan_id = loan_id,
            user_id = user_id,
            loan_date = loan_date,
            finish_date = finish_date,
        )