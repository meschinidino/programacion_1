from .. import db

class Authors(db.Model):
    author_id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)

    def to_json(self):
        author_json = {
            "author_id": self.author_id,
            "name": self.name,
            "last_name": self.last_name,
        }
        return author_json