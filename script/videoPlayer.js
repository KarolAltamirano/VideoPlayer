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

    playerTemplate = this.template(input.src.mp4, input.src.webm, input.src.ogv)

    this.playerBox = document.getElementById(input.element);

    this.playerBox.innerHTML = playerTemplate;



    this.video = this.playerBox.getElementsByTagName('video')[0];
    this.videoPlay = this.playerBox.getElementsByClassName('playButton')[0];
    this.videoBg = this.playerBox.getElementsByClassName('playBg')[0];
    
    this.addEvents();

    this.playerBox.style.width = input.width + 'px';
    this.video.style.width = input.width + 'px';
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
                '<div class="anot"></div>' +
            '</div>' +
        '</div>';
    return playerTemplate;
};

Player.prototype.annotations = function (annot) {
    
};

Player.prototype.addEvents = function () {
    this.video.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.videoPlay.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.videoBg.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.video.addEventListener('timeupdate', (function (_this) { return function () { _this.progressBar(); }; })(this));
    this.video.addEventListener('progress', (function (_this) { return function () { _this.loadProgress(); }; })(this));
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


