from django.contrib.auth.models import User, Group
from rest_framework import viewsets

from perfectday.api import models, serializers


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer


class PersonViewSet(viewsets.ModelViewSet):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer


class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.HabitSerializer
    queryset = models.Habit.objects.all()


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = models.Schedule.objects.all()
    serializer_class = serializers.ScheduleSerializer


class PeriodViewSet(viewsets.ModelViewSet):
    queryset = models.Period.objects.all()
    serializer_class = serializers.ScheduleSerializer


class ActionViewSet(viewsets.ModelViewSet):
    queryset = models.Action.objects.all()
    serializer_class = serializers.ActionSerializer
