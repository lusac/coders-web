# app/home/views.py

from flask import Blueprint, render_template

home = Blueprint(
    'home',
    __name__,
    template_folder='templates',
    static_folder='static'
)


@home.route('/')
def index():
    return render_template('home.html')


@home.route('/developers')
def developers():
    return render_template('developers.html')
