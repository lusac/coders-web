from flask import Blueprint, render_template
from flask.ext.socketio import SocketIO, emit

socketio = SocketIO()

room = Blueprint(
    'room',
    __name__,
    template_folder="templates",
    static_folder="static",
)

@room.route("/room")
def index():
    return render_template("room.html")

@socketio.on("connect", namespace="/socket")
def connect():
    emit('rw', {'data': 'connected'})

@socketio.on("broad", namespace="/socket")
def rw(msg):
    if not msg:
        msg = {'data': 'readwrite broaded'}
    emit("rw", msg, broadcast=True)
