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

    def to_json(self):
        user_json = {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "password": self.password,
            "phone_number": self.phone_number,
            "address": self.address,
            "role": self.role
        }
        return user_json

    def to_json_short(self):
        user_json = {
            "id": self.id,
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
        id = user_json["id"]
        name = user_json["name"]
        last_name = user_json["last_name"]
        email = user_json["email"]
        password = user_json["password"]
        phone_number = user_json["phone_number"]
        address = user_json["address"]
        role = user_json["role"]

        return Users(id=id, name=name, last_name=last_name, email=email,
                    password=password, phone_number=phone_number,
                    address=address, role=role)
