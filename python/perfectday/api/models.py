from django.db import models


class Habit(models.Model):
    user = models.ForeignKey('auth.User', related_name='habits')
    short_description = models.CharField(max_length=100)
    long_description = models.TextField(blank=True)


class Schedule(models.Model):
    habit = models.ForeignKey(Habit, related_name='schedules')
    weight = models.IntegerField()
    stop = models.IntegerField()


class Period(models.Model):
    schedule = models.ForeignKey(Schedule, related_name='periods')
    start = models.IntegerField()
    period = models.IntegerField()


class Action(models.Model):
    habit = models.ForeignKey(Habit, related_name='actions')
    when = models.IntegerField()

    class Meta:
        unique_together = (('habit', 'when'))
