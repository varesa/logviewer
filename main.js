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

var loading = true;

var currentLogName = "";
var currentLogContents = "";

var nextLogName;
var prevLogName;

var canvasWidth;
var canvasHeight;

/* Log manipulation */

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
  var dayOfYear = ((today - onejan + 86400000)/86400000);
  return Math.ceil(dayOfYear/7)
};

function getCurrentName() {
    var year = new Date().getFullYear();
    var week = new Date().getWeek();

    return year + "-" + week + logSuffix;
}

function getNextLogName(ref) {
    var date = ref.split(".")[0];

    var year = parseInt(date.split("-")[0]);
    var week = parseInt(date.split("-")[1]);

    if(week < 53) {
        week++;
    } else {
        week = 1;
        year++;
    }

    return year + "-" + week + ".log"
}

/*
 * HUOM viikkoja voi olla 52 tai 53. TODO: ota huomioon
 */

function getPrevLogName(ref) {
    var date = ref.split(".")[0];

    var year = parseInt(date.split("-")[0]);
    var week = parseInt(date.split("-")[1]);

    if(week > 1) {
        week--;
    } else {
        week = 53;
        year--;
    }

    return year + "-" + week + ".log"
}

function getLogUrl(name) {
    return logsUrl + name;
}

function getLog(name) {
    var request = $.ajax({
            url: getLogUrl(name),
            type: "GET",
            crossDomain: true,
            async:false
        });

    if(request.status == 200) {
        return request.responseText;
    } else {
        return false;
    }
}

function setLog(logName) {
    loading = true;
    draw();

    setTimeout(function() {
        currentLogContents = getLog(logName);
        currentLogName = logName;

        if(getLog(getNextLogName(currentLogName))) {
            nextLogName = getNextLogName(currentLogName);
        } else {
            nextLogName = false;
        }

        if(getLog(getPrevLogName(currentLogName))) {
            prevLogName = getPrevLogName(currentLogName);
        } else {
            prevLogName = false;
        }

        loading = false;
    }, 500);
}

/* Graphics functions */

function createContext(canvas){
    return canvas[0].getContext("2d");
}

function draw(){
    var canvas = $("#canv");
    var context = createContext(canvas);

    canvasWidth = canvas.width();
    canvasHeight = canvas.height();

    canvas.attr("width", canvasWidth + "px");
    canvas.attr("height", canvasHeight + "px");

    // Top separator line
    context.beginPath();
    context.moveTo(0, topbarHeight);
    context.lineTo(canvasWidth, topbarHeight);
    context.stroke();

    // Loading
    if(loading) {
        context.font = "64px sans-serif";
        context.textAlign = "center";
        context.fillText("Ladataan...", canvasWidth/2, canvasHeight/2);
    }

    context.font = "20px sans-serif";

    // Current log name
    context.textAlign = "center";
    context.fillText("Näytetään:" + currentLogName, canvasWidth/2, topbarHeight/2);

    // Prev log name
    if(prevLogName) {
        context.textAlign = "left";
        context.fillText("Edellinen: " + prevLogName, 0 + buttonTextMargin, topbarHeight/2);
    }

    // Next log name
    if(nextLogName) {
        context.textAlign = "right";
        context.fillText("Seuraava: " + nextLogName, canvasWidth - buttonTextMargin, topbarHeight/2);
    }

}

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

