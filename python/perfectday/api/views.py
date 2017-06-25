from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework_extensions.mixins import NestedViewSetMixin

from perfectday.api import models, serializers


class UserViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer


class GroupViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer


class HabitViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    serializer_class = serializers.HabitSerializer
    queryset = models.Habit.objects.all()


class ScheduleViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = models.Schedule.objects.all()
    serializer_class = serializers.ScheduleSerializer


class PeriodViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = models.Period.objects.all()
    serializer_class = serializers.ScheduleSerializer


class ActionViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = models.Action.objects.all()
    serializer_class = serializers.ActionSerializer
