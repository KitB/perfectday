#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.conf.urls import url, include

from rest_framework import routers, documentation

from perfectday.api import views


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'people', views.PersonViewSet)
router.register(r'habits', views.HabitViewSet)
router.register(r'actions', views.ActionViewSet)
router.register(r'rewards', views.RewardViewSet)
router.register(r'purchases', views.PurchaseViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^docs/', documentation.include_docs_urls(title='PerfectDay API')),
]
