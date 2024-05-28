from flask_restful import Resource
from flask import request, jsonify
from main.models import LoansModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required

from .. import db


class Loans(Resource):
    @jwt_required(optional=True)

    def get(self):
        loans = db.session.query(LoansModel).all()
        return jsonify([loan.to_json() for loan in loans])

    @jwt_required()
    def post(self):
        new_loan = LoansModel.from_json(request.get_json())
        db.session.add(new_loan)
        db.session.commit()
        return new_loan.to_json_short(), 201


class Loan(Resource):
    @jwt_required()
    def get(self, loan_id):
        loan = db.session.query(LoansModel).get_or_404(loan_id)

        current_identity = get_jwt_identity()
        if current_identity:
            return loan.to_json
        else:
            return loan.to_json_short

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


    @role_required(roles=['Admin'])
    def delete(self, loan_id):
        loan = db.session.query(LoansModel).get_or_404(loan_id)
        db.session.delete(loan)
        db.session.commit()
        return 'Delete', 200

