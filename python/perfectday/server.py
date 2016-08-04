#!/usr/bin/env python
# -*- coding: utf-8 -*-


import os
from concurrent import futures
from os import path
import uuid

import grpc

from perfectday import model, model_pb2, transit_pb2


class FileStore(model.BaseStore):
    """ Read and write protobufs to/from disk.

    This is expected to be the ultimate storage location for things.
    """
    _USERS_BASE = 'users'
    _USER_PROTO = 'user.pb'

    @staticmethod
    def ensure_directory(directory_path):
        if not path.isdir(directory_path):
            if path.isfile(directory_path):
                os.remove(directory_path)
            os.mkdir(directory_path)

    def __init__(self, basedir):
        self.basedir = basedir

        self._prepare_subdirs()
        self.ensure()

    def _prepare_subdirs(self):
        self.users_base = path.join(self.basedir, FileStore._USERS_BASE)

    def ensure(self):
        FileStore.ensure_directory(self.basedir)
        FileStore.ensure_directory(self.users_base)

    def _prepare_user_dir(self, uid):
        """ Prepare the directory structure for a user and associated files to be stored in. """
        userdir = path.join(self.users_base, str(uid))
        FileStore.ensure_directory(userdir)

    def _get_user_proto(self, uid):
        return path.join(self.users_base, str(uid), self._USER_PROTO)

    # ===============================
    # abstract method implementations
    # ===============================
    def read_user(self, uid):
        user_proto = model_pb2.User()
        with open(self._get_user_proto(uid), 'rb') as pb:
            user_proto.ParseFromString(pb.read())
        return user_proto

    def write_user(self, proto):
        # TODO: make sure this user *doesn't* exist already
        with open(self._get_user_proto(proto.id), 'wb') as pb:
            pb.write(proto.SerializeToString())

    def create_user(self):
        proto = model_pb2.User()
        proto.id = uuid.uuid4().hex

        self._prepare_user_dir(proto.id)

        self.write_user(proto)
        return proto


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
