/*********************************************************************
 * Author: Joe Wu @BigBear, Inc.
 * Date: 07/20/2016
 *********************************************************************
 */

/*********************************************************************
 * @param {String} url:
 *********************************************************************
 */
var buildFromCSV = function(url){
    var client = new XMLHttpRequest();
    client.onreadystatechange = function() {
        if (client.readyState == 4) {
            // 200:Normal http, 0:Chrome w/ --allow-file-access-from-files
            if (client.status === 200 || client.status === 0) {
    
                var allLabels = getLabelsCSV( client.responseText); 
                //console.log(allLabels);
                buildHtml(allLabels); 
                drawMainTable(url, allLabels,false);
                drawSmallCSV(url, allLabels);
                //drawMainTableCSV(url);
            }
        }
    }
    client.open('GET', url, true);
    client.send();
};

/**********************************************************************
 * @param {String} url:
 **********************************************************************
 */
var buildFromDB = function(url){

     $.getJSON(url, function(data) {

         var allLabels;
         // stores each row as an element will be rendered in main table
         var items = [];

         $.each(data, function(i) {
             if(i == data.length - 1)
                 allLabels = data[i].row;
             else 
                 items.push( (data[i].row).map(Number) );
         });
         //console.log("All together\n=========\n" + items);
         drawMainTable(items, allLabels, true);
         //console.log( "Labels are " + allLabels);
         buildHtml(allLabels);
         drawSmallCSV(items, allLabels);

         var sync=Dygraph.synchronize(tableArray,{selection:false,zoom:true});
         //var allTables = tableArray;
         //allTables.push(g);
         //var sync=Dygraph.synchronize(allTables,{selection:false,zoom:true});
    });
};

/**********************************************************************
 * Sets up the HTML elements for check box and the small charts
 * @param {String Array} labels: the lables for names of all tables 
 **********************************************************************
 */
var buildHtml = function(labels){
  
    var tableCount = labels.length;
  
    // build check box blocks for each chart
    for(var i = 1; i < tableCount; i++) {
        $("#checkBox").append("<input type=checkbox name=\"box\" id=\"" + (i-1) +
                     "\" checked onClick=\"changeVisibility(this)\" ><label for=\""
                      + (i-1) + "\">" + labels[i] + "</label>");
        if (i%2==0)
            $("#checkBox").append("<br/>");
    }

    var numRow = (tableCount - 1) / 4;      // each row has 4 cells
  
    // add rows
    for(var i = 0; i<numRow; i++) 
        $("#smallChartContainer").append("<div class=\"row\" id=\"row"
                                         + i + "\"></div>");
  
    // add cells to each row, fill from top to bottom, left to right
    for(var i = 0; i < tableCount-1; i++) 
        $("#row" + Math.floor(i/4)).append("<div class=\"cell\" id=\"table"
                                           + i + "\"></div>");
};

/****************************************************************************
 * Draws the main table using data from csv file, or url returing csv format 
 * @param {String} url: the name of the file in current directory, or url to
 *                      the csv.(i.e. 'data.csv', 'http://example.com/a.csc') 
 ****************************************************************************
 */
var drawMainTableCSV = function(url){

    console.log("building main graph using CSV format: " + url);
    g = new Dygraph( document.getElementById("tableAll"), url,
       {
        title: 'All Tables',
        labelsDiv: document.getElementById('status'),
        labelsSeparateLines: true,
        labelsDivWidth: 100,
        showRangeSelector: true,
        legend: 'always',
        ylabel: '# of Records',
        drawGrid: true,
        axisLabelFontSize: 12,
        labelsUTC: true,
        rightGap: 8,
        strokeBorderWidth: 0.5,
        highlightSeriesOpts: { strokeWidth: 2,
                               strokeBorderWidth: 2,
                               highlightCircleSize: 5 },
        axes: {x: { valueFormatter: Dygraph.dateString_,
                    axisLabelFormatter: Dygraph.dateAxisFormatter,
                    ticker: Dygraph.dateTicker }}
       });
    /**
     * Lock/unlock the serie when it is clicked
     */
    var onclick = function(ev) {
        if (g.isSeriesLocked()) 
            g.clearSelection();
        else 
            g.setSelection(g.getSelection(), g.getHighlightSeries(), true);
    };
    g.updateOptions( {clickCallback: onclick}, true);
};

/*****************************************************************************
 * Draws the main table from the DB (native format)
 * @param {int[][]} data: data is array of arrays. The first int of each row 
 *                        represents date in millisecond since epoch. The rest
 *                        represent number of record of each table.
 * @param {String[]} lables: Name of all tables. First element is Date
 *****************************************************************************
 */
var drawMainTable = function(data, labels, isFromDB){
    console.log("building main table haha");
    //console.log(data);
    g = new Dygraph( document.getElementById("tableAll"), data,
        {
          title: 'All Tables',
          labelsDiv: document.getElementById('status'),
          labelsSeparateLines: true,
          labelsDivWidth: 100,
          showRangeSelector: true,
          legend: 'always',
          ylabel: '# of Records',
          drawGrid: true,
          axisLabelFontSize: 12,
          rightGap: 8,
          strokeBorderWidth: 0.5,
          //labels: labels,
          labelsUTC: true,
          highlightSeriesOpts: { strokeWidth: 2,
                                 strokeBorderWidth: 2,
                                 highlightCircleSize:5 },
          axes: { x: { valueFormatter: Dygraph.dateString_,
                       axisLabelFormatter: Dygraph.dateAxisFormatter,
                       ticker: Dygraph.dateTicker }}
           });

    if (isFromDB){
      g.updateOptions({labels:labels});
      console.log("Updated labels\n");
    }
    /**
     * Lock/unlock the serie when it is clicked
     */
    var onclick = function(ev) {
        if (g.isSeriesLocked()) 
            g.clearSelection();
        else 
            g.setSelection(g.getSelection(), g.getHighlightSeries(), true);
    };
    g.updateOptions({clickCallback: onclick}, true);
};

/**********************************************************************
 *
 * @param {String} url:
 * @param {String[]} labels:
 **********************************************************************
 */
var drawSmallCSV = function(url, labels){

    tableArray = [];

    var tableCount = labels.length - 1;
    //console.log("Table Count:" + tableCount);

    for(var i = 0; i<tableCount; i++) {
        var visibility =[];
        // set only the current table to be visible
        for (var j =0; j<labels.length;j++){
            if(j!=i)
                visibility.push(false);
            else
                visibility.push(true);
        }

        tableArray.push(
            new Dygraph( document.getElementById("table" + i), url,
                 {
                   title: labels[i+1],
                   titleHeight: 20,
                   ylabel: '# of Records',
                   yLabelWidth: 14,
                   drawGrid: true,
                   axisLabelFontSize: 8,
                   labelsDivWidth: 120,
                   labelsSeparateLines: true,
                   legend: 'follow',
                   rightGap: 5,
                   visibility: visibility,
                   labelsUTC: true,
                   labels:labels,
                   axes: { x: { pixelsPerLabel: 30,
                                valueFormatter: Dygraph.dateString_,
                                axisLabelFormatter: Dygraph.dateAxisFormatter,
                                ticker: Dygraph.dateTicker },
                           y: { pixelsPerLabel: 20,
                                axisLabelWidth: 28 } }
                 }
            )
        );
    }
};

/*********************************************************************
 * Get the labels of all series from CSV format
 * @param {data} the csv file
 * @return {String[]} labels: Each element is the name of a series
 *********************************************************************
 */
var getLabelsCSV = function(data) {
    var firstLine = data.split("\n")[0];
    var labels = firstLine.split(",");
    return labels;
};

/*********************************************************************
 * Check/uncheck the visibility box for all series in the main table, 
 * and make call the check visibility of the appropriate series.
 *********************************************************************
 */
function toggleAll(source){
    checkboxes = document.getElementsByName('box');
    var n = checkboxes.length;
    for(var i=0;i<n;i++) {
        checkboxes[i].checked = source.checked;
        changeVisibility(checkboxes[i]);
    }
}

/*********************************************************************
 * Change the visibility of the selected element.
 *********************************************************************
 */
function changeVisibility(element) {
    g.setVisibility(element.id, element.checked);
}

/*********************************************************************
 * Switch the main graphs display mode bwtween log and linear scale.
 *********************************************************************
 */
function setLogScale(val) {
    
    g.updateOptions({ logscale: val });
    //for (var idx = 0; idx < tableArray.length; idx++) 
    //    tableArray[idx].updateOptions({ logscale: val });
    
    document.getElementById("linear").disabled = !val;
    document.getElementById("log").disabled = val;
}


