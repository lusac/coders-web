from flask.ext.socketio import SocketIO, emit, join_room
from flask import session, current_app

socketio = SocketIO()
CACHE_TIMEOUT = 60 * 60 * 60 * 4


@socketio.on('disconnect', namespace='/socket')
def test_disconnect():
    user = session.get('user')
    room = session.get('room')

    cache = current_app.redis

    total_user_cache_key = "%s:users" % room
    users = int(cache.get(total_user_cache_key))
    cache.set(total_user_cache_key, users - 1, CACHE_TIMEOUT)

    emit('user_out', {'msg': user}, broadcast=True, room=room)


@socketio.on("joined", namespace="/socket")
def joined(msg):
    room = session.get('room')
    user = session.get('user')

    cache = current_app.redis

    total_user_cache_key = "%s:users" % room
    users = int(cache.get(total_user_cache_key))
    cache.set(total_user_cache_key, users + 1, CACHE_TIMEOUT)

    join_room(room)
    emit('status', {'msg': 'connected room - ' + room}, room=room)
    emit('user_in', {'msg': user}, broadcast=True, room=room)


@socketio.on("connect", namespace="/socket")
def connect():
    emit('conn', {'data': 'connected'})


@socketio.on("broad", namespace="/socket")
def rw(msg):
    room = session.get('room')
    cache = current_app.redis
    cache.set('%s:content' % room, msg['text'], CACHE_TIMEOUT)

    if not msg:
        msg = {'data': 'readwrite broaded'}

    room = session.get('room')
    emit("rw", msg, broadcast=True, room=room)


@socketio.on("end_run", namespace="/socket")
def end_run(msg):
    room = session.get('room')
    emit("end_run", msg, broadcast=True, room=room)


@socketio.on("begin_run", namespace="/socket")
def begin_run():
    room = session.get('room')
    emit("begin_run", '', broadcast=True, room=room)


@socketio.on('language', namespace='/socket')
def language(msg):
    room = session.get('room')
    cache = current_app.redis
    cache.set("%s:language" % room, msg, CACHE_TIMEOUT)

    emit('language', msg, broadcast=True, room=room)
