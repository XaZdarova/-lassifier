# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2020-11-30 10:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Articles',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('source', models.CharField(max_length=200)),
                ('category', models.CharField(max_length=50)),
                ('datetime', models.DateTimeField(verbose_name='date published')),
                ('title', models.CharField(max_length=300)),
                ('description', models.CharField(max_length=800, null=True)),
                ('text', models.TextField()),
            ],
        ),
    ]
