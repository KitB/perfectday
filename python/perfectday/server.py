#!/usr/bin/env python
# -*- coding: utf-8 -*-


from concurrent import futures
from os import path
import uuid

import grpc

from perfectday import model, history_pb2, model_pb2, storage_pb2, transit_pb2, _pathgen


@_pathgen.pathgen
class _PathsBase(object):
    _USERS_BASE_PATH = 'users'

    _USER_BASE_PATH = path.join(_USERS_BASE_PATH, '{user_id}')
    _USER_PROTO_PATH = path.join(_USER_BASE_PATH, 'user.pb')
    _USER_META_PATH = path.join(_USER_BASE_PATH, 'meta.pb')

    _REGULAR_MOMENTS_BASE_PATH = path.join(_USER_BASE_PATH, 'regular_moments')
    _REGULAR_MOMENTS_META_PATH = path.join(_REGULAR_MOMENTS_BASE_PATH, 'meta.pb')

    _REGULAR_MOMENT_BASE_PATH = path.join(_REGULAR_MOMENTS_BASE_PATH, '{regular_series}')
    _REGULAR_MOMENT_PROTO_PATH = path.join(_REGULAR_MOMENT_BASE_PATH, '{seconds}_{nanos}.pb')


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

    def _get_next_regular_series(self, user_id):
        # TODO: Make meta reading threadsafe
        with self._read_regulars_meta(user_id) as pb:
            regulars_meta = storage_pb2.RegularMeta.FromString(pb.read())
        last_series = regulars_meta.last_series

        next_series = last_series + 1
        regulars_meta.last_series = next_series

        with self._update_regulars_meta(self, user_id) as pb:
            pb.write(regulars_meta.SerializeToString())

        return next_series

    # ===============================
    # abstract method implementations
    # ===============================
    def read_user(self, user_id):
        user_proto = model_pb2.User()
        with self._read_user_proto(user_id) as pb:
            user_proto.ParseFromString(pb.read())
        return user_proto

    def update_user(self, proto):
        with self._update_user_proto(proto.uuid) as pb:
            pb.write(proto.SerializeToString())

    def create_user(self):
        proto = model_pb2.User()

        # TODO: Make sure this user doesn't already exist
        proto.uuid = uuid.uuid4().hex

        self._prepare_user_dir(proto.uuid)

        with self._create_user_proto(proto.uuid) as pb:
            pb.write(proto.SerializeToString())
        return proto

    def delete_user(self, user_id):
        self._delete_user_proto(user_id)

    def create_regular_moment(self, user_id, regular_series):
        # don't need to pass in timestamp, we're generating it here

        self._ensure_regular_moment_base(user_id, regular_series)

        regular_moment = history_pb2.RegularMoment()
        regular_moment.regular.series = regular_series
        regular_moment.timestamp.GetCurrentTime()

        seconds = regular_moment.timestamp.seconds
        nanos = regular_moment.timestamp.nanos

        with self._create_regular_moment_proto(user_id, regular_series, seconds, nanos) as pb:
            pb.write(regular_moment.SerializeToString())

        return regular_moment

    def update_regular_moment(self, user_id, proto):
        args = [
            user_id,
            proto.regular.series,
            proto.timestamp.seconds,
            proto.timestamp.nanos
        ]
        with self._update_regular_moment_proto(*args) as pb:
            pb.write(proto.SerializeToString())

    def read_regular_moment(self, user_id, series, timestamp):
        args = [
            user_id,
            series,
            timestamp.seconds,
            timestamp.nanos
        ]
        with self._read_regular_moment_proto(*args) as pb:
            return history_pb2.RegularMoment.FromString(pb.read())

    def delete_regular_moment(self, user_id, series, timestamp):
        args = [
            user_id,
            series,
            timestamp.seconds,
            timestamp.nanos
        ]
        self._delete_regular_moment_proto(*args)


class StorageService(transit_pb2.BetaStorageServiceServicer):
    def read_user(self, request, context):
        user = model.User.read(request.user_id)
        return transit_pb2.ReadUserResponse(user=user.proto)

    def create_user(self, request, context):
        user = model.User.create()
        return transit_pb2.CreateUserResponse(user=user.proto)

    def update_user(self, request, context):
        model.User(request.user).save()
        return transit_pb2.UpdateUserResponse()

    def read_regular_moment(self, request, context):
        regular_moment = model.RegularMoment.read(request.user_id, request.series, request.timestamp)
        return transit_pb2.ReadRegularMomentResponse(moment=regular_moment.proto)

    def create_regular_moment(self, request, context):
        regular_moment = model.RegularMoment.create(request.user_id, request.series)
        return transit_pb2.CreateRegularMomentResponse(moment=regular_moment.proto)

    def update_regular_moment(self, request, context):
        model.RegularMoment(request.moment).save()
        return transit_pb2.UpdateRegularMomentResponse()


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
