from rest_framework import serializers
from recordtable.models import DayRecord
from django.contrib.postgres.fields import ArrayField

class DayRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayRecord
        field = ('date','row')
#class DayRecordSerializer(serializers.Serializer):
#    date = serializers.DateField()    
#    row = serializers.ListField()
#    def create(self, validated_data):
#        """
#        Create and return a new `DayRecord' instance, given the validated data.
#        """
#        return DayRecord.objects.create(**validated_data)

#    def update(self, instance, validated_data):
#        """
#        Update and return an existing `DayRecord` instance, given the validated data.
#        """
#        instance.date = validated_data.get('date', instance.date)
#        instance.row = validated_data.get('row', instance.row)
#        instance.save()
#        return instance
