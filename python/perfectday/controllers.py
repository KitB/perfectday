#!/usr/bin/env python
# -*- coding: utf-8 -*-
import datetime as dt
from textwrap import dedent

from pony import orm

from . import records


def clean_date(dat):
    return dt.datetime(*dat.timetuple()[:3])


def dt_today():
    return clean_date(dt.datetime.now())


def clean_dates(kwargs):
    """ Cleans dates in a dict. """
    def _clean_date(thing):
        if isinstance(thing, dt.datetime):
            return clean_date(thing)
        return thing

    return {key: _clean_date(val) for key, val in kwargs.items()}


class Controller:
    @classmethod
    def create(cls, **kwargs):
        kwargs = _controllers_to_records(kwargs)
        r = cls.record(**kwargs)
        return cls(r)

    @classmethod
    def get(cls, **kwargs):
        kwargs = _controllers_to_records(kwargs)
        r = cls.record.get(**kwargs)
        if r is None:
            raise ValueError  # TODO: replace with some kind of NotFoundError
        return cls(r)

    @classmethod
    def get_or_create(cls, **kwargs):
        kwargs = _controllers_to_records(kwargs)
        pk_arg_names = [at.name for at in cls.record._pk_attrs_]
        pk_args = {name: kwargs[name] for name in pk_arg_names}
        r = cls.record.get(**pk_args)
        if r is None:
            r = cls.record(**kwargs)

        return cls(r)

    def __init__(self, record):
        if record is None:
            raise ValueError('Cannot initialise controllers without record objects')
        self._record = record

    def _as_dict(self):
        return {attr.name: getattr(self._record, attr.name)
                for attr in self.record._attrs_with_columns_}

    def __repr__(self):
        return f'{self.__class__.__name__}{self._as_dict()}'

    # automatic setters and getters for record values
    def __getattr__(self, name):
        if name in self._record._columns_:
            return getattr(self._record, name)
        else:
            raise AttributeError(f'{self.__class__.__name__} has no attribute {name}')

    def __setattr__(self, name, value):
        if name == '_record':
            object.__setattr__(self, name, value)
        elif name in self._record._columns_:
            setattr(self._record, name, value)
        else:
            object.__setattr__(self, name, value)


def _controllers_to_records(some_dict):
    """ Find any controller instances in the given dict and pull out their record instances. """
    def convert(thing):
        if isinstance(thing, Controller):
            return thing._record
        return thing

    return {key: convert(val) for (key, val) in some_dict.items()}


class Metadata(Controller):
    record = records.Metadata

    @classmethod
    def create(cls):
        raise NotImplementedError('Don\'t try to create the metadata, there can only be one')

    @classmethod
    def get(cls):
        return cls(records.Metadata[1])

    @classmethod
    def get_or_create(cls):
        try:
            return cls.get()
        except orm.ObjectNotFound:
            r = records.Metadata(start_date=dt_today())
            return cls(r)

    @property
    def now(self):
        return self.dt_to_int_date(dt_today())

    def int_date_to_dt(self, intd):
        return (self.start_date + dt.timedelta(days=intd))

    def dt_to_int_date(self, dt):
        return (dt - self.start_date).days


class User(Controller):
    record = records.User

    @property
    def habits(self):
        for h in self._record.habits:
            yield Habit(h)

    def recache_dates(self):
        self._cache_habits = list(self.habits)
        for habit in self._cache_habits:
            habit._cache_req_dates = habit.required_dates()
            habit._cache_hap_dates = habit.happened_dates()

    def calculate_worth(self):
        return self.calculate_worth_at_day(Metadata.get().now)

    def calculate_day_worth(self, day):
        """ Calculates the *change* in worth a day generated. """
        habits = self._cache_habits
        relevant_habits = [habit for habit in habits if day in habit._cache_req_dates]
        happened_habits = [habit for habit in habits
                           if day in habit._cache_hap_dates & habit._cache_req_dates]

        total_weight = sum([habit.get_weight_on(day) for habit in relevant_habits])
        happened_weight = sum([habit.get_weight_on(day) for habit in happened_habits])

        final_worth = 0

        day_cost = sum(p.calculate_cost() for p in self.get_day_purchases(day))

        if total_weight != 0:
            final_worth += (happened_weight / total_weight)
        else:
            final_worth += 1
        final_worth -= day_cost

        return final_worth

    def calculate_worth_at_day(self, day):
        return sum(self.calculate_worths_to(day))

    def calculate_worths_to(self, day):
        return (self.calculate_day_worth(d) for d in range(day + 1))

    def get_purchases(self):
        for p in orm.select(p for p in records.Purchase
                            if p.reward.user == self._record):
            yield Purchase(p)

    def get_day_purchases(self, int_date):
        dt_date = Metadata.get().int_date_to_dt(int_date)

        low = clean_date(dt_date)
        high = low + dt.timedelta(days=1)

        for p in orm.select(p for p in records.Purchase
                            if (p.reward.user == self._record)
                            and low <= p.when
                            and p.when < high):
            yield Purchase(p)

    def total_purchases(self):
        # TODO: Get someone who actually knows SQL to check this
        q = dedent("""\
        SELECT (SELECT E."cost" AS "cost"
                FROM Reward R, RewardEpoch E
                WHERE R."id"=E."reward"
                    AND E."when" <= P."when"
                    AND R."user" = $(self.name)
                ORDER BY E."when" DESC
                LIMIT 1)
        FROM Purchase P;
        """)
        out = sum(records.db.select(q))
        return out


class Token(Controller):
    record = records.Token


class Habit(Controller):
    record = records.Habit

    @property
    def regulars(self):
        for r in self._record.regulars:
            yield Regular(r)

    @property
    def actions(self):
        for a in self._record.actions:
            yield Action(a)

    def required_dates(self):
        return set(date for r in self.regulars for date in r.generate_dates())

    def happened_dates(self):
        return set(action.when for action in self.actions)

    def get_regular_on(self, day):
        for regular in self.regulars:
            if regular.start <= day < regular.stop:
                return regular

    def get_weight_on(self, day):
        return self.get_regular_on(day).weight


class Regular(Controller):
    record = records.Regular

    @property
    def stop(self):
        default = Metadata.get().now
        try:
            return self._record.stop or default
        except AttributeError:
            return default

    def generate_dates(self):
        d = self._record.start
        while d < self.stop:
            yield d
            d += self._record.period


class Action(Controller):
    record = records.Action


class Reward(Controller):
    record = records.Reward


class RewardEpoch(Controller):
    record = records.RewardEpoch

    @classmethod
    def for_purchase(cls, purchase):
        return cls.for_reward_when(purchase.reward, purchase.when)

    @classmethod
    def for_reward_when(cls, reward, when):
        epoch_query = orm.select(re
                                 for re in records.RewardEpoch
                                 if re.reward == reward and re.when <= when)
        epoch_record = epoch_query.order_by(orm.desc(records.RewardEpoch.when)).limit(1)[0]
        return cls(epoch_record)


class Purchase(Controller):
    record = records.Purchase

    def calculate_cost(self):
        epoch = RewardEpoch.for_purchase(self)
        return epoch.cost


def main():
    pass


if __name__ == '__main__':
    main()
