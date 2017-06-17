#!/usr/bin/env python
# -*- coding: utf-8 -*-
from perfectday import controllers as c, models as m
import datetime as dt
import random


daily = 1
eod = 2
tridaily = 3

weekly = 7

weeks = 7


def populate_db():
    # Metadata (basically for translating datetime into int_date)
    md = c.Metadata.get_or_create()
    md.start_date = c.dt_today() - dt.timedelta(days=365)

    # User
    u = c.User.get_or_create(name='kitb', password='asdf', created=0)

    now = md.now

    start1 = 0
    start2 = now - weeks * 26
    start3 = now - weeks * 10

    # Habit one
    h = c.Habit.create(user=u, short='Brush teeth')
    c.Regular.create(habit=h,
                     start=start1,
                     period=weekly,
                     stop=start2,
                     weight=1)
    c.Regular.create(habit=h,
                     start=start2,
                     period=eod,
                     stop=start3,
                     weight=1)
    c.Regular.create(habit=h,
                     start=start3,
                     period=daily,
                     weight=2)

    # Habit two
    h2 = c.Habit.create(user=u, short='Huel morning')

    c.Regular.create(habit=h2,
                     start=start1,
                     period=daily,
                     weight=1)

    def maybe_gen(habit, when):
        r = random.random()
        doing = r < 0.8
        print(f'{habit.short} on {when}? r={r:.2f}, doing: {doing}')
        if doing:
            c.Action.create(habit=habit, when=when)

    # Generate actions
    for x in range(365 + 1):
        maybe_gen(habit=h2, when=x)
        if x < start2:
            if (x % weekly) == 0:
                maybe_gen(habit=h, when=x)
        elif x < start3:
            if ((x - start2) % eod) == 0:
                maybe_gen(habit=h, when=x)
        else:
            maybe_gen(habit=h, when=x)
        print('=' * 40)

    # Add some rewards
    r1 = c.Reward.create(user=u,
                         short='MtG Booster Pack')

    c.RewardEpoch.create(reward=r1,
                         when=dt.datetime.now() - dt.timedelta(days=2),
                         cost=3)

    c.RewardEpoch.create(reward=r1,
                         when=md.start_date,
                         cost=1)

    r2 = c.Reward.create(user=u,
                         short='A fiver')
    c.RewardEpoch.create(reward=r2,
                         when=md.start_date,
                         cost=1)

    r3 = c.Reward.create(user=u,
                         short='A takeaway')
    c.RewardEpoch.create(reward=r3,
                         when=md.start_date,
                         cost=5)

    rs = [r1, r2, r3]

    for x in range(365 + 1):
        if random.random() < 0.2:
            r = random.choice(rs)
            date = md.int_date_to_dt(x)
            print(f'Purchasing {r.short} on {x}')
            c.Purchase.create(reward=r,
                              when=date)

    m.db.commit()


if __name__ == '__main__':
    m.main()
    with m.session:
        populate_db()
