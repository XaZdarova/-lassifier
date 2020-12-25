from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    if request.method == "GET":
        return render(request, "classifier/index.html")
    else:
        return HttpResponse("method is not allowed", status=405)

def collection(request):
    if request.method == "GET":
        return render(request, "classifier/collection.html")
    else:
        return HttpResponse("method is not allowed", status=405)

def article(request):
    if request.method == "GET":
        return render(request, "classifier/article.html")
    else:
        return HttpResponse("method is not allowed", status=405)