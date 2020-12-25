from django.db import models

class Articles(models.Model):
    source = models.CharField(max_length=200)
    category = models.CharField(max_length=50)
    datetime = models.DateTimeField('date published')
    title = models.CharField(max_length=1000)
    description = models.CharField(max_length=1000, null=True)
    text = models.TextField()

class Tags(models.Model):
    article = models.ForeignKey(Articles, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
