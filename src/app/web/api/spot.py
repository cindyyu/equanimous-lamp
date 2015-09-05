from flask import Blueprint
from util.jsonapi import jsonapi
from context.context import config_service


bp = Blueprint('bp', __name__, url_prefix='/api/' + str(config_service.flask_config['api']['version']))


@bp.route("/spot", methods=['GET'])
@jsonapi
def home():
    return 'hi'
