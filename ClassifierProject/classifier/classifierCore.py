from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline
from sklearn import metrics
from classifier.models import Articles
from ClassifierProject import settings
import pickle

def getCategoriesList():
    return ["В мире", "В России", "Москва", "Культура", "Спорт", "Экономика"]

def getCategoriesDict():
    return {"В мире":1, "В России":2, "Москва":3, "Культура":4, "Спорт":5, "Экономика":6}

def getTrainingData(count):
    categoriesDict = getCategoriesDict()
    categoriesList = getCategoriesList()
    trainingData = {}
    trainingData["text"] = []
    trainingData["target"] = []
    trainingData["names"] = categoriesList
    
    for category in categoriesList:
        articles = list(Articles.objects.filter(category=category).order_by("pk")[:count])
        trainingData["text"] = trainingData["text"] + list(map(lambda arg: arg.text[arg.text.find("-") + 1:], articles))
        trainingData["target"] = trainingData["target"] + list(map(lambda arg: categoriesDict[arg.category], articles))

    return trainingData

def getDataForTest(count):
    categoriesDict = getCategoriesDict()
    categoriesList = getCategoriesList()
    dataForTest = {}
    dataForTest["text"] = []
    dataForTest["target"] = []
    dataForTest["names"] = categoriesList
    
    for category in categoriesList:
        articles = list(Articles.objects.filter(category=category).order_by("-pk")[:count])
        dataForTest["text"] = dataForTest["text"] + list(map(lambda arg: arg.text[arg.text.find("-") + 1:], articles))
        dataForTest["target"] = dataForTest["target"] + list(map(lambda arg: categoriesDict[arg.category], articles))

    return dataForTest

def getStopWords():
    listStopWords = []
    file = open(settings.BASE_DIR + "\\stopWords.txt", "r")

    for line in file:
        listStopWords.append(line.rstrip('\n'))

    return listStopWords

def saveFitData(objectForS, filename):
    file = open(settings.BASE_DIR + "\\" + filename, "wb")
    pickle.dump(objectForS, file)
    file.close()

def readFitData(filename):
    file = open(settings.BASE_DIR + "\\" + filename, "rb")
    result = pickle.load(file)
    file.close()
    return result

def classifierFit():
    fitInformation = {}
    trainingData = getTrainingData(700)
    testData = getDataForTest(300)
    classifierObject = Pipeline([
        ('vect', CountVectorizer(stop_words=getStopWords())),
        ('tfidf', TfidfTransformer()),
        ('clf', SGDClassifier(max_iter=5, tol=None, alpha=1e-3))
    ])
    classifierObject.fit(trainingData["text"], trainingData["target"])
    saveFitData(classifierObject, "fitData.txt")

    predicted = classifierObject.predict(testData["text"])

    fitInformation["precision"] = list(metrics.precision_score(testData["target"], predicted, average=None))
    fitInformation["precisionMacro"] = metrics.precision_score(testData["target"], predicted, average="macro")
    fitInformation["precisionMicro"] = metrics.precision_score(testData["target"], predicted, average="micro")
    fitInformation["recall"] = list(metrics.recall_score(testData["target"], predicted, average=None))
    fitInformation["recallMacro"] = metrics.recall_score(testData["target"], predicted, average="macro")
    fitInformation["recallMicro"] = metrics.recall_score(testData["target"], predicted, average="micro")
    fitInformation["f1Score"] = list(metrics.f1_score(testData["target"], predicted, average=None))
    fitInformation["f1ScoreMacro"] = metrics.f1_score(testData["target"], predicted, average="macro")
    fitInformation["f1ScoreMicro"] = metrics.f1_score(testData["target"], predicted, average="micro")
    fitInformation["accuracy"] = metrics.accuracy_score(testData["target"], predicted)
    fitInformation["categoryList"] = trainingData["names"]

    saveFitData(fitInformation, "fitInformation.txt")

def getClassifierInformation():
    return readFitData("fitInformation.txt")

def classifyArticle(text):
    classifierResult = {}
    categoriesList = getCategoriesList()
    classifierObject = readFitData("fitData.txt")
    numberOfCategory = classifierObject.predict([text])[0]
    classifierResult["category"] = categoriesList[numberOfCategory - 1]

    return classifierResult
