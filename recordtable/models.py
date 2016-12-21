from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields import JSONField

# each Record is an entry in the database
class Record(models.Model):
    date = models.DateField()
    record_count = models.IntegerField()
    table = models.CharField(max_length=40)
    def __str__(self):
        return self.table

# record of all tables in a single day
class DayRecord(models.Model):
    date = models.DateField(null=True)
    row = ArrayField( models.CharField(max_length=20), null=True)
