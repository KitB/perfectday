#!/usr/bin/env python
# -*- coding: utf-8 -*-


import os
from concurrent import futures
from os import path
import uuid

import grpc

from perfectday import model, model_pb2, storage_pb2, transit_pb2


class FileStore(model.BaseStore):
    """ Read and write protobufs to/from disk.

    This is expected to be the ultimate storage location for things.
    """

    # ===============================================================================#
    # Directory definitions                                                          #
    # -------------------------------------------------------------------------------#
    # The _UPPERCASE_THING strings are all relative to whatever basedir is           #
    # ultimately set by the user.                                                    #
    #                                                                                #
    # The _lowercase_thing properties will all have the basedir included             #
    #                                                                                #
    # Both sets include template strings so you'll need to use _thing.format(...) on #
    # them in order to get useful results.                                           #
    #                                                                                #
    # Things you might need to pass into _thing.format, and the protobuf messages    #
    # you might find them in:                                                        #
    #                                                                                #
    #     user_id: pd.model.User.id                                                  #
    #     regular_id: pd.model.Regular.id                                            #
    #     seconds: pd.storage.RegularMoment.timestamp.seconds                        #
    #     nanos: pd.storage.RegularMoment.timestamp.nanos                            #
    #                                                                                #
    #                                                                                #
    # Except now we also have all the _get_thing methods, which take the necessary   #
    # args and return the appropriate string. I sure would love to find a way to     #
    # autogenerate these.                                                            #
    # ===============================================================================#
    # -------------------------------------------------------------------------------#
    # The directory where we keep all the user directories                           #
    # e.g. /var/lib/pd/users                                                         #
    # -------------------------------------------------------------------------------#
    _USERS_BASE = 'users'                                                            #

    @property                                                                        #
    def _users_base(self):                                                           #
        return path.join(self.basedir, self._USERS_BASE)                             #

    # -------------------------------------------------------------------------------#
    # The directory for a specific user                                              #
    # e.g. /var/lib/pd/users/5791ec0                                                 #
    # -------------------------------------------------------------------------------#
    _USER_BASE = path.join(_USERS_BASE, '{user_id}')                                 #

    @property                                                                        #
    def _user_base(self):                                                            #
        """ You'll still need to run .format on this """                             #
        return path.join(self.basedir, self._USER_BASE)                              #

    def _get_user_base(self, user_id):                                               #
        return self._user_base.format(locals())                                      #

    # -------------------------------------------------------------------------------#
    # The main protobuf for a specific user                                          #
    # e.g. /var/lib/pd/users/5791ec0/user.pb                                         #
    # -------------------------------------------------------------------------------#
    _USER_PROTO = path.join(_USER_BASE, 'user.pb')                                   #

    @property                                                                        #
    def _user_proto(self):                                                           #
        return path.join(self.basedir, self._USER_PROTO)                             #

    def _get_user_proto(self, user_id):                                              #
        return self._user_proto.format(locals())                                     #

    # -------------------------------------------------------------------------------#
    # The main protobuf for a specific user                                          #
    # e.g. /var/lib/pd/users/5791ec0/user.pb                                         #
    # -------------------------------------------------------------------------------#
    _USER_META_PROTO = path.join(_USER_BASE, 'meta.pb')

    @property
    def _user_meta_proto(self):
        return path.join(self.basedir, self._USER_META_PROTO)

    def _get_user_meta_proto(self, user_id):
        return self._user_meta_proto.format(locals())
    # -------------------------------------------------------------------------------#
    # The directory for regulars for a particular user                               #
    # e.g. /var/lib/pd/users/5791ec0/regulars                                        #
    # -------------------------------------------------------------------------------#
    _REGULARS_BASE = path.join(_USER_BASE, 'regulars')                               #

    @property                                                                        #
    def _regulars_base(self):                                                        #
        return path.join(self.basedir, self._REGULARS_BASE)                          #

    def _get_regulars_base(self, user_id):                                           #
        return self._regulars_base.format(locals())                                  #

    # -------------------------------------------------------------------------------#
    # The directory for moments of a specific regular                                #
    # e.g. /var/lib/pd/users/5791ec0/regulars/1                                      #
    # -------------------------------------------------------------------------------#
    _REGULAR_BASE = path.join(_REGULARS_BASE, '{regular_id}')

    @property
    def _regular_base(self):
        return path.join(self.basedir, self._REGULAR_BASE)

    def _get_regular_base(self, user_id, regular_id):
        return self._regular_base.format(locals())

    # -------------------------------------------------------------------------------#
    # The protobuf file for a particular moment of a particular regular              #
    # e.g. /var/lib/pd/users/5791ec0/regulars/1/1470340963_453319000.pb              #
    # -------------------------------------------------------------------------------#
    _REGULAR_PROTO = path.join(_REGULARS_BASE, '{seconds}_{nanos}.pb')               #

    @property                                                                        #
    def _regular_proto(self):                                                        #
        return path.join(self.basedir, self._REGULAR_PROTO)                          #

    def _get_regular_proto(self, user_id, regular_id, seconds, nanos):               #
        return self._user_proto.format(locals())                                     #
    # -------------------------------------------------------------------------------#
    # ===============================================================================#
    # You're damn right I thought that was cute                                      ^
    # And yes, I do prefer this to docstrings, it makes the structure obvious

    @staticmethod
    def ensure_directory(directory_path):
        if not path.isdir(directory_path):
            if path.isfile(directory_path):
                os.remove(directory_path)
            os.mkdir(directory_path)

    def __init__(self, basedir):
        self.basedir = basedir
        self.ensure()

    def ensure(self):
        FileStore.ensure_directory(self.basedir)
        FileStore.ensure_directory(path.join(self.basedir, self._USERS_BASE))

    def _prepare_user_dir(self, user_id):
        """ Prepare the directory structure for a user and associated files to be stored in. """
        FileStore.ensure_directory(self._get_user_base(user_id))
        FileStore.ensure_directory(self._get_regular_base(user_id))
        # TODO: Ensure balances

    def _get_user_meta(self, user_id):
        user_meta = storage_pb2.UserMeta()
        with open(self._get_user_meta_proto(user_id), 'rb') as pb:
            user_meta.ParseFromString(pb.read())
        return user_meta

    def _write_user_meta(self, user_id, proto):
        with open(self._get_user_meta_proto(user_id), 'wb') as pb:
            pb.write(proto.SerializeToString())

    # ===============================
    # abstract method implementations
    # ===============================
    def read_user(self, user_id):
        user_proto = model_pb2.User()
        with open(self._get_user_proto(user_id), 'rb') as pb:
            user_proto.ParseFromString(pb.read())
        return user_proto

    def write_user(self, proto):
        with open(self._get_user_proto(proto.id), 'wb') as pb:
            pb.write(proto.SerializeToString())

    def create_user(self):
        proto = model_pb2.User()

        # TODO: Make sure this user doesn't already exist
        proto.id = uuid.uuid4().hex

        self._prepare_user_dir(proto.id)

        self.write_user(proto)
        return proto

    def create_regular(self, user_id):
        user = self.read_user(self, user_id)
        regular = user.regulars.add()
        regular.id = 1  # TODO: generate ids for regulars

        self.write_regular(user_id, regular)
        return regular

    def write_regular(self, user_id, regular):
        pass

    def read_regulars(self, user_id):
        pass


class StorageService(transit_pb2.BetaStorageServiceServicer):
    def get_user(self, request, context):
        user = model.User.from_id(request.user_id)
        return transit_pb2.GetUserResponse(user=user.proto)

    def create_user(self, request, context):
        user = model.User.create()
        return transit_pb2.CreateUserResponse(user=user.proto)

    def update_user(self, request, context):
        model.User(request.user).save()
        return transit_pb2.UpdateUserResponse()


def main():
    # Get the store ready
    store = FileStore('/home/kit/f')
    model.BaseStorable.set_store(store)

    # Prepare the server
    server = grpc.server(futures.ThreadPoolExecutor(20))
    transit_pb2.add_StorageServiceServicer_to_server(StorageService(), server)
    server.add_insecure_port('[::]:9051')
    server.start()

    # Busy wait
    import time
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("user exited")
        server.stop(0)

if __name__ == '__main__':
    main()
