from json import dumps
from flask import Response
from functools import wraps


def jsonapi(func):
    @wraps(func)
    def json_response(*args, **kwargs):
        json_str = dumps(func(*args, **kwargs))
        resp = Response(json_str, mimetype='application/json')
        return resp
    return json_response
