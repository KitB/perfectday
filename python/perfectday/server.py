#!/usr/bin/env python
# -*- coding: utf-8 -*-


from concurrent import futures
from os import path
import uuid

import grpc

from perfectday import model, model_pb2, transit_pb2, _pathgen


@_pathgen.pathgen
class _PathsBase(object):
    _USERS_BASE_PATH = 'users'
    _USER_BASE_PATH = path.join(_USERS_BASE_PATH, '{user_id}')
    _USER_PROTO_PATH = path.join(_USER_BASE_PATH, 'user.pb')
    _USER_META_PATH = path.join(_USER_BASE_PATH, 'meta.pb')
    _REGULARS_BASE_PATH = path.join(_USER_BASE_PATH, 'regulars')
    _REGULAR_BASE_PATH = path.join(_REGULARS_BASE_PATH, '{regular_id}')
    _REGULAR_PROTO_PATH = path.join(_REGULARS_BASE_PATH, '{seconds}_{nanos}.pb')


class FileStore(model.BaseStore, _PathsBase):
    """ Read and write protobufs to/from disk.

    This is expected to be the ultimate storage location for things.
    """

    def __init__(self, base_dir):
        self._base_dir = base_dir
        self.ensure()

    def ensure(self):
        FileStore.ensure_directory(self._base_dir)
        self._ensure_users_base()

    def _prepare_user_dir(self, user_id):
        self._ensure_user_base(user_id)

    # ===============================
    # abstract method implementations
    # ===============================
    def read_user(self, user_id):
        user_proto = model_pb2.User()
        with self._read_user_proto(user_id) as pb:
            user_proto.ParseFromString(pb.read())
        return user_proto

    def update_user(self, proto):
        with self._update_user_proto(proto.id) as pb:
            pb.write(proto.SerializeToString())

    def create_user(self):
        proto = model_pb2.User()

        # TODO: Make sure this user doesn't already exist
        proto.id = uuid.uuid4().hex

        self._prepare_user_dir(proto.id)

        with self._create_user_proto(proto.id) as pb:
            pb.write(proto.SerializeToString())
        return proto

    def delete_user(self, user_id):
        self._delete_user_proto(user_id)

    def create_regular_moment(self, user_id):
        user = self.read_user(self, user_id)
        regular = user.regulars.add()
        regular.id = 1  # TODO: generate ids for regulars

        self.write_regular(user_id, regular)
        return regular

    def update_regular_moment(self, user_id, regular):
        pass

    def read_regular_moment(self):
        pass

    def delete_regular_moment(self):
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
