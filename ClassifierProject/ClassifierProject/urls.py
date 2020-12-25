"""
Definition of urls for ClassifierProject.
"""

from django.conf.urls import include, url
from classifier import entryPoints
from classifier import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^collection$', views.collection),
    url(r'^articles/[0-9]+', views.article),
    url(r'^api/update-from-files$', entryPoints.updateFromFiles),
    url(r'^api/articles/(?P<articleId>[0-9]+)$', entryPoints.articleOperations),
    url(r'^api/articles$', entryPoints.articlesAdd),
    url(r'^api/articles/filter$', entryPoints.articlesFilterOperation),
    url(r'^api/classifier/fit$', entryPoints.classifierFit),
    url(r'^api/classifier$', entryPoints.classifierEntryPoint)
]
