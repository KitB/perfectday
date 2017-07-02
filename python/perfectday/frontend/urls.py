#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    url(r'^$', RedirectView.as_view(pattern_name='home', permanent=True)),
    url(r'^home/', views.index, name='home'),
    url(r'^.*$', views.index, name='index'),
]
