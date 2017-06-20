#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask_api import FlaskAPI

from . import controllers, config
from .records import db, session

app = FlaskAPI('perfectday')


db.bind(config.DB_PROVIDER, create_db=True, **config.DB_ARGS)
db.generate_mapping(create_tables=True)


@app.before_request
def open_db_session():
    session.__enter__()


@app.after_request
def close_db_session(_):
    session.__exit__()
    return _


@app.route('/user/<string:user_name>/', methods=['GET'])
def get_user(user_name):
    u = controllers.User.get(user_name)
    return u.to_dict()


@app.route('/user/<string:user_name>/habit/', methods=['GET'])
def list_habits(user_name):
    u = controllers.User.get(user_name)
    return [habit.to_dict() for habit in u.habits]


@app.route('/user/<string:user_name>/habit/<int:id>', methods=['GET'])
def get_habit(user_name, id):
    u = controllers.User.get(user_name)
    return u.get_habit(id=id).to_dict()
