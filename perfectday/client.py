#!/usr/bin/env python
# -*- coding: utf-8 -*-

from perfectday import model, transit_pb2


class GRPCStore(model.BaseStore):
    def __init__(self, channel):
        self._stub = transit_pb2.StorageServiceStub(channel)

    def read_user(self, user_id):
        response = self._stub.get_user(transit_pb2.UserRequest(user_id=user_id))
        return response.user

    def write_user(self, proto):
        self._stub.update_user(proto)

    def create_user(self):
        self._stub.create_user(transit_pb2.CreateUserRequest())
