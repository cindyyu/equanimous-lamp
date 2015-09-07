from flask import render_template, Blueprint


ui_bp = Blueprint('ui_bp', __name__, url_prefix='/')


@ui_bp.route('/', methods=['GET'])
def index():
    return render_template('index.html')
