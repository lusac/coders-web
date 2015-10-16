# encoding: utf-8
import os

import redis

from flask import Flask

from home.views import home
from room.views import room, socketio

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = os.getenv("REDIS_PORT", 6379)
DEBUG = os.getenv("DEBUG", False)
PORT = int(os.getenv("PORT", '8000'))

app = Flask(__name__)

app.config['SECRET_KEY'] = '4403dac8-370a-4877-8d24-bab0511dc976'
app.config['SESSION_TYPE'] = 'redis'

app.register_blueprint(home)
app.register_blueprint(room)
app.redis = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=0)

app.debug = DEBUG

socketio.init_app(app)
socketio.run(app, port=PORT, host="0.0.0.0")
