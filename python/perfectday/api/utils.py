#!/usr/bin/env python
# -*- coding: utf-8 -*-
import datetime

EPOCH = (2017, 1, 1)


def int_now():
    # epoch must be a sunday (for now)
    return int_date(datetime.datetime.now())  # suffers from a "year 5,881,506" problem


def int_date(dt):
    epoch = datetime.datetime(*EPOCH, tzinfo=dt.tzinfo)
    return (dt - epoch).days


def dt_date(int_date):
    epoch = datetime.datetime(*EPOCH)
    td = datetime.timedelta(days=int_date)
    return epoch + td
