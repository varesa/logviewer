/**
 * Created by esa on 25.9.2014.
 */

/* Properties */

var logsUrl = "http://webroot.finbit.dy.fi/logs/"
var logSuffix = ".log"

var FPS = 30;

var topbarHeight = 64;
var buttonTextMargin = 16;
var topbarButtonWidth = 512;

/* Constants (do not touch) */

var X = 0;
var Y = 1;

/* Program state */

// Log variables

var loading = true;

var currentLogName = "";
var currentLogContents = "";

var nextLogName;
var prevLogName;

var logBegin;
var logEnd;
var screenBegin;
var screenEnd;

// Graphics variables

var canvasWidth;
var canvasHeight;

var graphMargin = 32;


/* "Main" */

$(document).ready(function() {
    setLog(getCurrentName());

    setInterval(draw, 1000/FPS);
    //draw();

    $("#canv").mousedown(function(e) {
        var x = e.offsetX;
        var y = e.offsetY;

        if(0 < x && x < topbarButtonWidth && 0 < y && y < topbarHeight) {
            setLog(getPrevLogName(currentLogName));
        }

        if(canvasWidth - topbarButtonWidth < x && x < canvasWidth && 0 < y && y < topbarHeight) {
            setLog(getNextLogName(currentLogName));
        }
    });
})

