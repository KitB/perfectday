import datetime

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from perfectday.api import utils


class Person(models.Model):
    user = models.OneToOneField(User, related_name='person', on_delete=models.CASCADE)

    @property
    def worth(self):
        return self.calculate_worth_at_day(utils.int_now() - 1)

    @property
    def caching_habits(self):
        try:
            return self._cache_habits
        except AttributeError:
            self._cache_habits = self.habits.all()
            return self._cache_habits

    @property
    def caching_rewards(self):
        try:
            return self._cache_rewards
        except AttributeError:
            self._cache_rewards = self.rewards.all()
            return self._cache_rewards

    def clear_cache(self):
        del self._cache_habits
        del self._cache_rewards

    @property
    def int_start(self):
        return utils.int_date(self.user.date_joined)

    def calculate_worth_at_day(self, day):
        return sum(self.calculate_worths_to(day))

    def calculate_worths_to(self, day):
        return (self.calculate_day_worth_delta(d) for d in range(self.int_start, day + 1))

    # TODO: all kinds of optimization on the frankly naive worth calculation algorithm
    def calculate_day_worth_delta(self, day):
        """ Calculates the change in worth a day generated """
        relevant_habits = [habit for habit in self.caching_habits if day in habit.required_dates]
        happened_habits = [habit for habit in self.caching_habits
                           if day in habit.happened_dates & habit.required_dates]

        total_weight = sum(habit.get_weight_on(day) for habit in relevant_habits)
        happened_weight = sum(habit.get_weight_on(day) for habit in happened_habits)

        if total_weight != 0:
            final_worth = (happened_weight / total_weight)
        else:
            final_worth = 1.0

        day_cost = sum(p.cost for p in self.purchases_on(day))
        final_worth -= day_cost

        return final_worth

    def purchases_on(self, day):
        date = utils.dt_date(day)
        high = date + datetime.timedelta(days=1)
        yield from Purchase.objects.filter(when__gte=date, when__lt=high, reward__person=self)

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

    @property
    def required_dates(self):
        try:
            return self._required_dates
        except AttributeError:
            self._required_dates = set(date
                                       for s in self.schedules.all()
                                       for date in s.generate_dates())
            return self._required_dates

    @property
    def happened_dates(self):
        try:
            return self._happened_dates
        except AttributeError:
            self._happened_dates = set(action.when
                                       for action in self.actions.all())
            return self._happened_dates

    def get_schedule_on(self, day):
        for schedule in self.schedules.all():
            if schedule.start <= day < schedule.safe_stop:
                return schedule

    def get_weight_on(self, day):
        return self.get_schedule_on(day).weight

    def __str__(self):
        return f'({self.person}): {self.short_description}'


class Schedule(models.Model):
    habit = models.ForeignKey(Habit, related_name='schedules', on_delete=models.CASCADE)
    start = models.IntegerField()
    weight = models.IntegerField()
    stop = models.IntegerField(null=True, blank=True)

    @property
    def safe_stop(self):
        return self.stop if self.stop is not None else utils.int_now()

    def generate_dates(self):
        for period in self.periods.all():
            yield from period.dates

    def __str__(self):
        return f'Schedule for {self.habit}'


class Period(models.Model):
    schedule = models.ForeignKey(Schedule, related_name='periods', on_delete=models.CASCADE)
    start = models.IntegerField()
    period = models.IntegerField()

    @property
    def dates(self):
        d = self.schedule.start + self.start
        while d < self.schedule.safe_stop:
            yield d
            d += self.period

    def __str__(self):
        return f'Period for {self.schedule}'


class Action(models.Model):
    habit = models.ForeignKey(Habit, related_name='actions', on_delete=models.CASCADE)
    when = models.IntegerField()

    class Meta:
        unique_together = (('habit', 'when'))


class Reward(models.Model):
    person = models.ForeignKey(Person, related_name='rewards', on_delete=models.CASCADE)
    short_description = models.CharField(max_length=100)
    long_description = models.TextField(blank=True)

    @property
    def current_epoch(self):
        return self.epochs.order_by('-when')[0]

    def epoch_at(self, date):
        return self.epochs.order_by('-when').filter(when__lte=date)[0]

    @property
    def cost(self):
        return self.current_epoch.cost

    def cost_at(self, date):
        return self.epoch_at(date).cost

    def __str__(self):
        return f'Reward<person={self.person}, short_description={self.short_description}>'


class RewardEpoch(models.Model):
    reward = models.ForeignKey(Reward, related_name='epochs', on_delete=models.CASCADE)
    when = models.DateTimeField(default=timezone.now)
    cost = models.FloatField()

    def __str__(self):
        return f'RewardEpoch<reward={self.reward}, when={self.when}, cost={self.cost}>'


class Purchase(models.Model):
    reward = models.ForeignKey(Reward, related_name='purchases', on_delete=models.CASCADE)
    when = models.DateTimeField(default=timezone.now)

    @property
    def cost(self):
        return self.reward.cost_at(self.when)
