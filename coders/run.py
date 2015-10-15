# encoding: utf-8

from flask import Flask

from home.views import home
from room.views import room, socketio

app = Flask(__name__)
app.register_blueprint(home)
app.register_blueprint(room)

socketio.init_app(app)
socketio.run(app, port=8000, host="0.0.0.0")
