#!/usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import datetime
from pony import orm

from . import _constants

db = orm.Database()
session = orm.db_session


# IMPORTANT: These are to be record classes only - all processing will be done with wrapper
# classes

# We store dates as integer days from an epoch
int_date = int


class Metadata(db.Entity):
    start_date = orm.Required(datetime)


# ==================================================================
# Auth and Identity
# ------------------------------------------------------------------
#
# Might split User into actual Auth and Identity parts at some point
#
# There would still be a "user" object, but it would likely just
# contain "created", Auth would be email/pass/tokens and point to it,
# Identity would be display name/habits/purchases and point to it.
#
# Pros:
#   + Maybe easier to allow other services to consume our data as an
#     api in future
#   + Maybe easier to refactor Auth out into separate database (for
#     to keep it safer)
#   + Actually is multiple meaningful entities
# Cons:
#   - More complicated code
#   - Three entities in a one-to-one-to-one relationship in a db.
#     Something about that feels wrong. (not a joke about
#     polyamorous relationships, genuinely about code)
# ==================================================================
class User(db.Entity):
    name = orm.PrimaryKey(str)
    password = orm.Required(str, 60)
    created = orm.Required(int_date)
    tokens = orm.Set('Token')
    habits = orm.Set('Habit')
    rewards = orm.Set('Reward')


class Token(db.Entity):
    user = orm.Required(User)
    slug = orm.Required(str, _constants.TOKEN_BYTES * 2)  # hex string
    expires = orm.Required(int_date)
# ==================================================================


# ===============================
# Habit-related records
# -------------------------------
#
# Things that earn the user pd
# ===============================
class Habit(db.Entity):
    """ Essentially exists to tie `Regular`s to each other properly. """
    user = orm.Required(User)
    regulars = orm.Set('Regular')
    short = orm.Required(str)
    long = orm.Optional(str)
    actions = orm.Set('Action')


class Regular(db.Entity):
    """ The important part of a habit.

    Distinct because it is mutable but needs to be stored immutably. """
    habit = orm.Required(Habit)
    start = orm.Required(int_date)
    period = orm.Required(int)  # int days
    stop = orm.Optional(int_date)
    weight = orm.Required(float)


class Action(db.Entity):
    """ Indicates that a user did the thing associated with a habit on a specified date. """
    habit = orm.Required(Habit)
    when = orm.Required(int_date)
# ===============================


# =====================================
# Spending records
# -------------------------------------
#
# Things the user can spend their pd on
# =====================================
class Reward(db.Entity):
    """ An item that can be purchased. """
    user = orm.Required(User)
    short = orm.Required(str)
    long = orm.Optional(str)
    epochs = orm.Set('RewardEpoch')
    purchases = orm.Set('Purchase')


class RewardEpoch(db.Entity):
    """ A particular moment in a Reward's history.

    So the user can change its value and we can still track how much they spent before they did.

    The current values of the reward are those stored in the epoch with the highest "when",
    easy to get out of a DB.
    """
    reward = orm.Required(Reward)

    # not int_date because the person might want to make the purchase immediately after
    when = orm.Required(datetime)
    orm.PrimaryKey(reward, when)

    cost = orm.Required(float)


class Purchase(db.Entity):
    reward = orm.Required(Reward)
    when = orm.Required(datetime)
# =====================================


def connect_sqlite(args):
    import os
    dbpath = args.database or 'pd.sqlite'
    # db.bind gets the wrong cwd if you aren't explicit about it
    path = os.path.join(os.getcwd(), dbpath)

    db.bind('sqlite', path, create_db=True)
    db.generate_mapping(create_tables=True)


def connect_pgsql(args):
    database = args.database or 'pd'
    db.bind('postgres',
            user=args.db_user,
            password=args.db_password,
            host=args.db_host,
            database=database)
    db.generate_mapping(create_tables=True)


provider_dispatch = {
    'postgres': connect_pgsql,
    'sqlite': connect_sqlite
}


def main(argv=None):
    import argparse
    import sys
    argv = argv or sys.argv[1:]
    ap = argparse.ArgumentParser()
    ap.add_argument('-D', '--db_provider', type=str, default='sqlite',
                    choices=provider_dispatch.keys())
    ap.add_argument('-d', '--database', type=str, default=None)
    ap.add_argument('-u', '--db-user', type=str, default='pd')
    ap.add_argument('-p', '--db-password', type=str, default='asdf')
    ap.add_argument('-H', '--db-host', type=str, default='localhost')
    args = ap.parse_args(argv)

    provider_dispatch[args.db_provider](args)


if __name__ == '__main__':
    main()
