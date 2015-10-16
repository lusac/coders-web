import uuid

from flask import Blueprint, render_template, redirect, session
from flask.ext.socketio import SocketIO, emit, join_room
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

    session['room'] = uuid

    content = cache.get('%s:content' % uuid)
    return render_template("room.html", room_uuid=uuid, content=content)


@room.route("/room/create")
def create():
    room_uuid = uuid.uuid4().hex

    cache = current_app.redis
    cache.set(room_uuid, '')
    return redirect("/room/%s" % room_uuid)


# EVENTS


@socketio.on("joined", namespace="/socket")
def joined(msg):
    room = session.get('room')
    join_room(room)
    emit('status', {'msg': 'connected room - ' + room}, room=room)


@socketio.on("broad", namespace="/socket")
def rw(msg):
    room = session.get('room')
    cache = current_app.redis
    cache.set('%s:content' % room, msg['text'])

    if not msg:
        msg = {'data': 'readwrite broaded'}

    room = session.get('room')
    emit("rw", msg, broadcast=True, room=room)
