#!/usr/bin/env python
# -*- coding: utf-8 -*-
import datetime as dt
from . import models


def clean_date(dat):
    return dt.datetime(*dat.timetuple()[:3])


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
        kwargs = _controllers_to_models(kwargs)
        kwargs = clean_dates(kwargs)
        m = cls.model(**kwargs)
        return cls(m)

    @classmethod
    def get(cls, **kwargs):
        kwargs = _controllers_to_models(kwargs)
        kwargs = clean_dates(kwargs)
        m = cls.model.get(**kwargs)
        if m is None:
            raise ValueError  # TODO: replace with some kind of NotFoundError
        return cls(m)

    @classmethod
    def get_or_create(cls, **kwargs):
        kwargs = _controllers_to_models(kwargs)
        kwargs = clean_dates(kwargs)
        pk_arg_names = [at.name for at in cls.model._pk_attrs_]
        pk_args = {name: kwargs[name] for name in pk_arg_names}
        m = cls.model.get(**pk_args)
        if m is None:
            m = cls.model(**kwargs)

        return cls(m)

    def __init__(self, model):
        if model is None:
            raise ValueError('Cannot initialise controllers without model objects')
        self._model = model

    def _as_dict(self):
        return {attr.name: getattr(self._model, attr.name) for attr in self.model._attrs_with_columns_}

    def __repr__(self):
        return f'{self.__class__.__name__}{self._as_dict()}'


def _controllers_to_models(some_dict):
    """ Find any controller instances in the given dict and pull out their model instances. """
    def convert(thing):
        if isinstance(thing, Controller):
            return thing._model
        return thing

    return {key: convert(val) for (key, val) in some_dict.items()}


class User(Controller):
    model = models.User

    @property
    def habits(self):
        for h in self._model.habits:
            yield Habit(h)

    def calculate_worth(self):
        for habit in self.habits:
            pass


class Token(Controller):
    model = models.Token


class Habit(Controller):
    model = models.Habit

    @property
    def regulars(self):
        for r in self._model.regulars:
            yield Regular(r)

    @property
    def actions(self):
        for a in self._model.actions:
            yield Action(a)

    def required_dates(self):
        return set(date for r in self.regulars for date in r.generate_dates())

    def happened_dates(self):
        return set(action.when for action in self.actions)


class Regular(Controller):
    model = models.Regular

    @property
    def stop(self):
        default = dt.datetime.today()
        try:
            return self._model.stop or default
        except AttributeError:
            return default

    def generate_dates(self):
        d = self._model.start
        while d < self.stop:
            yield d
            d += self._model.period


class Action(Controller):
    model = models.Action


def main():
    pass


if __name__ == '__main__':
    main()
