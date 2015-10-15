import uuid

from flask import Blueprint, render_template, redirect
from flask.ext.socketio import SocketIO, emit

socketio = SocketIO()

room = Blueprint(
    'room',
    __name__,
    template_folder="templates",
    static_folder="static",
)


@room.route("/room/<string:uuid>")
def index(uuid):
    return render_template("room.html", room_uuid=uuid)


@room.route("/room/create")
def create():
    room_uuid = uuid.uuid4().hex
    return redirect("/room/%s" % room_uuid)


@socketio.on("connect", namespace="/socket")
def connect():
    emit('conn', {'data': 'connected'})


@socketio.on("broad", namespace="/socket")
def rw(msg):
    if not msg:
        msg = {'data': 'readwrite broaded'}
    emit("rw", msg, broadcast=True)
