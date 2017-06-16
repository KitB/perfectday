#!/usr/bin/env python
# -*- coding: utf-8 -*-
from perfectday import controllers as c, models as m
import datetime as dt

m.main()


daily = 1
eod = 2
tridaily = 3

weekly = 7

weeks = 7

m.session.__enter__()

md = c.Metadata.get_or_create()
md.start_date = c.dt_today() - dt.timedelta(days=365)
m.db.commit()

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
                      weight=1)

for x in range(365):
    if x < start2:
        if (x % weekly) == 0:
            c.Action.create(habit=h, when=x)
    elif x < start3:
        if ((x - start2) % eod) == 0:
            c.Action.create(habit=h, when=x)
    else:
        c.Action.create(habit=h, when=x)

m.db.commit()

habits = list(u.habits)

for h in habits:
    h.c_req_dates = h.required_dates()
    h.c_hap_dates = h.happened_dates()
