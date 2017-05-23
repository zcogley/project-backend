from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^index/$', views.index, name='index'),
    url(r'^today/$', views.today, name='today'),
    url(r'^soon/$', views.soon, name='soon'),
    url(r'^done/$', views.done, name='done'),
    url(r'^add/$', views.add, name='add'),
    url(r'^delete/$', views.delete, name='delete'),
]
