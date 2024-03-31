from flask_restful import Resource
from flask import request

COMMENTS = {
    1: {'title':'amazing!', 'author': 'Alicia', 'email': 'alicia@example.com', 'date': '12/02/2024', 'description': 'i love it'},
    2: {'title':'i would chose another one', 'author': 'Rober', 'email': 'denilo@example.com', 'date': '12/04/2023', 'description': 'it has a lot of dramma'}
}

class Comments(Resource):

    #uno general
    def get(self, id):
        if int(id) in COMMENTS:
            return COMMENTS[int(id)]
        else:
            return {"No existe este comentario"}, 404

    #agregado por nosotros
    def delete(self, id):
        if int(id) in COMMENTS:
            del COMMENTS[int(id)]
            return '', 204
        else:
            return {"No existe este comentario"}, 404

    #agregado por nosotros
    def put(self, id):
        if int(id) in COMMENTS:
            comment = COMMENTS[int(id)]
            data = request.get_json()
            comment.update(data)
            return '', 201
        else:
            return {"No existe este comentario"}, 404

    def post(self):
        new_comment = request.get_json()
        id = int(max(COMMENTS.keys()))+1
        COMMENTS[id] = new_comment
        return COMMENTS[id], 201
