from django.contrib.auth.models import User, Group
from rest_framework import mixins, viewsets

from perfectday.api import models, serializers


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer


class PersonViewSet(mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

    def retrieve(self, request, pk=None):
        self.getting_current = pk == 'me'
        return super(PersonViewSet, self).retrieve(request, pk=None)

    def get_object(self):
        if self.getting_current:
            return self.request.user.person
        else:
            return super(PersonViewSet, self).get_object()


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


class RewardViewSet(viewsets.ModelViewSet):
    queryset = models.Reward.objects.all()
    serializer_class = serializers.RewardSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = models.Purchase.objects.all()
    serializer_class = serializers.PurchaseSerializer
    filter_fields = ('reward__person',)
