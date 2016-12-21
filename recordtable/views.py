import datetime, time
from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from recordtable.models import Record
from recordtable.models import DayRecord
from recordtable.serializers import DayRecordSerializer

class RecordList(APIView):
    """
    List all DayRecord, or create a new DayRecord. 
    """
    def get(self, request, format=None):
 
        populate() 
        records = DayRecord.objects.all().order_by('date')
        serializer = DayRecordSerializer(records, many=True)
        return Response(serializer.data)

    def post(self, request, format=None): 
        serializer = DayRecordSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def populate():
    """
    Create Json object for each date and populate the view
    """
    # clear the existing records in order to populate the updated records/
    records = DayRecord.objects.all()
    records.delete();

    # get all the distinct table names from the whole data base
    table_names = Record.objects.values_list('table',flat=True).distinct().order_by('table')
    # get the the distinct dates from the whole data base
    date_list = Record.objects.values_list('date',flat=True).distinct().order_by('date')

    # first row is the lables of all tables
    labelRow = ['Date']
    for name in table_names:
        labelRow.append( name );
    dayrecord = DayRecord(row = labelRow);
    dayrecord.save();
     
    # create 1 DayRecord object
    for day in date_list:
        # convert date to seconds since Epoch
        row = [ '%d' % (time.mktime(day.timetuple()) * 1000)]
        # get the list of tables on that day
        table_list = Record.objects.filter(date = day).order_by('table')
    
        index = 0          # to iterate through the list of table names
        
        for table in table_list: 
            # if the table name is not in current row, append 0, check next name in name list
            while table_names[index] != table.table:
                row.append( 0)
                index += 1
            else:
                row.append( table.record_count )
                index += 1

        # fill in 0's for the missing tables
        while index < table_names.count():
            row.append (0)
            index += 1
        
        # construct that record
        dayrecord = DayRecord(date = day, row=row)
        dayrecord.save()
