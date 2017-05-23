from django.shortcuts import render, get_list_or_404, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect

from .models import item

from . forms import itemForm

from json import dumps, loads

from django.core import serializers

def index(request):
    return render(request, 'todo/index.html')

def today(request):
    data = serializers.serialize('json', item.objects.all())
    return HttpResponse(data)

def add(request):
    if request.method == "POST":
        author = request.user
        title = request.POST['title']
        day = request.POST['day']
        item.objects.create(author=author, title=title, day=day)

        return HttpResponse('201')

    else:
        form = itemForm()
        return render(request, 'todo/add.html', {'form': form})

def delete(request):
    if request.method == "POST":
        if  request.POST['day'] == "Finito":
            finitos = item.objects.filter(day='done')
            finitos.delete()
            return HttpResponse('200')

        else:
            key = request.POST['key']
            to_delete = item.objects.get(pk=key)
            to_delete.delete()

            return HttpResponse('200')

    else:
        return HttpResponse('417')

def move(request):
    if request.method == "POST":
        key = request.POST['key']
        day = request.POST['day']
        to_update = item.objects.get(pk=key)
        to_update.day = day
        to_update.save()

        return HttpResponse('200')

    else:
        return HttpResponse('417')
