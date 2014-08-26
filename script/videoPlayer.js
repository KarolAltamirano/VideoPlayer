
var Player = function (id, width) {
    this.playerBox = document.getElementById(id);
    this.video = this.playerBox.getElementsByTagName('video')[0];
    this.videoPlay = this.playerBox.getElementsByClassName('playButton')[0];
    this.videoBg = this.playerBox.getElementsByClassName('playBg')[0];
    
    this.addEvents();
    
    this.playerBox.style.width = width + 'px';
    this.video.style.width = width + 'px';
};

Player.prototype.addEvents = function () {
    this.video.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.videoPlay.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.videoBg.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
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

document.addEventListener('DOMContentLoaded', function () {
    player = new Player('video_1', 500);
});
