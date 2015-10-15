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

@socketio.on("connect", namespace="/room/socket")
def connect():
    emit('conn', {'data': 'connected'})

@socketio.on("rw", namespace="/room/rw")
def rw():
    emit("rw", {'data': 'readwrite'}, broadcast=True)
