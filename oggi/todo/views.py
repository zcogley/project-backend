from django.shortcuts import render, get_list_or_404, redirect
from django.http import HttpResponse, JsonResponse

from .models import item

from . forms import itemForm

from json import dumps, loads

from django.core import serializers

def index(request):
    return render(request, 'todo/index.html')

def today(request):
    # today_item_db = get_list_or_404(item, day="today")
    # if today_item_db:
    #     today_item_list = []
    #     for thing in today_item_db:
    #         today_item_list.append(str(thing) + ', ')
    # return HttpResponse(today_item_list)
    data = serializers.serialize('json', item.objects.all())
    return HttpResponse(data)

def soon(request):
    soon_item_db = get_list_or_404(item, day="soon")
    return HttpResponse(soon_item_db)

def done(request):
    done_item_db = get_list_or_404(item, day="done")
    return HttpResponse(done_item_db)

def add(request):
    if request.method == "POST":
        # form = itemForm(request.POST)
        # if form.is_valid():
        #     item = form.save(commit=False)
        #     item.author = request.user
        #     item.save()
        #     return redirect('add')



        # obj = serializers.deserialize('json', data, ignorenonexistent=True)
        # obj.save()

        return HttpResponse('just seeing if I can get a response')

    else:
        form = itemForm()
        return render(request, 'todo/add.html', {'form': form})
