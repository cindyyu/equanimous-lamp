from flask import Flask
from web.api.spot import bp


app = Flask(__name__)

app.register_blueprint(bp)
