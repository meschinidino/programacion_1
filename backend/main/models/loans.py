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