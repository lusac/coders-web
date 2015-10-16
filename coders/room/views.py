import uuid
import tarfile
import os

from flask import Blueprint, render_template, redirect, Response, session
from flask import current_app
from flask.ext.socketio import SocketIO, emit, join_room

from docker import Client

IMAGE_NAME = os.getenv("IMAGE_NAME", None)
DOCKER_ADDRESS = os.getenv("DOCKER_ADDRESS", "192.168.50.4:2375")
RUNNERS = {
    "python": "python",
    "nodejs": "node",
    "ruby": "ruby",
}

socketio = SocketIO()

room = Blueprint(
    'room',
    __name__,
    template_folder="templates",
    static_folder="static",
)


@room.route("/room/<string:room_uuid>")
def index(room_uuid):
    cache = current_app.redis
    if not cache.get(room_uuid):
        # return 404
        pass

    session['room'] = room_uuid
    users = int(cache.get("%s:users" % room_uuid))

    content = cache.get('%s:content' % room_uuid) or ""
    return render_template("room.html",
                           room_uuid=room_uuid,
                           content=content,
                           users=users)


@room.route("/room/create")
def create():
    room_uuid = uuid.uuid4().hex

    cache = current_app.redis
    cache.set(room_uuid, '')
    cache.set("%s:users" % room_uuid, 0)
    return redirect("/room/%s" % room_uuid)


@room.route("/room/run", methods=['POST'])
def run(code, runner):
    if not code:
        return "you should send a code!", 500
    f = open("code", 'w')
    f.write(code)
    f.close()
    d = Client(base_url=DOCKER_ADDRESS)
    test_connection = d.ping()
    if test_connection != "OK":
        return "docker unavaileble", 500
    container = d.create_container(
        image=IMAGE_NAME,
        command="tail -f /dev/null",
        detach=True
    )
    response = d.start(container)
    with tarfile.open("code.tar.gz", "w:gz") as tar:
        tar.add(f.name, arcname=os.path.basename(f.name))
    t = open("code.tar.gz", "rb")
    works = d.put_archive(container=container["Id"], path="/root", data=t)
    t.close()
    if not works:
        return "Can't create file in container", 500
    run = RUNNERS.get(runner, None)
    if not run:
        return "Invalid runner", 500
    exe = d.exec_create(
        container=container['Id'],
        cmd="{0} /root/code".format(run)
    )
    gen = d.exec_start(exec_id=exe['Id'], stream=True)
    return Response(gen, mimetype="text/plain")

@socketio.on('disconnect', namespace='/socket')
def test_disconnect():
    user = session.get('user')
    room = session.get('room')

    cache = current_app.redis

    total_user_cache_key = "%s:users" % room
    users = int(cache.get(total_user_cache_key))
    cache.set(total_user_cache_key, users - 1)

    emit('user_out', {'msg': user}, broadcast=True, room=room)


@socketio.on("joined", namespace="/socket")
def joined(msg):
    room = session.get('room')
    user = session.get('user')

    cache = current_app.redis

    total_user_cache_key = "%s:users" % room
    users = int(cache.get(total_user_cache_key))
    cache.set(total_user_cache_key, users + 1)

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
    cache.set('%s:content' % room, msg['text'])

    if not msg:
        msg = {'data': 'readwrite broaded'}

    room = session.get('room')
    emit("rw", msg, broadcast=True, room=room)
