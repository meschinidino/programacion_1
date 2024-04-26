from .. import db
from . import UsersModel

class Loans(db.Model):
    __tablename__ = 'loans'
    loan_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    book_id = db.Column(db.Integer) #db.ForeignKey('books.book_id'))
    loan_date = db.Column(db.String, nullable=False)
    finish_date = db.Column(db.String, nullable=False)
    user = db.relationship('Users', back_populates='loans', uselist=False, single_parent=True)

    def __repr__(self):
        return '<Loan %r>' % self.loan_id

    def to_json(self):
        #user = db.session.query(UsersModel).get_or_404(self.user_id)
        loan_json = {
            'loan_id': self.loan_id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'loan_date': self.loan_date,
            'finish_date': self.finish_date,
            #'user': user
        }
        return loan_json

    def to_json_short(self):
        loan_json = {
            'loan_id': self.loan_id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'loan_date': self.loan_date,
            'finish_date': self.finish_date
        }
        return loan_json

    @staticmethod
    def from_json(loan_json):
        loan_id = loan_json.get('loan_id')
        user_id = loan_json.get('user_id')
        book_id = loan_json.get('book_id')
        loan_date = loan_json.get('loan_date')
        finish_date = loan_json.get('finish_date')
        return Loans(
            loan_id = loan_id,
            user_id = user_id,
            book_id = book_id,
            loan_date = loan_date,
            finish_date = finish_date,
        )