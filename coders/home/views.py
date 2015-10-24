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
    developers = [
        {
            'name': 'Brasil',
            'github': 'https://github.com/raphaabrasil',
            'image': 'img/developers/brasil.jpg',
        },
        {
            'name': 'Darlene',
            'github': 'https://github.com/darlenedms',
            'image': 'img/developers/darlene.jpg',
        },
        {
            'name': 'Hugo',
            'github': 'https://github.com/hugoantunes',
            'image': 'img/developers/hugo.jpg',
        },
        {
            'name': 'Lusac',
            'github': 'https://github.com/lusac/',
            'image': 'img/developers/lusac.jpg',
        },
        {
            'name': 'Tarsis',
            'github': 'https://github.com/tarsisazevedo',
            'image': 'img/developers/tarsis.jpg',
        },
    ]
    return render_template('developers.html', developers=developers)
