from flask_restful import Resource
from flask import request, jsonify
from main.models import LoansModel, BooksModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required
from sqlalchemy import func, desc
from .. import db
from datetime import datetime, date as date_module


class Loans(Resource):
    @jwt_required(optional=True)
    def get(self):
        page = 1

        per_page = 10

        loans = db.session.query(LoansModel)

        if request.args.get("page"):
            page = int(request.args.get("page"))

        if request.args.get("per_page"):
            per_page = int(request.args.get("per_page"))

        if request.args.get("user_id"):
            loans = loans.filter(LoansModel.user_id == request.args.get("user_id"))

        if request.args.get("book_id"):
            loans = loans.join(LoansModel.books).filter_by(book_id=request.args.get("book_id")) 
        
        if request.args.get("loan_date"): 
            date = request.args.get('loan_date')
            loans = loans.filter(LoansModel.loan_date.like(f"%{date}"))

        """if request.args.get("sorting_by_finish_date"): #####
            today = datetime.now()
            #loans = loans.filter(func.STRFTIME('%d/%m/%Y', LoansModel.finish_date) < today.strftime('%d/%m/%Y')
            loans = loans.filter(datetime.strptime(getattr(LoansModel, 'finish_date'), '%d/%m/%Y') > today)"""

        loans = loans.paginate(page=page, per_page=per_page, error_out=True)

        return jsonify({'loans': [loan.to_json_short() for loan in loans],
                        'total': loans.total,
                        'pages': loans.pages,
                        'page': page})

    @jwt_required()
    def post(self):
        book_ids = request.get_json().get('book_id')
        loan = LoansModel.from_json(request.get_json())

        if book_ids:

            books = BooksModel.query.filter(BooksModel.loan_id.in_(book_ids)).all()
            loan.books.extend(books)

        db.session.add(loan)
        db.session.commit()
        return loan.to_json_short(), 201


class Loan(Resource):
    @jwt_required()
    def get(self, loan_id):
        loan = db.session.query(LoansModel).get_or_404(loan_id)
        return loan.to_json()

    @jwt_required()
    def put(self, loan_id):
        loan_id = int(loan_id)
        loan = db.session.query(LoansModel).get_or_404(loan_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(loan, key, value)
        db.session.add(loan)
        db.session.commit()
        return loan.to_json_short(), 201

    @role_required(roles = ["Admin"])
    def delete(self, loan_id):
        loan = db.session.query(LoansModel).get_or_404(loan_id)
        db.session.delete(loan)
        db.session.commit()
        return 'Delete', 200

