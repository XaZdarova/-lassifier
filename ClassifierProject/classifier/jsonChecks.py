import json
from datetime import datetime
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import re

def checkJsonForUpdateOrAddArticle(data):
    try:
        jsonForUpdateOrAdd = json.loads(data)
    except json.JSONDecodeError:
        return False
    if jsonForUpdateOrAdd:
        requiredFields = ["source", "category", "datetime", "title", "description", "text", "tags"]
        if list(jsonForUpdateOrAdd.keys()) != requiredFields:
            return False
    else:
        return False

    if isinstance(jsonForUpdateOrAdd["source"], str):
        if jsonForUpdateOrAdd["source"].strip():
            if len(jsonForUpdateOrAdd) <= 200:
                validatorForUrl = URLValidator()
                try:
                    validatorForUrl(jsonForUpdateOrAdd["source"])
                except ValidationError:
                    return False
            else:
                return False
        else:
            return False
    else:
        return False

    if isinstance(jsonForUpdateOrAdd["category"], str):
        if jsonForUpdateOrAdd["category"].strip():
            listOfCategory = ["В России", "В мире", "Экономика", "Спорт", "Культура", "Москва"]
            if not (jsonForUpdateOrAdd["category"] in listOfCategory):
                return False
        else:
            return False
    else:
        return False

    if isinstance(jsonForUpdateOrAdd["datetime"], str):
        if jsonForUpdateOrAdd["datetime"].strip():
            regExpForDatetime = r"^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$"
            if re.match(regExpForDatetime, jsonForUpdateOrAdd["datetime"]):
                try:
                    datetimePub = datetime.strptime(jsonForUpdateOrAdd["datetime"], "%Y-%m-%d %H:%M")
                except ValueError:
                    return False
            else:
                return False
        else:
            return False
    else:
        return False

    if isinstance(jsonForUpdateOrAdd["title"], str):
        if jsonForUpdateOrAdd["title"].strip():
            if len(jsonForUpdateOrAdd["title"]) > 1000:
                return False
        else:
            return False
    else:
        return False

    if isinstance(jsonForUpdateOrAdd["text"], str):
        if jsonForUpdateOrAdd["text"].strip():
            if len(jsonForUpdateOrAdd["text"]) > 20000:
                return False
        else:
            return False
    else:
        return False

    if jsonForUpdateOrAdd["description"] is not None:
        if isinstance(jsonForUpdateOrAdd["description"], str):
            if jsonForUpdateOrAdd["description"].strip():
                if len(jsonForUpdateOrAdd) > 1000:
                    return False
            else:
                return False
        else:
            return False

    if jsonForUpdateOrAdd["tags"] is not None:
        if isinstance(jsonForUpdateOrAdd["tags"], list):
            if jsonForUpdateOrAdd["tags"]:
                if len(jsonForUpdateOrAdd["tags"]) <= 10:
                    for tag in jsonForUpdateOrAdd["tags"]:
                        if isinstance(tag, str):
                            if tag:
                                if len(tag) > 50:
                                    return False
                            else:
                                return False
                        else:
                            return False
                else:
                    return False
            else:
                return False
        else:
            return False

    return jsonForUpdateOrAdd
            
def checkJsonForClassifier(data):
    try:
        jsonForClassifier = json.loads(data)
    except json.JSONDecodeError:
        return False
    if jsonForClassifier:
        requiredFields = ["text"]
        if list(jsonForClassifier.keys()) != requiredFields:
            return False
    else:
        return False

    if isinstance(jsonForClassifier["text"], str):
        if jsonForClassifier["text"].strip():
            if len(jsonForClassifier["text"]) > 20000:
                return False
        else:
            return False
    else:
        return False

    return jsonForClassifier

def checkJsonForFilter(data):
    try:
        jsonForFilter = json.loads(data)
    except json.JSONDecodeError:
        return False
    if jsonForFilter:
        requiredFields = ["category", "dateStart", "dateEnd", "sort", "sortType", "page", "pageLimit"]
        if list(jsonForFilter.keys()) != requiredFields:
            return False
    else:
        return False

    if jsonForFilter["category"] is not None:
        if isinstance(jsonForFilter["category"], str):
            if jsonForFilter["category"]:
                listOfCategory = ["В России", "В мире", "Экономика", "Спорт", "Культура", "Москва"]
                if not (jsonForFilter["category"] in listOfCategory):
                    return False
            else:
                return False
        else:
            return False

    if jsonForFilter["dateStart"] is None and jsonForFilter["dateEnd"] is not None or jsonForFilter["dateStart"] is not None and jsonForFilter["dateEnd"] is None:
        return False

    if jsonForFilter["dateStart"] is not None and jsonForFilter["dateEnd"] is not None:
        if isinstance(jsonForFilter["dateStart"], str) and isinstance(jsonForFilter["dateEnd"], str):
            if jsonForFilter["dateStart"] and jsonForFilter["dateEnd"]:
                regExpForDatetime = r"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
                if re.match(regExpForDatetime, jsonForFilter["dateStart"]) and re.match(regExpForDatetime, jsonForFilter["dateEnd"]):
                    try:
                        dateStart = datetime.strptime(jsonForFilter["dateStart"], "%Y-%m-%d")
                        dateEnd = datetime.strptime(jsonForFilter["dateEnd"], "%Y-%m-%d")
                        if dateStart > dateEnd:
                            return False
                    except ValueError:
                        return False
                else:
                    return False
            else:
                return False
        else:
            return False

    if jsonForFilter["sort"] is None and jsonForFilter["sortType"] is not None or jsonForFilter["sort"] is not None and jsonForFilter["sortType"] is None:
        return False

    if jsonForFilter["sort"] is not None and jsonForFilter["sortType"] is not None:
        if isinstance(jsonForFilter["sort"], str) and isinstance(jsonForFilter["sortType"], str):
            listOfSort = ["category", "datetime"]
            listOfSortType = ["asc", "desc"]
            if not (jsonForFilter["sort"] in listOfSort) or not (jsonForFilter["sortType"] in listOfSortType):
                return False
        else:
            return False

    if jsonForFilter["page"] is None and jsonForFilter["pageLimit"] is not None or jsonForFilter["page"] is not None and jsonForFilter["pageLimit"] is None:
        return False

    if jsonForFilter["page"] is not None and jsonForFilter["pageLimit"] is not None:
        if isinstance(jsonForFilter["page"], int) and isinstance(jsonForFilter["pageLimit"], int):
            listOfPageLimit = [10, 20, 50, 100]
            if jsonForFilter["page"] < 1 or not (jsonForFilter["pageLimit"] in listOfPageLimit):
                return False
        else:
            return False

    return jsonForFilter
