#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.contrib.auth.models import User, Group

from rest_framework import serializers

from perfectday.api.models import Habit, Schedule, Period, Person, Action


def int_now():
    import datetime
    # epoch must be a sunday (for now)
    epoch = datetime.datetime(2017, 1, 1)
    return (datetime.datetime.now() - epoch).days  # suffers from a "year 5,881,506" problem


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class PersonSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer()
    habits = serializers.HyperlinkedModelSerializer(many=True, read_only=True)

    class Meta:
        model = Person
        fields = ('url', 'user', 'worth', 'habits')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class PeriodSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Period
        fields = ('start', 'period')


class ScheduleSerializer(serializers.HyperlinkedModelSerializer):
    periods = PeriodSerializer(many=True)

    class Meta:
        model = Schedule
        fields = ('weight', 'stop', 'periods')


class HabitSerializer(serializers.HyperlinkedModelSerializer):
    schedule = ScheduleSerializer()

    class Meta:
        model = Habit
        fields = ('url', 'person', 'short_description', 'long_description', 'schedule')

    def create(self, validated_data):
        schedule_data = validated_data.pop('schedule')
        periods_data = schedule_data.pop('periods')

        habit = Habit.objects.create(**validated_data)

        schedule = Schedule.objects.create(habit=habit, **schedule_data)

        for period_data in periods_data:
            Period.objects.create(schedule=schedule, **period_data)
        return habit

    def update(self, habit, validated_data):
        schedule_data = validated_data.pop('schedule')
        periods_data = schedule_data.pop('periods')

        old_schedule = habit.schedule
        old_schedule.stop = int_now()

        schedule = Schedule.objects.create(habit=habit, **schedule_data)

        for period_data in periods_data:
            Period.objects.create(schedule=schedule, **period_data)

        return habit


class ActionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Action
