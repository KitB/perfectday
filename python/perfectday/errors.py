#!/usr/bin/env python
# -*- coding: utf-8 -*-


class Error(Exception):
    """ Base class for errors in pd. """


class NoSuchRecordError(Error):
    """ It's as it sounds. """
