#!/usr/bin/env python
# -*- coding: utf-8 -*-

from perfectday import model, transit_pb2


class GRPCStore(model.BaseStore):
    def __init__(self, channel):
        self._stub = transit_pb2.StorageServiceStub(channel)

    # ==============================================
    def create_user(self):
        response = self._stub.create_user(transit_pb2.CreateUserRequest())
        return response.user

    def read_user(self, user_id):
        response = self._stub.read_user(transit_pb2.ReadUserRequest(user_id=user_id))
        return response.user

    def update_user(self, proto):
        self._stub.update_user(transit_pb2.UpdateUserRequest(user=proto))

    def delete_user(self):
        pass

    # ==============================================
    def create_regular_moment(self, user_id, series):
        response = self._stub.create_regular_moment(transit_pb2.CreateRegularMomentRequest(
            user_id=user_id,
            series=series
        ))
        return response.moment

    def read_regular_moment(self, user_id, series, timestamp):
        response = self._stub.read_regular_moment(transit_pb2.ReadRegularMomentRequest(
            user_id=user_id,
            series=series,
            timestamp=timestamp
        ))
        return response.moment

    def update_regular_moment(self, user_id, proto):
        self._stub.update_regular_moment(transit_pb2.UpdateRegularMomentRequest(
            user_id=user_id,
            moment=proto
        ))

    def delete_regular_moment(self, user_id, series, timestamp):
        pass
