/*global Gallery,Dygraph,data */
var buildAll = function(url){
  var client = new XMLHttpRequest();
  //client.open('GET', url);
  client.onreadystatechange = function() {
    if (client.readyState == 4) {
      if (client.status === 200 || // Normal http
          client.status === 0) { // Chrome w/ --allow-file-access-from-files
        
        var allLabels = getAllLabels( client.responseText); 
        console.log(allLabels);

        buildHtml(allLabels); 
        drawMainTable(url);
        drawSmall(url, allLabels);
        drawMainTable(url);
      }
    }
  }
  client.open('GET', url, true);
  client.send();
};

function toggleAll(source){
  checkboxes = document.getElementsByName('box');
  var n = checkboxes.length;
  for(var i=0;i<n;i++) {
    checkboxes[i].checked = source.checked;
    changeVisibility(checkboxes[i]);
  }
}

function changeVisibility(element) {
  g.setVisibility(element.id, element.checked);
}

var getAllLabels = function(data) {
  var firstLine = data.split("\n")[0];
  var labels = firstLine.split(",");
  return labels;
};

var buildHtml = function(labels){
  
  var tableCount = labels.length;
  
  // build check box blocks
  for(var i = 1; i < tableCount; i++) {
      $("#checkBox").append("<input type=checkbox name=\"box\" id=\""+(i-1)+
                     "\" checked onClick=\"changeVisibility(this)\" ><label for=\"" + (i-1) +
                     "\">"+ labels[i]+"</label>");
      if (i%2==0)
        $("#checkBox").append("<br/>");
  }

  var numRow = (tableCount - 1) / 4;      // each row has 4 cells
  
  // add rows
  for(var i = 0; i<numRow; i++) {
    $("#smallChartContainer").append("<div class=\"row\" id=\"row"+ i +"\"></div>");
  }
  // add cells
  for(var i = 0; i < tableCount-1; i++) {
    $("#row" + Math.floor(i/4)).append("<div class=\"cell\" id=\"table"+ i +"\"></div>");
  }
};

var drawMainTable = function(url){

  console.log("building main graph");
  console.log(url);
  g = new Dygraph( document.getElementById("tableAll"), url,
    {
      title: 'All Tables',
      labelsDiv: document.getElementById('status'),
      labelsSeparateLines: true,
      labelsDivWidth: 100,
      showRangeSelector: true,
      logscale: true,
      //errorBars: true,
      legend: 'always',
      ylabel: '# of Records',
      drawGrid: true,
      axisLabelFontSize: 12,
      pixelsPerLabel: 34,
      rightGap: 8,
      highlightCircleSize: 2,
      strokeWidth: 1,
      strokeBorderWidth: 1,
      highlightSeriesOpts: {
        strokeWidth: 2,
        strokeBorderWidth: 1,
        highlightCircleSize: 5
      }
    });
  var onclick = function(ev) {
    if (g.isSeriesLocked()) {
      g.clearSelection();
    } else {
      g.setSelection(g.getSelection(), g.getHighlightSeries(), true);
    }
  };
  g.updateOptions({clickCallback: onclick}, true);
};

var drawSmall = function(url, labels){

  tableArray = [];

  var tableCount = labels.length - 1;
  console.log("Table Count:" + tableCount); 

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
      new Dygraph(
        document.getElementById("table" + i),
        url, {
          title: labels[i+1],
          titleHeight: 20,
	  ylabel: '# of Records',
          yLabelWidth:14,
	  axisLabelWidth:30,
	  drawGrid: true,
	  axisLabelFontSize: 6,
	  pixelsPerLabel: 18,
          labelsDivStyles: { 'textAlign': 'left' },
          labelsDivWidth:120,
          labelsSeparateLines: true,
          legend: 'follow',
	  rightGap: 5,
          visibility: visibility  
        }
      )
    );
  }
}; 
