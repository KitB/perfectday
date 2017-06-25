from django.db import models
from django.contrib.auth.models import User


class Person(models.Model):
    user = models.OneToOneField(User, related_name='person', on_delete=models.CASCADE)

    @property
    def worth(self):
        return 100.0

    def __str__(self):
        return f'{self.user.username}'


def auto_create_person(sender, instance, created, **kwargs):
    if created:
        Person.objects.create(user=instance)


models.signals.post_save.connect(auto_create_person,
                                 sender=User,
                                 weak=False,
                                 dispatch_uid='models.auto_create_person')


class Habit(models.Model):
    person = models.ForeignKey(Person, related_name='habits', on_delete=models.CASCADE)
    short_description = models.CharField(max_length=100)
    long_description = models.TextField(blank=True)

    @property
    def schedule(self):
        return Schedule.objects.get(habit=self, stop__isnull=True)

    @property
    def weight(self):
        return self.schedule.weight

    def __str__(self):
        return f'({self.person}): {self.short_description}'


class Schedule(models.Model):
    habit = models.ForeignKey(Habit, related_name='schedules', on_delete=models.CASCADE)
    weight = models.IntegerField()
    stop = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f'Schedule for {self.habit}'


class Period(models.Model):
    schedule = models.ForeignKey(Schedule, related_name='periods', on_delete=models.CASCADE)
    start = models.IntegerField()
    period = models.IntegerField()

    def __str__(self):
        return f'Period for {self.schedule}'


class Action(models.Model):
    habit = models.ForeignKey(Habit, related_name='actions', on_delete=models.CASCADE)
    when = models.IntegerField()

    class Meta:
        unique_together = (('habit', 'when'))
