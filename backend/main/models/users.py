from .. import db


class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.Integer, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    phone_number = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(80), nullable=False)
    role = db.Column(db.Enum("Admin", "User"), nullable=False)
    loan = db.relationship('Loans', back_populates='user', cascade = 'all, delete-orphan') #relacion con loans

    def to_json(self):
        user_json = {
            "user_id": self.user_id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "password": self.password,
            "phone_number": self.phone_number,
            "address": self.address,
            "role": self.role
        }
        return user_json

    def to_json_complete(self):
        loan = [loan.to_json() for loan in self.loans]
        user_json = {
            "user_id": self.user_id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "password": self.password,
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
            "password": self.password,
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
            password=password,
            phone_number=phone_number,
            address=address,
            role=role
        )
