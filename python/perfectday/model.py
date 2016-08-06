#!/usr/bin/env python
# -*- coding: utf-8 -*-

import abc


# A "Store" object abstracts mechanisms for acquiring and writing protobufs
class BaseStore(object):
    __metaclass__ = abc.ABCMeta

    # =========================================================================
    # User CRUD
    # =========================================================================
    @abc.abstractmethod
    def create_user(self):
        """ Returns the created protobuf. """
        pass

    @abc.abstractmethod
    def read_user(self, user_id):
        """ Returns the protobuf for the given user. """
        pass

    @abc.abstractmethod
    def update_user(self, proto):
        """ Saves the given protobuf. """
        pass

    @abc.abstractmethod
    def delete_user(self, user_id):
        pass

    # =========================================================================
    # Regular Moment CRUD
    # =========================================================================
    @abc.abstractmethod
    def create_regular_moment(self, user_id):
        """ Must be creating a regular for a user, they can't exist without.

        Returns the created protobuf.
        """
        pass

    @abc.abstractmethod
    def read_regular_moment(self, regular_uuid):
        pass

    @abc.abstractmethod
    def update_regular_moment(self, regular_proto):
        """ Get the moment by regular_proto.uuid, merge in regular_proto, save """
        pass

    @abc.abstractmethod
    def delete_regular_moment(self, regular_uuid):
        pass


def _indent(s):
    return '\n'.join('    ' + line for line in str(s).splitlines())


class BaseStorable(object):
    @classmethod
    def set_store(cls, store):
        cls.store = store

    @property
    def proto(self):
        return self._proto

    def __init__(self, proto):
        self._proto = proto

    def save(self):
        self._write_method(self.proto)

    def __repr__(self):
        return '<{name}>\n{content}\n</{name}>'.format(name=self.__class__.__name__, content=_indent(self.proto))


class User(BaseStorable):
    @classmethod
    def from_id(cls, uid):
        user_proto = cls.store.read_user(uid)
        return cls(user_proto)

    @classmethod
    def create(cls):
        user_proto = cls.store.create_user()
        return cls(user_proto)

    @classmethod
    def _write_method(cls, proto):
        return cls.store.write_user(proto)


def main():
    pass

if __name__ == '__main__':
    main()
