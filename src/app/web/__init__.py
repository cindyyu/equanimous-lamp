from flask import Flask, jsonify
from web.api.spot import api_bp
from web.ui.views import ui_bp
from context.database import db
from context.context import config_service
from model import orm
from util.exception import UsageError


app = Flask(__name__)
config_service.config_flask(app)

db.init_app(app)
with app.app_context():
    db.create_all()

app.register_blueprint(ui_bp)
app.register_blueprint(api_bp)


@app.errorhandler(UsageError)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
