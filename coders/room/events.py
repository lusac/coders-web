from flask.ext.socketio import SocketIO, emit, join_room
from flask import session, current_app

socketio = SocketIO()


@socketio.on('disconnect', namespace='/socket')
def test_disconnect():
    user = session.get('user')
    room = session.get('room')

    cache = current_app.redis

    total_user_cache_key = "%s:users" % room
    users = int(cache.get(total_user_cache_key))
    cache.set(total_user_cache_key, users - 1, 60 * 60 * 60 * 4)

    emit('user_out', {'msg': user}, broadcast=True, room=room)


@socketio.on("joined", namespace="/socket")
def joined(msg):
    room = session.get('room')
    user = session.get('user')

    cache = current_app.redis

    total_user_cache_key = "%s:users" % room
    users = int(cache.get(total_user_cache_key))
    cache.set(total_user_cache_key, users + 1, 60 * 60 * 60 * 4)

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
    cache.set('%s:content' % room, msg['text'], 60 * 60 * 60 * 4)

    if not msg:
        msg = {'data': 'readwrite broaded'}

    room = session.get('room')
    emit("rw", msg, broadcast=True, room=room)


@socketio.on("run", namespace="/socket")
def output(msg):
    room = session.get('room')
    emit("run", msg, broadcast=True, room=room)


@socketio.on('language', namespace='/socket')
def language(msg):
    room = session.get('room')
    cache = current_app.redis
    cache.set("%s:language" % room, msg, 60 * 60 * 60 * 4)

    emit('language', msg, broadcast=True, room=room)
