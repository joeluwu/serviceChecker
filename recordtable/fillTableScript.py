import random
import datetime
import pandas as pd
from random import randint
from recordtable.models import Record 

#to delete
records = Record.objects.all()
records.delete();

datelist = pd.date_range(end = pd.datetime.today(), periods = 500).tolist()

for date in datelist:
    print date

tables = []
table_count = 18 

for i in range(1, table_count+1):
    tables.append("table "+ str(i))
for i in range(0,table_count):
    print tables[i]

first= 200 
second = 300

for date in datelist:
    first = first+2
    second = second+2
    #i = random.uniform(2,4.8)
    #j = randint(-3,15)
    for table in tables:
        i = random.uniform(2,4.8)
        j = randint(-3,15)
        low = first * i + j 
        high = second * i + j 
        Record.objects.create(
            date=date,
            record_count= randint(int(low), int(high)),
            table = table
        )
        j=j+randint(50,70)
