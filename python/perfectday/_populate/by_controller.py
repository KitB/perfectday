#!/usr/bin/env python
# -*- coding: utf-8 -*-
import datetime as dt
from .. import controllers as c, models as m, records as r  # noqa


def populate_db():
    md = c.init_metadata()
    md.start_date = m.dt_today() - dt.timedelta(days=365)

    global u
    u = c.User.create(name='kitb',
                      password='password')

    u.add_reward(short='MtG Booster Pack', cost=3)
    u.add_reward(short='Takeaway', cost=5)
    u.add_reward(short='a fiver', cost=1)


def main():
    r.main()
    r.session.__enter__()
    populate_db()


if __name__ == '__main__':
    main()
