"""perfectday URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

from rest_framework_extensions import routers

from perfectday.api import views


router = routers.ExtendedSimpleRouter()
u_router = router.register(r'users', views.UserViewSet, base_name='user')
h_router = u_router.register(r'habits',
                             views.HabitViewSet,
                             base_name='habit-detail',
                             parents_query_lookups=['user'])
# s_router = h_router.register(r'schedules',
#                              views.ScheduleViewSet,
#                              base_name='users-habits-schedule',
#                              parents_query_lookups=['schedule__user', 'habit'])
# router.register(r'groups', views.GroupViewSet)


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^accounts/', include('allauth.urls')),
]
