/*********************************************************************
 * Author: Joe Wu @BigBear, Inc.
 * Date: 07/20/2016
 *********************************************************************
 */

/*********************************************************************
 * @param {String} url:
 *********************************************************************
 */
var buildFromCSV = function(url) {
    var client = new XMLHttpRequest();
    client.onreadystatechange = function() {
        if (client.readyState == 4) {
            // 200:Normal http, 0:Chrome w/ --allow-file-access-from-files
            if (client.status === 200 || client.status === 0) {
    
                var allLabels = getLabelsCSV( client.responseText); 

                buildHtml(allLabels); 
                drawMainTable(url, allLabels);
                drawSmallTables(url, allLabels);

                var allTables = tableArray;
                allTables.push(g);
                var sync=Dygraph.synchronize(allTables,
                              {selection:false,zoom:true, range:true});
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

         var stamp1 = new Date().getTime();
         $.each(data, function(i) {
             if(i == data.length-1)
                 allLabels = data[i].row;
             else 
                 items.push( (data[i].row).map(Number) );
         });

         console.log(allLabels);
         var stamp2 = new Date().getTime();
         buildHtml(allLabels);
         var stamp3 = new Date().getTime();
         drawMainTable(items, allLabels);
         var stamp4 = new Date().getTime();
         drawSmallTables(items, allLabels);
         var stamp5 = new Date().getTime();
         //var sync=Dygraph.synchronize(tableArray,{selection:false,zoom:true});
         var stamp6 = new Date().getTime();

         console.log("Time to build Json: "+(stamp2-stamp1)+" ms");
         console.log("Time to build HTML: "+(stamp3-stamp2)+" ms");
         console.log("Time to build Main: "+(stamp4-stamp3)+" ms");
         console.log("Time to build Small: "+(stamp5-stamp4)+" ms");
         console.log("Time to build Sync: "+(stamp6-stamp5)+" ms");
    });
};

/**********************************************************************
 * Sets up the HTML elements for check box and the small charts
 * @param {String Array} labels: the lables for names of all tables 
 **********************************************************************
 */
var buildHtml = function(labels){
  
    var tableCount = labels.length;
 
    $("#checkBox").append("<input type=checkbox name=\"box\" id=\"" + (0) +
                     "\"checked onClick=\"changeVisibility(this)\" ><label for=\""
                      + (0) + "\">" + labels[1] + "</label>");

    // build check box blocks for each chart
    for(var i = 2; i < tableCount; i++) {
        $("#checkBox").append("<input type=checkbox name=\"box\" id=\"" + (i-1) +
                     "\" onClick=\"changeVisibility(this)\" ><label for=\""
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

/*****************************************************************************
 * Draws the main table from the DB (native format), or csv file, or url 
 * returning csv format 
 * 
 * @param {int[][]} data: if data is from database, it is array of arrays. The 
 *                        first int of each row represents date in millisecond 
 *                        since epoch. The rest represent number of record of 
 *                        each table. or it is the csv content.
 * @param {String[]} lables: Name of all tables. First element is Date
 *****************************************************************************
 */
var drawMainTable = function(data, labels){
    //console.log("building main table haha");
    //console.log(data);
    var stamp1 = new Date().getTime();
    var visibility =[];
    var colors = ["rgb(51,204,204)", "rgb(255,100,100)", "#00DD55","rgba(50,50,200,0.4)", 
                  "#00FFFF", "#008080", "#00BFFF", "#FFD700", "#0f09df", "#120f01",
                  "#20B2AA", "#FF0000", "#c50101", "#7FFF00","#FF1493", "#000080", "#f3c803", 
                  "#6B8E23", "#00FA9A", "#B0C4DE", "#F0E68C", "#DAA520"]; 
    // set only the current table to be visible
    for (var i = 0; i < labels.length; i++){
        if(i == 0)
            visibility.push(true);
        else
            visibility.push(false);
    }
    g = new Dygraph( document.getElementById("tableAll"), data,
        {
          title: 'All Tables',
          labelsDiv: document.getElementById('status'),
          labelsSeparateLines: true,
          labelsDivWidth: 100,
          showRoller: true,
          showRangeSelector: true,
          colors: colors,
          legend: 'always',
          ylabel: '# of Records',
          drawGrid: true,
          axisLabelFontSize: 12,
          rightGap: 8,
          strokeBorderWidth: 0.5,
          visibility: visibility,
          labels: labels,
          labelsUTC: true,
          highlightSeriesOpts: { strokeWidth: 2,
                                 strokeBorderWidth: 2,
                                 highlightCircleSize:5 },
          axes: { x: { valueFormatter: Dygraph.dateString_,
                       axisLabelFormatter: Dygraph.dateAxisFormatter,
                       ticker: Dygraph.dateTicker } }
         });

    var stamp2 = new Date().getTime();

    console.log("Time to build g: "+ (stamp2-stamp1));
    // Lock/unlock the serie when it is clicked
    var onclick = function(ev) {
        if (g.isSeriesLocked()) 
            g.clearSelection();
        else 
            g.setSelection(g.getSelection(), g.getHighlightSeries(), true);
    };
    g.updateOptions( {clickCallback: onclick}, true );
};

/**********************************************************************
 *
 * @param {String} url:
 * @param {String[]} labels:
 **********************************************************************
 */
var drawSmallTables = function(url, labels){

    var colors = ["rgb(51,204,204)", "rgb(255,100,100)", "#00DD55","rgba(50,50,200,0.4)",
                  "#00FFFF", "#008080", "#00BFFF", "#FFD700", "#0f09df", "#120f01",
                  "#20B2AA", "#FF0000", "#c50101", "#7FFF00","#FF1493", "#000080", "#f3c803",
                  "#6B8E23", "#00FA9A", "#B0C4DE", "#F0E68C", "#DAA520"];

    tableArray = [];
    var tableCount = labels.length - 1;

    for(var i = 0; i < tableCount; i++) {

        var visibility =[];
        // set only the current table to be visible
        for (var j = 0; j < labels.length; j++){
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
                   colors: colors,
                   visibility: visibility,
                   labels:labels,
                   labelsUTC: true,
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

    var stamp1 = new Date().getTime();
    checkboxes = document.getElementsByName('box');
    var n = checkboxes.length;
    for (var i = 0; i < n; i++) {
        checkboxes[i].checked = source.checked;
        changeVisibility(checkboxes[i]);
    }
    var stamp2 = new Date().getTime();
    console.log("Toggle all takes " + (stamp2-stamp1) + " ms");
}

/*********************************************************************
 * Change the visibility of the selected element.
 *********************************************************************
 */
function changeVisibility(element) {
    g.setVisibility( parseInt(element.id), element.checked);
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


