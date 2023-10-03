from django.urls import path

from . import views

app_name = "tasks" #it helps to differentiate it from other apps which app it is 
urlpatterns = [
    path("", views.index, name="index"),
    path("add", views.add, name="add")
]