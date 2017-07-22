#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.contrib.auth.models import User, Group

from rest_framework import serializers, fields

from perfectday.api import models
from perfectday.api import utils


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class PersonSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer()
    habits = serializers.HyperlinkedRelatedField(view_name='habit-detail',
                                                 many=True,
                                                 read_only=True)

    class Meta:
        model = models.Person
        fields = ('id', 'url', 'user', 'worth', 'habits')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class PeriodSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Period
        fields = ('start', 'period')


class ScheduleSerializer(serializers.HyperlinkedModelSerializer):
    periods = PeriodSerializer(many=True)

    class Meta:
        model = models.Schedule
        fields = ('weight', 'start', 'stop', 'periods')

    def run_validation(self, data=fields.empty):
        if data['start'] == '':
            data['start'] = utils.int_now()
        return super(ScheduleSerializer, self).run_validation(data)


class HabitSerializer(serializers.HyperlinkedModelSerializer):
    schedule = ScheduleSerializer()
    happened_today = serializers.BooleanField(read_only=True)
    today_action_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Habit
        fields = ('id', 'url', 'person', 'short_description', 'long_description', 'schedule',
                  'happened_today', 'today_action_id')

    def create(self, validated_data):
        schedule_data = validated_data.pop('schedule')
        periods_data = schedule_data.pop('periods')
        if periods_data == []:
            periods_data = [{'start': 0, 'period': 1}]  # default to daily

        habit = models.Habit.objects.create(**validated_data)

        if schedule_data['start'] == 0:
            schedule_data['start'] = utils.int_now()

        schedule = models.Schedule.objects.create(habit=habit, **schedule_data)

        for period_data in periods_data:
            models.Period.objects.create(schedule=schedule, **period_data)
        return habit

    def update(self, habit, validated_data):
        schedule_data = validated_data.pop('schedule')
        periods_data = schedule_data.pop('periods')

        old_schedule = habit.schedule
        if old_schedule is not None:
            old_schedule.stop = utils.int_now()
            old_schedule.save()

        if schedule_data['start'] == 0:
            schedule_data['start'] = utils.int_now()

        schedule = models.Schedule.objects.create(habit=habit, **schedule_data)

        for period_data in periods_data:
            models.Period.objects.create(schedule=schedule, **period_data).save()

        schedule.save()

        habit.short_description = validated_data.get('short_description', habit.short_description)
        habit.long_description = validated_data.get('long_description', habit.long_description)
        habit.save()

        return habit


class ActionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Action
        fields = ('url', 'habit', 'when')

    def validate_when(self, value):
        if value <= 0:  # you can't do shit on day zero now, soz
            value += utils.int_now()
        return value


class EpochSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.RewardEpoch
        fields = ('cost',)


class RewardSerializer(serializers.HyperlinkedModelSerializer):
    current_epoch = EpochSerializer()

    class Meta:
        model = models.Reward
        fields = ('url', 'person', 'short_description', 'long_description', 'current_epoch')

    def create(self, validated_data):
        epoch_data = validated_data.pop('current_epoch')
        reward = models.Reward.objects.create(**validated_data)
        models.RewardEpoch.objects.create(reward=reward, **epoch_data)
        return reward

    # TODO: make this and habit.update not create new epochs unnecessarily
    def update(self, reward, validated_data):
        epoch_data = validated_data.pop('current_epoch')
        models.RewardEpoch.objects.create(reward=reward, **epoch_data)

        reward.short_description = validated_data.get('short_description', reward.short_description)
        reward.long_description = validated_data.get('long_description', reward.long_description)
        return reward


class PurchaseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Purchase
        fields = ('url', 'reward', 'when')
