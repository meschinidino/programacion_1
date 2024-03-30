from flask_restful import Resource
from flask import request

LOANS = {
    1: {'book_id': 1, 'user_id': 1, 'loan_date': '2021-01-01', 'return_date': '2021-01-15'},
    2: {'book_id': 2, 'user_id': 2, 'loan_date': '2021-01-02', 'return_date': '2021-01-16'}

}

class Loans(Resource):
    def get(self):
        return LOANS

    def post(self):
        new_loan = request.get_json()
        loan_id = max(LOANS.keys()) + 1
        LOANS[loan_id] = new_loan
        return LOANS[loan_id], 201
    
class Loan(Resource):
    def get(self, loan_id):
        loan_id = int(loan_id)
        if loan_id in LOANS:
            return LOANS[loan_id]
        else:
            return {'error': 'Préstamo no encontrado'}, 404

    def put(self, loan_id):
        loan_id = int(loan_id)
        if loan_id in LOANS:
            loan_data = request.get_json()
            LOANS[loan_id].update(loan_data)
            return LOANS[loan_id], 200
        else:
            return {'error': 'Préstamo no encontrado'}, 404

    def delete(self, loan_id):
        loan_id = int(loan_id)
        if loan_id in LOANS:
            del LOANS[loan_id]
            return '', 204
        else:
            return {'error': 'Préstamo no encontrado'}, 404
        
#jma