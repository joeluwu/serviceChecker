# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-13 21:14
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recordtable', '0013_auto_20160912_2033'),
    ]

    operations = [
        migrations.AddField(
            model_name='dayrecord',
            name='date',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='dayrecord',
            name='row',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=20), null=True, size=None),
        ),
    ]
