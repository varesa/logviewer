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

var graphMargin = 48;

var mouseLastX;
var mouseIsDown = false;


/* "Main" */

$(document).ready(function() {
    setLog(getCurrentName());

    setInterval(draw, 1000/FPS);
    //draw();

    $("#canv").mousedown(function(e) {
        var x = e.offsetX;
        var y = e.offsetY;

        if(0 < y && y < topbarHeight) {
            if(0 < x && x < topbarButtonWidth) {
                setLog(getPrevLogName(currentLogName));
            }

            if(canvasWidth - topbarButtonWidth < x && x < canvasWidth) {
                setLog(getNextLogName(currentLogName));
            }
        } else {
            mouseIsDown = true;
        }
    });

    $("#canv").mouseup(function() {
        mouseIsDown = false;
    });

    $("#canv").mousemove(function (e) {
        if(mouseIsDown) {
            var deltaX = e.offsetX - mouseLastX;
            var movementPercentage = deltaX / (canvasWidth - 2*graphMargin);
            var movementTime = movementPercentage * (screenEnd - screenBegin);
            screenBegin -= movementTime;
            screenEnd -= movementTime;
        }
        mouseLastX = e.offsetX;
    });

    $("#canv").mousewheel(function(e) {
        var currentScaleFactor = (screenEnd-screenBegin)/(logEnd-logBegin);
        var newScaleFactor = currentScaleFactor * (1 - e.deltaY/100);

        if (newScaleFactor > 1.25) newScaleFactor = 1.25;
        if (newScaleFactor < 0.05) newScaleFactor = 0.05;

        var newScreenRange = (logEnd-logBegin) * newScaleFactor;

        var graphWidth = canvasWidth - 2 * graphMargin;
        var graphMouseX = e.offsetX - graphMargin;
        var mouseCursorTime = screenBegin + (graphMouseX/graphWidth) * (screenEnd - screenBegin);

        var newMouseTimeOffset = newScreenRange * (graphMouseX/graphWidth);

        screenBegin = mouseCursorTime - newMouseTimeOffset;
        screenEnd = screenBegin+newScreenRange;
    })
})

