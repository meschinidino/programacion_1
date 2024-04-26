from flask_restful import Resource
from flask import request, jsonify
from main.models import LoansModel
from .. import db


class Loans(Resource):

    def get(self):
        loans = db.session.query(LoansModel).all()
        return jsonify([loan.to_json_short() for loan in loans])

    def post(self):
        new_loan = LoansModel.from_json(request.get_json())
        db.session.add(new_loan)
        db.session.commit()
        return new_loan.to_json_short(), 201


class Loan(Resource):
    def get(self, loan_id):
        loan = db.session.query(LoansModel).get_or_404(loan_id)
        return loan.to_json_short()

    def put(self, loan_id):
        loan_id = int(loan_id)
        loan = db.session.query(LoansModel).get_or_404(loan_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(loan, key, value)
        db.session.add(loan)
        db.session.commit()
        return loan.to_json_short(), 201

    def delete(self, loan_id):
        loan = db.session.query(LoansModel).get_or_404(loan_id)
        db.session.delete(loan)
        db.session.commit()
        return 'Delete', 200

# jma 2024