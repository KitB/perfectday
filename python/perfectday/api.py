#!/usr/bin/env python
# -*- coding: utf-8 -*-
from urllib.parse import urljoin

from flask import request, url_for
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


def get_url(*args, **kwargs):
    return urljoin(request.host_url, url_for(*args, **kwargs))


def url_mod(d, *args, **kwargs):
    d['url'] = get_url(*args, id=d['id'], **kwargs)
    return d


user_prefix = '/user/<string:user_name>/'

habits_route = urljoin(user_prefix, 'habit/')
habit_route = urljoin(habits_route, '<int:id>/')
actions_route = urljoin(habit_route, 'action/')
action_route = urljoin(actions_route, '<int:when>')

rewards_route = urljoin(user_prefix, 'reward/')
reward_route = urljoin(rewards_route, '<int:id>/')
purchases_route = urljoin(reward_route, 'purchase/')


@app.route(f'{user_prefix}/', methods=['GET'])
def get_user(user_name):
    u = controllers.User.get(user_name)
    d = u.to_dict()

    d['habits'] = get_url('list_habits', user_name=user_name)
    d['rewards'] = get_url('list_rewards', user_name=user_name)

    return d


def make_serializer(target):
    # I am *positive* drf would do this for free
    def inner(obj):
        def f(d):
            return url_mod(d, target, user_name=obj.model.user.name)
        d = obj.to_dict()
        return f(d)
    return inner


# ====================================================
# Habit methods
# ====================================================
habit_serializer = make_serializer('get_habit')


@app.route(habits_route, methods=['GET'])
def list_habits(user_name):
    u = controllers.User.get(user_name)

    return [habit_serializer(habit) for habit in u.habits]


@app.route(habits_route, methods=['POST'])
def make_habit(user_name):
    u = controllers.User.get(user_name)
    return habit_serializer(u.add_habit(**request.data))


@app.route(habit_route, methods=['GET'])
def get_habit(user_name, id):
    u = controllers.User.get(user_name)
    return habit_serializer(u.get_habit(id=id))


@app.route(habit_route, methods=['PUT'])
def change_habit(user_name, id):
    u = controllers.User.get(user_name)
    habit = u.get_habit(id=id)
    for key, val in request.data.items():
        setattr(habit, key, val)
    return habit_serializer(habit)


# ----------------------------------------------------
# Actions
# ----------------------------------------------------
@app.route(actions_route, methods=['GET'])
def list_actions(user_name, id):
    u = controllers.User.get(user_name)
    habit = u.get_habit(id=id)
    return [a.to_dict() for a in habit.actions]


@app.route(actions_route, methods=['POST'])
def make_action(user_name, id):
    u = controllers.User.get(user_name)
    habit = u.get_habit(id=id)
    habit.perform()
    return {}


@app.route(action_route, methods=['GET'])
def get_action(user_name, id, when):
    u = controllers.User.get(user_name)
    habit = u.get_habit(id=id)
    action = habit.get_action(when)
    return action.to_dict()


@app.route(action_route, methods=['PUT'])
def put_action(user_name, id, when):
    u = controllers.User.get(user_name)
    habit = u.get_habit(id=id)
    action = habit.perform(when=when)
    return action.to_dict()
# ====================================================


# ====================================================
# Reward methods
# ====================================================
reward_serializer = make_serializer('get_reward')


@app.route(rewards_route, methods=['GET'])
def list_rewards(user_name):
    u = controllers.User.get(user_name)
    return [reward_serializer(reward) for reward in u.rewards]


@app.route(rewards_route, methods=['POST'])
def make_reward(user_name):
    u = controllers.User.get(user_name)
    return reward_serializer(u.add_reward(**request.data))


@app.route(reward_route, methods=['GET'])
def get_reward(user_name, id):
    u = controllers.User.get(user_name)
    return reward_serializer(u.get_reward(id=id))


@app.route(reward_route, methods=['PUT'])
def change_reward(user_name, id):
    u = controllers.User.get(user_name)
    reward = u.get_reward(id=id)
    for key, val in request.data.items():
        setattr(reward, key, val)
    return reward_serializer(reward)


# ----------------------------------------------------
# Purchasing
# ----------------------------------------------------
@app.route(purchases_route, methods=['GET'])
def get_purchases(user_name, id):
    u = controllers.User.get(user_name)
    reward = u.get_reward(id=id)
    return [purchase.to_dict() for purchase in reward.purchases]


@app.route(purchases_route, methods=['POST'])
def make_purchase(user_name, id):
    u = controllers.User.get(user_name)
    reward = u.get_reward(id=id)
    return reward.purchase().to_dict()
# ====================================================
