#!/usr/bin/env python
# -*- coding: utf-8 -*-
import datetime
import secrets

from . import auth, _constants, errors, models


def init_metadata():
    md = models.Metadata.get_or_create()
    return md


def int_now():
    return models.Metadata.get().now


class User:
    @classmethod
    def get(cls, name):
        return cls(models.User.get(name=name))

    @classmethod
    def create(cls, *, name, password):
        digest = auth.hash_pass(password)
        u = models.User.create(name=name,
                               password=digest,
                               created=int_now()
                               )
        return cls(u)

    @classmethod
    def login(cls, *, name, password):
        try:
            u = models.User.get(name=name)
        except errors.NoSuchRecordError:
            return auth.verify_pass('', None)  # simulates a delay to prevent timing attacks

        return cls(u).verify_login(password)

    @classmethod
    def get_from_token(cls, *, slug):
        token = models.Token.get_non_expired(slug)
        if token is None:
            return None
        return cls(token.user)

    def __init__(self, model):
        self.model = model

    @property
    def rewards(self):
        for reward in self.model.rewards:
            # Wheeeee indirection
            yield RewardController(reward)

    @property
    def habits(self):
        for habit in self.model.habits:
            yield Habit(habit)

    def get_worth(self):
        self.model.recache_dates()
        return self.model.calculate_worth()

    def add_reward(self, *, short, cost, long='', **kwargs):
        return RewardController.create(user=self.model,
                                       short=short,
                                       cost=cost,
                                       long=long,
                                       **kwargs)

    def get_reward(self, **kwargs):
        return RewardController.get(user=self.model, **kwargs)

    def add_habit(self, *, short, schedule, weight, long='', **kwargs):
        return Habit.create(user=self.model,
                            short=short,
                            schedule=schedule,
                            weight=weight,
                            long=long,
                            **kwargs)

    def get_habit(self, **kwargs):
        return Habit.get(user=self.model, **kwargs)

    def verify_login(self, password):
        auth_ok, maybe_new_digest = auth.verify_and_update(password, self.model.password)
        if not auth_ok:
            return False
        else:
            if maybe_new_digest:
                self.model.password = maybe_new_digest
            return True

    def make_token(self):
        slug = secrets.token_hex(_constants.TOKEN_BYTES)
        expires = datetime.datetime.now() + datetime.timedelta(days=31)
        return models.Token.create(user=self.model,
                                   slug=slug,
                                   expires=expires)

    def __repr__(self):
        return f'User {self.model.name}'

    def to_dict(self):
        return {'name': self.model.name,
                'worth': self.get_worth()}


class Schedule:
    @classmethod
    def from_regulars(cls, regulars):
        s = cls()
        for regular in regulars:
            s.add_period(regular.start, regular.period)
        return s

    @classmethod
    def from_dicts(cls, dicts):
        s = cls()
        for d in dicts:
            s.add_period(d['start'], d['period'])
        return s

    def __init__(self):
        self.periods = []

    def add_period(self, start, period):
        self.periods.append((start, period))

    def start_now(self):
        """ Adjust all periods to start relative to current date. """
        now = int_now()
        self.periods = [(start + now, period) for start, period in self.periods]

    def starting_now(self):
        """ Return a new schedule adjust to start relative to current date. """
        s = Schedule()
        for period in self.periods:
            s.add_period(*period)
        s.start_now()
        return s

    def add_weekdays(self, days):
        """ Convenience function for producing a schedule based on which days it occurs on. """
        for day in days:
            self.add_period(day, 7)

    def __repr__(self):
        lines = []
        lines.append('Schedule:')
        for start, period in self.periods:
            lines.append(f'\tEvery {period}th starting: {start}')

        return '\n'.join(lines)

    def to_dicts(self):
        return [{'start': start, 'period': period} for start, period in self.periods]


class Habit:
    @classmethod
    def create(cls, *, user, short, schedule, weight, long=''):
        h = models.Habit.create(user=user,
                                short=short,
                                long=long)
        h = cls(h)
        h._set_schedule_and_weight(schedule, weight)
        return h

    @classmethod
    def get(cls, **kwargs):
        return cls(models.Habit.get(**kwargs))

    def __init__(self, model):
        self.model = model

    def perform(self, when=None):
        if when is None:
            when = int_now()
        model = models.Action.get_or_create(habit=self.model,
                                            when=when)
        return ActionController(model)

    @property
    def actions(self):
        for action in self.model.actions:
            yield ActionController(action)

    def get_action(self, when):
        return ActionController.get(habit=self.model,
                                    when=when)

    @property
    def weight(self):
        # All current regulars should share the same weight
        return next(self.model.current_regulars).weight

    @weight.setter
    def weight(self, new_weight):
        schedule = self.schedule
        self._set_schedule_and_weight(schedule, new_weight)

    @property
    def schedule(self):
        return Schedule.from_regulars(self.model.current_regulars)

    @schedule.setter
    def schedule(self, new_schedule):
        weight = self.weight
        self._set_schedule_and_weight(new_schedule, weight)

    def _set_schedule_and_weight(self, schedule, weight):
        for regular in self.model.current_regulars:
            regular.stop_now()

        if isinstance(schedule, Schedule):
            schedule = schedule.to_dicts()

        if isinstance(schedule[0], dict):
            schedule = [(d['start'], d['period']) for d in schedule]

        for start, period in schedule:
            models.Regular.create(habit=self.model,
                                  start=start,
                                  period=period,
                                  weight=weight)

    def __repr__(self):
        return f'Habit: "{self.model.short}" with weight {self.weight:.1f}'

    def to_dict(self):
        return {
            'id': self.model.id,
            'short': self.model.short,
            'long': self.model.long,
            'schedule': self.schedule.to_dicts(),
            'weight': self.weight
        }


class RewardController:
    """ Represents a Reward and its most recent epoch.

    Will allow historical epoch access if I ever need it.
    """
    @classmethod
    def get(cls, **kwargs):
        return cls(models.RewardModel.get(**kwargs))

    @classmethod
    def create(cls, *, user, short, cost, long='', **kwargs):
        r = models.RewardModel.create(user=user,
                                      short=short,
                                      long=long,
                                      **kwargs)
        r = cls(r, None)
        r.cost = cost  # creates the first epoch
        return r

    def __init__(self, model, epoch='default'):
        self.model = model
        if epoch == 'default':
            self.epoch = model.current_epoch
        else:
            self.epoch = epoch

    def purchase(self):
        return PurchaseController.create(reward=self.model)

    @property
    def cost(self):
        return self.epoch.cost

    @cost.setter
    def cost(self, value):
        self.epoch = models.RewardEpoch.create(
            reward=self.model,
            when=datetime.datetime.now(),
            cost=value
        )

    @property
    def short_description(self):
        return self.model.short

    @short_description.setter
    def short_description(self, new_short):
        self.model.short = new_short

    @property
    def long_description(self):
        return self.model.long

    @long_description.setter
    def long_description(self, new_long):
        self.model.long = new_long

    @property
    def purchases(self):
        for purchase in self.model.purchases:
            yield PurchaseController(purchase)

    def __repr__(self):
        return f'Reward: "{self.short_description}", costing {self.cost}pd'

    def to_dict(self):
        return {
            'id': self.model.id,
            'short': self.short_description,
            'long': self.long_description,
            'cost': self.cost}


class PurchaseController:
    @classmethod
    def create(cls, *, reward):
        model = models.PurchaseModel.create(reward=reward,
                                            when=datetime.datetime.now())
        return cls(model)

    @classmethod
    def get(cls, **kwargs):
        model = models.PurchaseModel.get(**kwargs)
        return cls(model)

    @property
    def reward(self):
        return RewardController(self.model.reward)

    def __init__(self, model):
        self.model = model

    def to_dict(self):
        return {
            'id': self.model.id,
            'reward': self.reward.to_dict(),
            'when': self.model.when
        }


class ActionController:
    @classmethod
    def create(cls, *, habit, when):
        model = models.Action.create(habit=habit,
                                     when=when)
        return cls(model)

    @classmethod
    def get(cls, **kwargs):
        model = models.Action.get(**kwargs)
        return cls(model)

    def __init__(self, model):
        self.model = model

    def to_dict(self):
        return {
            'habit': self.model.habit.id,
            'when': self.model.when
        }

    def delete(self):
        return self.model.delete()


def main():
    pass


if __name__ == '__main__':
    main()
