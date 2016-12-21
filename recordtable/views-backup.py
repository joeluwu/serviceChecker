from rest_framework.decorators import api_view 
from rest_framework.response import Response
from rest_framework import status
from recordtable.serializers import DayRecordSerializer
from recordtable.models import DayRecord
from recordtable.models import Record

@api_view(['GET','POST'])
def record_list(request):
    """
    List all DayRecord, or create a new DayRecord.
    """
    if request.method == 'GET':
    
        populate() 
        records = DayRecord.objects.all()
        serializer = DayRecordSerializer(records, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DayRecordSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def populate():
    """
    Create Json object for each date and populate the view
    """
    # clear the existing records
    records = DayRecord.objects.all()
    records.delete();
    # get all the distinct table names from the whole data base
    table_names = Record.objects.values_list('table',flat=True).distinct().order_by('table')
    # get the the distinct dates from the whole data base
    date_list = Record.objects.values_list('date',flat=True).distinct().order_by('date')
    
    # create 1 DayRecord object
    for day in date_list:

        records = {}

        # get the list of tables on that day
        table_list = Record.objects.filter(date = day).order_by('table')
    
        index = 0          # to iterate through the list of table names
        
        for row in table_list: 
            # if the table name is not in current row, append 0, check next name in name list
            while table_names[index] != row.table:
                records[table_names[index]] = 0
                index += 1
            else:
                records[table_names[index]] = row.record_count
                index += 1

        # fill in 0's for the missing tables
        while index < table_names.count():
            records[table_names[index]] = 0
            index += 1
        
        # construct that record
        dayrecord = DayRecord(date=day.strftime('%Y-%m-%d'), records=records)
        dayrecord.save()


