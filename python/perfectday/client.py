#!/usr/bin/env python
# -*- coding: utf-8 -*-

from perfectday import model, transit_pb2


class GRPCStore(model.BaseStore):
    def __init__(self, channel):
        self._stub = transit_pb2.StorageServiceStub(channel)

    def read_user(self, user_id):
        response = self._stub.get_user(transit_pb2.GetUserRequest(user_id=user_id))
        return response.user

    def update_user(self, proto):
        self._stub.update_user(transit_pb2.UpdateUserRequest(user=proto))

    def create_user(self):
        response = self._stub.create_user(transit_pb2.CreateUserRequest())
        return response.user

    def delete_user(self):
        pass

    def create_regular_moment(self, user_id):
        pass

    def update_regular_moment(self, user_id, regular):
        pass

    def read_regular_moment(self):
        pass

    def delete_regular_moment(self):
        pass
