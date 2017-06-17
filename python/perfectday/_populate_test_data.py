#!/usr/bin/env python
# -*- coding: utf-8 -*-
from perfectday import controllers as c, models as m
import datetime as dt


daily = 1
eod = 2
tridaily = 3

weekly = 7

weeks = 7


def populate_db():
    md = c.Metadata.get_or_create()
    md.start_date = c.dt_today() - dt.timedelta(days=365)

    u = c.User.get_or_create(name='kitb', password='asdf', created=0)
    h = c.Habit.create(user=u, short='Brush teeth')

    now = md.now

    start1 = 0
    start2 = now - weeks * 26
    start3 = now - weeks * 10

    r1 = c.Regular.create(habit=h,
                          start=start1,
                          period=weekly,
                          stop=start2,
                          weight=1)
    r2 = c.Regular.create(habit=h,
                          start=start2,
                          period=eod,
                          stop=start3,
                          weight=1)
    r3 = c.Regular.create(habit=h,
                          start=start3,
                          period=daily,
                          weight=2)

    h2 = c.Habit.create(user=u, short='Huel morning')

    r21 = c.Regular.create(habit=h2,
                           start=now - 7,
                           period=daily,
                           weight=1)

    for x in range(365):
        if x < start2:
            if (x % (weekly * 2)) == 0:
                c.Action.create(habit=h, when=x)
        elif x < start3:
            if ((x - start2) % eod) == 0:
                c.Action.create(habit=h, when=x)
        else:
            c.Action.create(habit=h, when=x)

    m.db.commit()

    return (md, u, [(h, [r1, r2, r3]), (h2, [r21])])
