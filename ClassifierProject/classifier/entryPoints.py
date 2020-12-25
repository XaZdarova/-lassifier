from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.html import escape
import json
from classifier import prepare
from classifier import collection
from classifier import classifierCore
from classifier import jsonChecks

@csrf_exempt
def articlesFilterOperation(request):
    if request.method == "POST":
        if request.content_type != "application/json":
            return HttpResponse("unsupported media type", status=415)

        jsonForFilter = jsonChecks.checkJsonForFilter(request.body)
        if jsonForFilter:
            filterResult = collection.articlesFilter(jsonForFilter["category"],
                                                     jsonForFilter["dateStart"],
                                                     jsonForFilter["dateEnd"],
                                                     jsonForFilter["sort"],
                                                     jsonForFilter["sortType"],
                                                     jsonForFilter["page"],
                                                     jsonForFilter["pageLimit"])
            if filterResult:
                for articleShort in filterResult["articles"]:
                    articleShort["title"] = escape(articleShort["title"])
                    articleShort["description"] = escape(articleShort["description"])
                    for tag in articleShort["tags"]:
                        tag = escape(tag)
                return HttpResponse(json.dumps(filterResult), content_type="application/json")
            else:
                return HttpResponse("page not found", status=404)
        else:
            return HttpResponse("bad request", status=400)
    else:
        return HttpResponse("method is not allowed", status=405)

@csrf_exempt
def articlesAdd(request):
    if request.method == "POST":
        if request.content_type != "application/json":
            return HttpResponse("unsupported media type", status=415)

        jsonForAdd = jsonChecks.checkJsonForUpdateOrAddArticle(request.body)
        if jsonForAdd:
            collection.addArticle(jsonForAdd["source"],
                                  jsonForAdd["category"],
                                  jsonForAdd["datetime"],
                                  jsonForAdd["title"],
                                  jsonForAdd["description"],
                                  jsonForAdd["text"],
                                  jsonForAdd["tags"])
            return HttpResponse("successfull")
        else:
            return HttpResponse("bad request", status=400)
    else:
        return HttpResponse("method is not allowed", status=405)

@csrf_exempt
def updateFromFiles(request):
    if request.method == "PUT":
        prepare.newsFilesToBD()
        return HttpResponse("update successfull")
    else:
        return HttpResponse("method is not allowed", status=405)

@csrf_exempt
def articleOperations(request, articleId):
    if request.method == "GET":
        articleGet = collection.getArticle(articleId)
        if articleGet:
            articleGet["source"] = escape(articleGet["source"])
            articleGet["title"] = escape(articleGet["title"])
            articleGet["description"] = escape(articleGet["description"])
            for tag in articleGet["tags"]:
                tag = escape(tag)
            return HttpResponse(json.dumps(articleGet), content_type="application/json")
        else:
            return HttpResponse("page not found", status=404)
    else:
        if request.method == "PUT":
            if request.content_type != "application/json":
                return HttpResponse("unsupported media type", status=415)

            jsonForUpdate = jsonChecks.checkJsonForUpdateOrAddArticle(request.body)
            if jsonForUpdate:
                updateResult = collection.updateArticle(articleId,
                                                        jsonForUpdate["source"],
                                                        jsonForUpdate["category"],
                                                        jsonForUpdate["datetime"],
                                                        jsonForUpdate["title"],
                                                        jsonForUpdate["description"],
                                                        jsonForUpdate["text"],
                                                        jsonForUpdate["tags"])
                if updateResult:
                    return HttpResponse("successfull")
                else:
                    return HttpResponse("bad request", status=400)
            else:
                return HttpResponse("bad request", status=400)
        else:
            if request.method == "DELETE":
                deleteResult = collection.deleteArticle(articleId)
                if deleteResult:
                    return HttpResponse("successfull")
                else:
                    return HttpResponse("bad request", status=400)
            else:
                return HttpResponse("method is not allowed", status=405)

@csrf_exempt
def classifierFit(request):
    if request.method == "POST":
        classifierCore.classifierFit()
        return HttpResponse("successfull")
    else:
        return HttpResponse("method is not allowed", status=405)

@csrf_exempt
def classifierEntryPoint(request):
    if request.method == "GET":
        fitInformation = classifierCore.getClassifierInformation()
        return HttpResponse(json.dumps(fitInformation), content_type="application/json")
    else:
        if request.method == "POST":
            if request.content_type != "application/json":
                return HttpResponse("unsupported media type", status=415)

            jsonForClassify = jsonChecks.checkJsonForClassifier(request.body)
            if jsonForClassify:
                classifierResult = classifierCore.classifyArticle(jsonForClassify["text"])
                return HttpResponse(json.dumps(classifierResult), content_type="application/json")
            else:
                return HttpResponse("bad request", status=400)
        else:
            return HttpResponse("method is not allowed", status=405)
