# encoding: utf-8
import redis

from flask import Flask

from home.views import home
from room.views import room, socketio

app = Flask(__name__)
app.debug = True
app.register_blueprint(home)
app.register_blueprint(room)
app.redis = redis.StrictRedis(host='localhost', port=6379, db=0)

socketio.init_app(app)
socketio.run(app, port=8000, host="0.0.0.0")
