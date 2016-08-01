#!/usr/bin/env python
# -*- coding: utf-8 -*-

import grpc

from perfectday import client, model

channel = grpc.insecure_channel('localhost:9051')
store = client.GRPCStore(channel)
model.BaseStorable.set_store(store)
