#!/usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import datetime, timedelta
from pony import orm

from . import _constants

db = orm.Database()
session = orm.db_session


# IMPORTANT: These models are to be record classes only - all processing will be done with wrapper classes


class User(db.Entity):
    name = orm.PrimaryKey(str)
    password = orm.Required(str, 60)
    tokens = orm.Set('Token')
    habits = orm.Set('Habit')
    actions = orm.Set('Action')


class Token(db.Entity):
    user = orm.Required(User)
    slug = orm.Required(str, _constants.TOKEN_BYTES * 2)  # hex string
    expires = orm.Required(datetime)


class Habit(db.Entity):
    """ Essentially exists to tie `Regular`s to each other properly. """
    user = orm.Required(User)
    regulars = orm.Set('Regular')
    short = orm.Required(str)
    long = orm.Optional(str)
    actions = orm.Set('Action')


class Regular(db.Entity):
    """ The important part of a habit, distinct because it is mutable but needs to be stored immutably. """
    habit = orm.Required(Habit)
    start = orm.Required(datetime)
    period = orm.Required(timedelta)
    stop = orm.Optional(datetime)
    weight = orm.Required(float)


class Action(db.Entity):
    """ Indicates that a user did the thing associated with a habit on a specified date. """
    user = orm.Required(User)
    habit = orm.Required(Habit)
    when = orm.Required(datetime)


def connect_db(dbpath):
    import os
    path = os.path.join(os.getcwd(), dbpath)  # db.bind gets the wrong cwd if you aren't explicit about it

    db.bind('sqlite', path, create_db=True)
    db.generate_mapping(create_tables=True)


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('-d', '--database', type=str, default='pd.sqlite')
    args = ap.parse_args()

    connect_db(args.database)


if __name__ == '__main__':
    main()
