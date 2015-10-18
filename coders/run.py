# encoding: utf-8
import os
import redis

from redis.sentinel import Sentinel

from flask import Flask

from home.views import home
from room.views import room
from room.events import socketio

REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = os.getenv('REDIS_PORT', 6379)
REDIS_PASS = os.getenv('REDIS_PASS', None)
REDIS_MASTER = os.getenv('REDIS_MASTER', None)

DEBUG = os.getenv('DEBUG', True)
PORT = int(os.getenv('PORT', '8000'))

app = Flask(__name__)

app.config['SECRET_KEY'] = '4403dac8-370a-4877-8d24-bab0511dc976'
app.config['SESSION_TYPE'] = 'redis'

app.register_blueprint(home)
app.register_blueprint(room)

if REDIS_HOST == 'localhost':
    app.redis = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=0)
else:
    sentinel = Sentinel([(REDIS_HOST, REDIS_PORT)], socket_timeout=0.1, password=REDIS_PASS)
    app.redis = sentinel.master_for(REDIS_MASTER, socket_timeout=0.1)

app.debug = DEBUG

socketio.init_app(app)
socketio.run(app, port=PORT, host='0.0.0.0')
