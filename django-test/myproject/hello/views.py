from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def index(request):
    return HttpResponse("hello! ,")

def sam(request):
    return HttpResponse("hello sam")

def david(request):
    return HttpResponse("hello david")

def greet(request, name):
    return HttpResponse(f"hello, {name.capitalize()}!")

