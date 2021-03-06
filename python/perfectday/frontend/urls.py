#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    url(r'^$', RedirectView.as_view(pattern_name='habits', permanent=True)),
    url(r'^home/habits', views.index, name='habits'),
    url(r'^.*$', views.index, name='index'),
]
