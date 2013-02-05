function startTime() {
    var currentTime = new Date()

    var year = currentTime.getFullYear();
    var month = currentTime.getMonth();
    var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
    var d = currentTime.getDate();
    var day = currentTime.getDay();
    var days = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat');
    var fdays = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    if (minutes < 10) minutes = "0" + minutes
    var suffix = "AM";
    if (hours >= 12) {
        suffix = "PM";
        hours = hours - 12;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (hours == 0) {
        hours = 12;
    }
    thetime = hours + ":" + minutes + " " + suffix;
    document.getElementById('time').innerHTML = thetime;

    t = setTimeout(function () {
        startTime()
    }, 500);
}