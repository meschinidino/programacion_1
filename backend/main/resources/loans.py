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

        return jsonify({'loans': [loan.to_json() for loan in loans],
                        'total': loans.total,
                        'pages': loans.pages,
                        'page': page})
    
    

    @jwt_required()
    def post(self):
        try:
            # Log para ver los datos recibidos
            print("Request Headers:", dict(request.headers))
            print("Request Data:", request.get_data(as_text=True))
            print("Request JSON:", request.get_json())
            
            # Validar que se recibió un JSON válido
            if not request.is_json:
                return {"error": "El contenido debe ser JSON"}, 400
            
            loan_data = request.get_json()
            
            # Log para ver los datos procesados
            print("Loan Data procesada:", loan_data)
            
            # Validar que existan los campos requeridos
            required_fields = ['user_id', 'loan_date', 'finish_date', 'book_id']
            for field in required_fields:
                if field not in loan_data:
                    return {"error": f"El campo {field} es requerido"}, 400
            
            book_ids = loan_data.get('book_id')
            
            # Validar que book_ids sea una lista
            if not isinstance(book_ids, list):
                return {"error": "book_id debe ser una lista"}, 400
            
            # Crear el préstamo
            loan = LoansModel(
                user_id=loan_data['user_id'],
                loan_date=loan_data['loan_date'],
                finish_date=loan_data['finish_date']
            )
            
            # Verificar que los libros existan y tengan copias disponibles
            if book_ids:
                books = BooksModel.query.filter(BooksModel.book_id.in_(book_ids)).all()
                if len(books) != len(book_ids):
                    return {"error": "Uno o más libros no existen"}, 404
                    
                # Verificar y actualizar la disponibilidad de cada libro
                for book in books:
                    if book.available <= 0:
                        return {"error": f"El libro '{book.title}' no está disponible"}, 400
                    book.available -= 1
                    
                loan.books.extend(books)
                
            db.session.add(loan)
            db.session.commit()
            
            return loan.to_json(), 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 422


class Loan(Resource):
    @role_required(roles=["Librarian","Admin"])
    def get(self, loan_id):
        loan = db.session.query(LoansModel).get_or_404(loan_id)
        return loan.to_json()

    @role_required(roles=["Librarian","Admin"])
    def put(self, loan_id):
        loan_id = int(loan_id)
        loan = db.session.query(LoansModel).get_or_404(loan_id)
        data = request.get_json().items()
        for key, value in data:
            setattr(loan, key, value)
        db.session.add(loan)
        db.session.commit()
        return loan.to_json_short(), 201

    @role_required(roles = ["Librarian","Admin"])
    def delete(self, loan_id):
        loan = db.session.query(LoansModel).get_or_404(loan_id)
    
    # Aumentar la disponibilidad de los libros devueltos
        for book in loan.books:
            book.available += 1
    
        db.session.delete(loan)
        db.session.commit()
        return 'Delete', 200


class LoansByUser(Resource):
    @jwt_required()
    def get(self, user_id):
        page = 1
        per_page = 10

        if request.args.get("page"):
            page = int(request.args.get("page"))
        if request.args.get("per_page"):
            per_page = int(request.args.get("per_page"))

        loans = db.session.query(LoansModel).filter(LoansModel.user_id == user_id)
        loans = loans.paginate(page=page, per_page=per_page, error_out=True)

        return jsonify({
            'loans': [loan.to_json() for loan in loans],
            'total': loans.total,
            'pages': loans.pages,
            'page': page
        })


class UserBorrowedBooks(Resource):
    @jwt_required(optional=True)
    def get(self, user_id):
        page = 1
        per_page = 10

        if request.args.get("page"):
            page = int(request.args.get("page"))
        if request.args.get("per_page"):
            per_page = int(request.args.get("per_page"))
        
        # Obtener los préstamos del usuario y sus libros asociados
        loans_with_books = db.session.query(LoansModel)\
            .filter(LoansModel.user_id == user_id)\
            .paginate(page=page, per_page=per_page, error_out=True)
        
        borrowed_books = []
        for loan in loans_with_books.items:
            for book in loan.books:
                book_data = book.to_json()
                book_data.update({
                    'loan_date': loan.loan_date,
                    'finish_date': loan.finish_date,
                    'loan_id': loan.loan_id
                })
                borrowed_books.append(book_data)
        
        return jsonify({
            'borrowed_books': borrowed_books,
            'total': loans_with_books.total,
            'pages': loans_with_books.pages,
            'page': page
        })

