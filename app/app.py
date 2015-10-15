#! /usr/bin/env python
# encoding: utf-8

from flask import Flask, render_template
from flask.ext.socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("index.html")

if __name__ == '__main__':
    socketio.run(app)
