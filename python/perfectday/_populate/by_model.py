#!/usr/bin/env python
# -*- coding: utf-8 -*-
from perfectday import models as m, records as r
import datetime as dt
import random


daily = 1
eod = 2
tridaily = 3

weekly = 7

weeks = 7


def populate_db():
    # Metadata (basically for translating datetime into int_date)
    md = m.Metadata.get_or_create()
    md.start_date = m.dt_today() - dt.timedelta(days=365)

    # User
    u = m.User.get_or_create(name='kitb', password='asdf', created=0)

    now = md.now

    start1 = 0
    start2 = now - weeks * 26
    start3 = now - weeks * 10

    # Habit one
    h = m.Habit.create(user=u, short='Brush teeth')
    m.Regular.create(habit=h,
                     start=start1,
                     period=weekly,
                     stop=start2,
                     weight=1)
    m.Regular.create(habit=h,
                     start=start2,
                     period=eod,
                     stop=start3,
                     weight=1)
    m.Regular.create(habit=h,
                     start=start3,
                     period=daily,
                     weight=2)

    # Habit two
    h2 = m.Habit.create(user=u, short='Huel morning')

    m.Regular.create(habit=h2,
                     start=start1,
                     period=daily,
                     weight=1)

    def maybe_gen(habit, when):
        rng = random.random()
        doing = rng < 0.8
        print(f'{habit.short} on {when}? rng={rng:.2f}, doing: {doing}')
        if doing:
            m.Action.create(habit=habit, when=when)

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
    r1 = m.Reward.create(user=u,
                         short='MtG Booster Pack')

    m.RewardEpoch.create(reward=r1,
                         when=dt.datetime.now() - dt.timedelta(days=2),
                         cost=3)

    m.RewardEpoch.create(reward=r1,
                         when=md.start_date,
                         cost=1)

    r2 = m.Reward.create(user=u,
                         short='A fiver')
    m.RewardEpoch.create(reward=r2,
                         when=md.start_date,
                         cost=1)

    r3 = m.Reward.create(user=u,
                         short='A takeaway')
    m.RewardEpoch.create(reward=r3,
                         when=md.start_date,
                         cost=5)

    rs = [r1, r2, r3]

    for x in range(365 + 1):
        if random.random() < 0.2:
            reward = random.choice(rs)
            date = md.int_date_to_dt(x)
            print(f'Purchasing {reward.short} on {x}')
            m.Purchase.create(reward=reward,
                              when=date)

    r.db.commit()


if __name__ == '__main__':
    r.main()
    with r.session:
        populate_db()
