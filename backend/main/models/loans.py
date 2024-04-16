from .. import db

class Loans(db.Model):
    __tablename__ = 'loans'
    loan_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer) #db.ForeignKey('users.user_id'))
    book_id = db.Column(db.Integer) #db.ForeignKey('books.book_id'))
    loan_date = db.Column(db.Date, nullable=False)
    finish_date = db.Column(db.Date, nullable=False)


    def to_json(self):
        loan_json = {
            'loan_id': self.loan_id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'loan_date': self.loan_date,
            'finish_date': self.finish_date
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