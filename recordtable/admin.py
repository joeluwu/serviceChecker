from django.contrib import admin
from .models import Record
# Register your models here.

class RecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'table', 'date', 'record_count')

admin.site.register(Record, RecordAdmin)
