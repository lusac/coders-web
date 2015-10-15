# encoding: utf-8
import redis

from flask import Flask

from home.views import home
from room.views import room, socketio

app = Flask(__name__)

app.config['SECRET_KEY'] = '4403dac8-370a-4877-8d24-bab0511dc976'
app.config['SESSION_TYPE'] = 'redis'

app.register_blueprint(home)
app.register_blueprint(room)
app.redis = redis.StrictRedis(host='localhost', port=6379, db=0)

app.debug = True

socketio.init_app(app)
socketio.run(app, port=8000, host="0.0.0.0")
