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

    // Button vertical lines
    context.beginPath();
    context.moveTo(topbarButtonWidth, 0);
    context.lineTo(topbarButtonWidth, topbarHeight);
    context.stroke();

    context.beginPath();
    context.moveTo(canvasWidth-topbarButtonWidth, 0);
    context.lineTo(canvasWidth-topbarButtonWidth, topbarHeight);
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

    ypos = topbarHeight + 64;

    for(var key in devices) {
        context.font = "20px sans-serif";
        context.textAlign = "left";
        context.fillText(key, 0, ypos-10);

        for(var i = 0; i < devices[key].length; i++) {
            var value = parseInt(devices[key][i]);
            if(screenBegin < value && value < screenEnd) {
                var xpos = graphMargin + ((value-screenBegin)/(screenEnd-screenBegin)) * (canvasWidth-2*graphMargin);
                context.fillRect(xpos-2.5, ypos-2.5, 5, 5);
            }
        }


        ypos += 64;
    }
}

function drawScale(context) {
    var timeDiff = (screenEnd - screenBegin);
    var xspace = canvasWidth - 2*graphMargin;

    var timepos = 0;
    var xposOld;
    var labelSpacing = 1;

    while(timepos <= timeDiff) {
        if((screenBegin + timepos) >= logBegin && (screenBegin + timepos) <= logEnd) {
            var xpos = graphMargin + xspace * (timepos/timeDiff);
            if(xposOld && xpos-xposOld < 0.8) {
                labelSpacing = 12;
            }

            var time = new Date((screenBegin + timepos)*1000);
            if(time.getMinutes() == 0) {
                context.beginPath();
                context.moveTo(xpos, ypos);
                context.lineTo(xpos, ypos + 10);
                context.stroke();

                if(labelSpacing == 1 ||  (labelSpacing == 12 && (time.getHours() == 0 || time.getHours() == 12)) ) {
                    var hourLabel = ("0"+time.getHours()).slice(-2);
                    var labelWidth = context.measureText(hourLabel).width;
                    context.fillText(hourLabel, xpos-labelWidth/2, ypos + 32);
                }

                if(time.getHours() == 0) {
                    var dateLabel = time.getDate() + "." + (time.getMonth()+1);
                    var labelWidth = context.measureText(dateLabel).width;
                    context.fillText(dateLabel, xpos-labelWidth/2, ypos + 64);
                }
            }
        }
        timepos += 60;
        xposOld = xpos;
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