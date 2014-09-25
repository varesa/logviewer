/**
 * Created by esa on 25.9.2014.
 */

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

function updateLimits() {
    logArray = currentLogContents.trim().split("\n");
    logBegin = parseInt(logArray[0].split(": ")[1]);
    logEnd = parseInt(logArray[logArray.length-1].split(": ")[1]);

    screenBegin = logBegin;
    screenEnd = logEnd;
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

        updateLimits();
        loading = false;
    }, 500);
}