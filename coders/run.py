# encoding: utf-8

from flask import Flask
from home.views import home

app = Flask(__name__)
app.register_blueprint(home)

app.run(port=8000, host='0.0.0.0', debug=True)
