from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from django.urls import reverse

from django import forms

class NewTaskForm(forms.Form):
    task = forms.CharField(label = "New Task") #for characters 
    # priority = forms.IntegerField(label ="Priority", min_value= 1, max_value= 5) #clietn side validation
# Create your views here.

tasks = []
def index(request):
    if "tasks" not in request.session:
        request.session["tasks"] = []
    return render(request, "tasks/index.html", {
        "tasks" : request.session["tasks"] # "tasks" is var in html
    })

def add(request):
    if request.method == "POST":
        form = NewTaskForm(request.POST)
        if form.is_valid():
            task = form.cleaned_data["task"]
            # tasks.append(task)
            request.session["tasks"] += [task]
            return HttpResponseRedirect(reverse("tasks:index"))
        else:
            return render(request, "tasks/add.html", {
                "form": form
            })
    return render(request, "tasks/add.html", {
        "form" : NewTaskForm()
    })