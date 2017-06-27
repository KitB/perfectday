from django.contrib import admin

from perfectday.api import models

admin.site.register(models.Habit)
admin.site.register(models.Schedule)
admin.site.register(models.Period)
admin.site.register(models.Action)
admin.site.register(models.Reward)
admin.site.register(models.RewardEpoch)
admin.site.register(models.Purchase)
