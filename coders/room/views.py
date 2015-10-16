import os
import uuid
import tarfile

from docker import Client

from flask import Blueprint, render_template, redirect, Response, session, current_app, request

IMAGE_NAME = os.getenv("IMAGE_NAME", None)
DOCKER_ADDRESS = os.getenv("DOCKER_ADDRESS", "192.168.50.4:2375")
RUNNERS = {
    "python": "python",
    "nodejs": "node",
    "ruby": "ruby",
}

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
    cache.set(room_uuid, '', 60 * 60 * 60 * 5)
    cache.set("%s:users" % room_uuid, 60 * 60 * 60 * 5)
    return redirect("/room/%s" % room_uuid)


@room.route("/room/run", methods=['POST'])
def run():
    code = request.form.get('code')
    runner = request.form.get('runner')

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
