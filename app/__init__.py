from flask import Flask
from flask_bootstrap import Bootstrap

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your secret key'

bootstrap = Bootstrap(app)

from app import routes



