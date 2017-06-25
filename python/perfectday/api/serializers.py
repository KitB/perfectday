#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.contrib.auth.models import User, Group

from rest_framework import serializers

from perfectday.api.models import Habit, Schedule, Period, Action


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class HabitSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Habit
        fields = ('short_description',)


class ScheduleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Schedule


class PeriodSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Period


class ActionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Action
