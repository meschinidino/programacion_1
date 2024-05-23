from .. import db
from werkzeug.security import generate_password_hash, check_password_hash

class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.Integer, nullable=False) #para login
    password = db.Column(db.String(80), nullable=False)
    phone_number = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(80), nullable=False)
    role = db.Column(db.Enum('Admin', 'User'), nullable=False)
    loans = db.relationship('Loans', back_populates='users', cascade = 'all, delete-orphan') #relacion con loans

    #Getter de la contraseña plana no permite leerla
    @property
    def plain_password(self):
        raise AttributeError('Password cant be read')
    
    # calcula el hash de una contraseña puesta y lo guarda en password
    @plain_password.setter
    def plain_password(self, password):
        self.password = generate_password_hash(password)

    #Método que compara una contraseña en texto plano con el hash guardado en la db
    def validate_pass(self,password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return '<User %r>' % self.user_id

    def to_json(self):
        loan = [loan.to_json_short() for loan in self.loans]
        user_json = {
            "user_id": self.user_id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            #"password": self.password,
            "phone_number": self.phone_number,
            "address": self.address,
            "role": self.role,
            "loans": loan
        }
        return user_json

    def to_json_short(self):
        user_json = {
            "user_id": self.user_id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            #"password": self.password,
            "phone_number": self.phone_number,
            "address": self.address,
            "role": self.role
        }
        return user_json

    @staticmethod
    def from_json(user_json):
        user_id = user_json.get("user_id")
        name = user_json.get("name")
        last_name = user_json.get("last_name")
        email = user_json.get("email")
        password = user_json.get("password")
        phone_number = user_json.get("phone_number")
        address = user_json.get("address")
        role = user_json.get("role")

        return Users(
            user_id=user_id,
            name=name,
            last_name=last_name,
            email=email,
            plain_password=password,
            phone_number=phone_number,
            address=address,
            role=role
        )
