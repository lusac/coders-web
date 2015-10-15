import uuid

from flask import Blueprint, render_template, redirect, session
from flask.ext.socketio import SocketIO, emit
from flask import current_app

socketio = SocketIO()

room = Blueprint(
    'room',
    __name__,
    template_folder="templates",
    static_folder="static",
)


@room.route("/room/<string:uuid>")
def index(uuid):
    cache = current_app.redis
    if not cache.get(uuid):
        # return 404
        pass
    content = cache.get('%s:content' % uuid)
    return render_template("room.html", room_uuid=uuid, content=content)


@room.route("/room/create")
def create():
    room_uuid = uuid.uuid4().hex

    session['room'] = room_uuid

    cache = current_app.redis
    cache.set(room_uuid, '')
    return redirect("/room/%s" % room_uuid)


@socketio.on("connect", namespace="/socket")
def connect():
    emit('conn', {'data': 'connected'})


@socketio.on("broad", namespace="/socket")
def rw(msg):
    uuid = session['room']
    cache = current_app.redis
    cache.set('%s:content' % uuid, msg['text'])
    if not msg:
        msg = {'data': 'readwrite broaded'}
    emit("rw", msg, broadcast=True)
