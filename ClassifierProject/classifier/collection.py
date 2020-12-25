from classifier.models import Articles, Tags
from datetime import datetime
from datetime import timedelta

def articlesFilter(category, dateStart, dateEnd, sort, sortType, page, pageLimit):
    filterResult = {}
    filterResult["articles"] = []
    querySet = Articles.objects.all()
    if category is not None:
        querySet = querySet.filter(category=category)
    if dateStart is not None and dateEnd is not None:
        querySet = querySet.filter(datetime__range=(dateStart, (datetime.strptime(dateEnd, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")))
    if sort is not None and sortType is not None:
        if sortType == "asc":
            querySet = querySet.order_by(sort)
        else:
            querySet = querySet.order_by("-" + sort)

    filterResult["len"] = len(querySet)

    if page is not None and pageLimit is not None:
        lenQuerySet = len(querySet)
        startElement = pageLimit * (page - 1)
        endElement = (pageLimit * page)
        if (startElement < lenQuerySet):
            if (endElement > lenQuerySet):
                endElement = lenQuerySet
        else:
            return False
        querySet = querySet[startElement:endElement]
    
    for article in querySet:
        articleDict = {}
        articleDict["id"] = article.id
        articleDict["title"] = article.title
        articleDict["category"] = article.category
        articleDict["datetime"] = str(article.datetime)
        articleDict["description"] = article.description
        articleDict["tags"] = list(map(lambda arg: arg.name, list(Tags.objects.filter(article=article.pk))))
        filterResult["articles"].append(articleDict)
    return filterResult

def getArticle(id):
    try:
        articleObject = Articles.objects.get(pk=id)
        tags = []
        articleDict = {}
        queryTags = Tags.objects.filter(article=id)
        if queryTags.exists():
            for tag in queryTags:
                tags.append(tag.name)
    
        articleDict["source"] = articleObject.source
        articleDict["category"] = articleObject.category
        articleDict["datetime"] = str(articleObject.datetime)
        articleDict["title"] = articleObject.title
        articleDict["description"] = articleObject.description
        articleDict["text"] = articleObject.text
        articleDict["tags"] = tags
        return articleDict
    except Articles.DoesNotExist:
        return False

def updateArticle(id, sourceNew, categoryNew, datetimeNew, titleNew, descriptionNew, textNew, tagsNew):
    queryArticle = Articles.objects.filter(pk=id)
    if queryArticle.exists():
        queryArticle.update(source=sourceNew, category=categoryNew, datetime=datetimeNew, title=titleNew, description=descriptionNew, text=textNew)
        articleObject = Articles.objects.get(pk=id)
        queryTags = Tags.objects.filter(article=id)
        if queryTags.exists():
            queryTags.delete()
            for tagName in tagsNew:
                tag = Tags()
                tag.article = articleObject
                tag.name = tagName
                tag.save()
        return True
    else:
        return False

def addArticle(source, category, datetime, title, description, text, tags):
    articleObject = Articles()
    articleObject.source = source
    articleObject.category = category
    articleObject.datetime = datetime
    articleObject.title = title
    articleObject.description = description
    articleObject.text = text
    articleObject.save()

    for tagName in tags:
        tagObject = Tags()
        tagObject.article = articleObject
        tagObject.name = tagName
        tagObject.save()

def deleteArticle(id):
    queryArticle = Articles.objects.filter(pk=id)
    if queryArticle.exists():
        queryArticle.delete()
        return True
    else:
        return False
