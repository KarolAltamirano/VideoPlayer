var Player = function (input) {
    var playerTemplate;
    /*
    input = 
        {
            element: string, 
            width: number, 
            src: { mp4: string, webm: string, ogv: string},
            annotations: { annotation: { time: string, description: string } }
        }
    */

    // process input data
    this.element = input.element;
    this.annots = input.annotations;
    this.width = input.width;

    // create player template
    playerTemplate = this.template(input.src.mp4, input.src.webm, input.src.ogv)

    // write template to the doc
    this.playerBox = document.getElementById(input.element);
    this.playerBox.innerHTML = playerTemplate;

    // select player elements
    this.video = this.playerBox.getElementsByTagName('video')[0];
    this.videoPlay = this.playerBox.getElementsByClassName('playButton')[0];
    this.videoBg = this.playerBox.getElementsByClassName('playBg')[0];
    
    // setting player
    this.addEvents();
    this.cssStyle();
};

Player.prototype.cssStyle = function () {
    this.playerBox.style.position = 'relative';
    this.playerBox.style.width = this.width + 'px';
    this.video.style.width = this.width + 'px';
};

Player.prototype.template = function (mp4, webm, ogv) {
    var playerTemplate;
    playerTemplate =
        '<div class="videoBox">' +
            '<video>' +
                '<source src="' + mp4 + '" type="video/mp4">' +
                '<source src="' + webm + '" type="video/webm">' +
                '<source src="' + ogv + '" type="video/ogg">' +
                'Your browser does not support the video player.' +
            '</video>' +
            '<div class="playButton"></div>' +
            '<div class="playBg"></div>' +
        '</div>' +
        '<div class="control">' +
            '<div class="progressBar">' +
                '<div class="progressBarIn"></div>' +
                '<div class="ProgressBarLoad"></div>' +
                '<div class="progressBarBase"></div>' +
                '<div class="dot"></div>' +
                '<div class="annots"></div>' +
            '</div>' +
            '<div class="annoutsBoxes"></div>' +
        '</div>' +
        '<canvas id="canvasid" width="100" height="100"></canvas>';
    return playerTemplate;
};

Player.prototype.annotations = function () {
    var a, seconds, totalTime, position, annotElement, annotsDots, annotBoxes, oneAnnotDes;
    
    annotBoxes = this.playerBox.getElementsByClassName('annoutsBoxes')[0];

    this.annots.forEach( function (e) {
        // calculate time to seconds        
        a = e.time.split(':');
        seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
        totalTime = this.video.duration;

        position = (seconds / totalTime) * 100;

        annotElement = this.playerBox.getElementsByClassName('annots')[0];
        annotElement.innerHTML = annotElement.innerHTML + '<div class="annotsDots" time="' + seconds + '" style="left: ' + position + '%;"></div>';

        annotBoxes.innerHTML += '<div id="' + this.element + '-' + seconds + '" style="left: ' + position + '%">' + e.description + '</div>';
    }, this);
    
    annotsDots = this.playerBox.getElementsByClassName('annots')[0];
    annotsDots.addEventListener('click', (function (_this) { return function (e) { _this.playBackPosition(e); }; })(this));
    annotsDots.addEventListener('mouseover', (function (_this) { return function (e) { _this.annotOver(e); }; })(this));
    annotsDots.addEventListener('mouseout', (function (_this) { return function (e) { _this.annotOut(e); }; })(this));    
};

Player.prototype.playBackPosition = function (e) {
    var timePlayBack, url;
    if (e.target !== e.currentTarget) {  // clicked on the annots dot
        timePlayBack = e.target.getAttribute('time');
        this.video.currentTime = timePlayBack;
        url = 'video-' + this.element + '-' + timePlayBack;
        window.history.replaceState({p: url}, '', url);
    }
};

Player.prototype.annotOver = function (e) {
    var timePlayBack, boxId, annotsBox;
    if (e.target !== e.currentTarget) {
        timePlayBack = e.target.getAttribute('time');
        
        boxId = this.element + '-' + timePlayBack;
        
        annotsBox = document.getElementById(boxId);
        annotsBox.style.display = 'block';
    }
};

Player.prototype.annotOut = function (e) {
    var timePlayBack, boxId, annotsBox;
    if (e.target !== e.currentTarget) {
        timePlayBack = e.target.getAttribute('time');
        
        boxId = this.element + '-' + timePlayBack;
        
        annotsBox = document.getElementById(boxId);
        annotsBox.style.display = 'none';
    }
};

Player.prototype.addEvents = function () {
    this.video.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.videoPlay.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.videoBg.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.video.addEventListener('timeupdate', (function (_this) { return function () { _this.progressBar(); }; })(this));
    this.video.addEventListener('progress', (function (_this) { return function () { _this.loadProgress(); }; })(this));

    this.video.addEventListener('loadedmetadata', ( 
        function (_this) { 
            return function () { 
                _this.annotations();
                _this.checkUrl();
            }; 
        })(this)
    );
};

Player.prototype.checkUrl = function () {
    var url, parsed, time;
    url = window.location.pathname;
    parsed = url.split("/");
    parsed = parsed.pop().split("-");
    if (parsed[1] == this.element) {
        time = parseInt(parsed[2]);
        this.video.currentTime = time;
    }
};

Player.prototype.playPause = function () {
    if(this.video.paused) {
        this.videoPlay.style.display = 'none';
        this.videoBg.style.display = 'none';
        this.video.play();
    }
    else {
        this.video.pause();
        this.videoPlay.style.display = 'block';
        this.videoBg.style.display = 'block';
    }
};

Player.prototype.loadProgress = function () {
    var bar, actualPos;

    bar = this.playerBox.getElementsByClassName('ProgressBarLoad')[0];
    actualPos = (this.video.buffered.end(0) / this.video.duration) * 100;
    bar.style.width = actualPos + '%';
};

Player.prototype.progressBar = function () {
    var bar, actualPos, dot;
    dot = this.playerBox.getElementsByClassName('dot')[0];
    bar = this.playerBox.getElementsByClassName('progressBarIn')[0];
    actualPos = (this.video.currentTime / this.video.duration) * 100;
    bar.style.width = actualPos + '%';
    dot.style.left = actualPos + '%';

};
