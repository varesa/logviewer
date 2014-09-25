/**
 * Created by esa on 25.9.2014.
 */

/* Graphics functions */

function createContext(canvas){
    return canvas[0].getContext("2d");
}

function drawTopbar(context) {
// Top separator line
    context.beginPath();
    context.moveTo(0, topbarHeight);
    context.lineTo(canvasWidth, topbarHeight);
    context.stroke();

    // Loading
    if (loading) {
        context.font = "64px sans-serif";
        context.textAlign = "center";
        context.fillText("Ladataan...", canvasWidth / 2, canvasHeight / 2);
    }

    context.font = "20px sans-serif";

    // Current log name
    context.textAlign = "center";
    context.fillText("Näytetään:" + currentLogName, canvasWidth / 2, topbarHeight / 2);

    // Prev log name
    if (prevLogName) {
        context.textAlign = "left";
        context.fillText("Edellinen: " + prevLogName, 0 + buttonTextMargin, topbarHeight / 2);
    }

    // Next log name
    if (nextLogName) {
        context.textAlign = "right";
        context.fillText("Seuraava: " + nextLogName, canvasWidth - buttonTextMargin, topbarHeight / 2);
    }
}

var ypos;

function drawData(context) {
    var logArray = currentLogContents.trim().split("\n");
    var devices = {};
    for(var i = 0; i < logArray.length; i++) {
        var name = logArray[i].split(": ")[0];
        var time = logArray[i].split(": ")[1];

        if(devices[name] === undefined) {
            devices[name] = [];
        }
        devices[name].push(time);
    }

    ypos = topbarHeight + 32;

    for(var key in devices) {
        context.font = "20px sans-serif";
        context.textAlign = "left";
        context.fillText(key, 0, ypos);
        console.log(key);

        for(var i = 0; i < devices[key].length; i++) {
            var value = parseInt(devices[key][i]);
            if(screenBegin < value && value < screenEnd) {
                var xpos = ((value-screenBegin)/(screenEnd-screenBegin)) * (canvasWidth-2*graphMargin);
                context.fillRect(xpos-2.5, ypos-2.5, 5, 5);
            }
        }


        ypos += 64;
    }
}

function drawScale(context) {
    var beginDate = new Date(screenBegin*1000);
    var endDate = new Date(screenEnd*1000);

    var scaleBegin = new Date(beginDate);
    scaleBegin.setMinutes(0);
    scaleBegin.setSeconds(0);

    var scaleEnd = new Date(endDate);
    scaleEnd.setHours(scaleEnd.getHours()+1);
    scaleEnd.setMinutes(0);
    scaleEnd.setSeconds(0);

    var timeDiff = (scaleEnd - scaleBegin)/1000;

    var xspace = canvasWidth - 2*graphMargin;
    var timepos = 0;

    while(timepos <= timeDiff) {
        var xpos = graphMargin + xspace * (timepos/timeDiff);
        context.beginPath();
        context.moveTo(xpos, ypos);
        context.lineTo(xpos, ypos + 10);
        context.stroke();

        timepos += 3600;
    }
}


function draw(){
    var canvas = $("#canv");
    var context = createContext(canvas);

    canvasWidth = canvas.width();
    canvasHeight = canvas.height();

    canvas.attr("width", canvasWidth + "px");
    canvas.attr("height", canvasHeight + "px");

    drawTopbar(context);
    if(!loading) {
        drawData(context);
        drawScale(context);
    }
}