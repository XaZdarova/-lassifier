import os
import lxml.etree as ET
from classifier.models import Articles, Tags
from ClassifierProject import settings

def getNewsFields(fileName):
    fields = {}
    newTree = ET.parse(fileName)
    fields["id"] = int(newTree.find(".//id").text)
    fields["source"] = newTree.find(".//source").text
    fields["category"] = newTree.find(".//category").text
    fields["datetime"] = newTree.find(".//datetime").text
    fields["title"] = newTree.find(".//title").text
    fields["text"] = newTree.find(".//text").text
    if newTree.find(".//description"):
        fields["description"] = newTree.find(".//description").text
    if newTree.find(".//tags"):
        tagsObjects = newTree.findall(".//tag")
        fields["tags"] = list(map(lambda argElem: argElem.text, tagsObjects))
    return fields

def updateOrSaveNew(fields):
    articleNew = Articles()
    articleNew.pk = fields["id"]
    articleNew.source = fields["source"]
    articleNew.category = fields["category"]
    articleNew.datetime = fields["datetime"]
    articleNew.title = fields["title"]
    articleNew.text = fields["text"]
    if "description" in fields.keys():
        articleNew.description = fields["description"]
    else:
        articleNew.description = None

    articleNew.save()

    if "tags" in fields.keys():
        tagsNew = Tags.objects.filter(article=fields["id"]).delete()
        
        for tagName in fields["tags"]:
            tag = Tags()
            tag.article = articleNew
            tag.name = tagName.lower()
            tag.save()
            
def newsFilesToBD():
    newsFilesName = os.listdir(settings.BASE_DIR + "\\news") #поменять на news

    for fileName in newsFilesName:
        fields = getNewsFields(settings.BASE_DIR + "\\news\\" + fileName)
        updateOrSaveNew(fields)
