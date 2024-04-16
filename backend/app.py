from main import create_app
from main import db
import os

app = create_app()

app.app_context().push()


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, port=os.getenv('PORT'))
