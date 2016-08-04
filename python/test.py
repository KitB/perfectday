#!/usr/bin/env python
# -*- coding: utf-8 -*-

import grpc

from perfectday import client, model


def fill_test_user(proto):
    p = proto
    b = p.balance
    b.total_pd = 12.8
    b.available_pd = 3.4

    r = p.regulars.add()
    r.id = 1
    r.name = "Something"
    r.description = "Thingy thing thing"
    r.weight = 2

    r.schedule.inverted = False

    pa = r.schedule.pattern.add()
    pa.every = 1
    pa.starts.GetCurrentTime()

if __name__ == '__main__':
    import IPython
    channel = grpc.insecure_channel('localhost:9051')
    store = client.GRPCStore(channel)
    model.BaseStorable.set_store(store)

    IPython.embed()
