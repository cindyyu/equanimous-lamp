from json import dumps
from flask import Response
from functools import wraps


def jsonapi(func):
    @wraps(func)
    def json_response(*args, **kwargs):
        result = func(*args, **kwargs)
        data = {'data': result[0]}
        json_str = dumps(data)
        resp = Response(json_str, mimetype='application/json')
        resp.status_code = result[1]
        return resp
    return json_response
