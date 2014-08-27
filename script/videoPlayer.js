/*******************************************************************************
 *                                                                             *
 *  Title:     Video Player                                                    *
 *  Author:    Karol Altamirano                                                *
 *  Version:   0.1                                                             *
 *                                                                             *
 *******************************************************************************/

/***************************************************************************************    
 *                                                                                     *
 * Player - constructor of the player object                                           *
 * Player is global variable to create and manage the player                           *
 *  input =                                                                            *
 *      {                                                                              *
 *          element:     string,                                                       *
 *          width:       number,                                                       *
 *          src:         { mp4: string, webm: string, ogv: string},                    *
 *          annotations: { annotation: { time: string, description: string } },        *
 *          useHash:     boolean                                                       *
 *      }                                                                              *
 *                                                                                     *
 ***************************************************************************************/

var Player = function (input) {
    var playerTemplate;
    // test input variables
    if (input.element === undefined) {
        console.log('Error: set element variable');
        return false;
    }
    if (input.width === undefined) {
        console.log('Error: set width variable');
        return false;
    }
    if (input.src.mp4 === undefined && input.src.webm === undefined && input.src.ogv === undefined) {
        console.log('Error: set video src variable');
        return false;
    }

    // set variables after the test
    if (input.useHash === true) {
        this.useHash = true;
    } else {
        this.useHash = false;
    }

    this.element = input.element;
    this.annots = input.annotations;
    this.width = input.width;
    
    this.mp4  = input.src.mp4;
    this.webm = input.src.webm;
    this.ogv  = input.src.ogv;

    // create player template
    playerTemplate = this.template(this.mp4, this.webm, this.ogv);

    // write template to the page
    this.playerBox = document.getElementById(input.element);
    this.playerBox.innerHTML = playerTemplate;

    // select player elements
    this.video = this.playerBox.getElementsByTagName('video')[0];
    this.videoPlay = this.playerBox.getElementsByClassName('VP_playButton')[0];
    this.videoBg = this.playerBox.getElementsByClassName('VP_playBg')[0];
    
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
    var playerTemplate, timeStamp;

    timeStamp = new Date().getTime();
    playerTemplate =
        '<div class="VP_videoBox">' +
            '<video>' +
                (mp4  !== undefined ? '<source src="' + mp4  + '?' + timeStamp + '" type="video/mp4">'  : '') +
                (webm !== undefined ? '<source src="' + webm + '?' + timeStamp + '" type="video/webm">' : '') +
                (ogv  !== undefined ? '<source src="' + ogv  + '?' + timeStamp + '" type="video/ogg">'  : '') +
                'Your browser does not support the video player.' +
            '</video>' +
            '<div class="VP_playButton"></div>' +
            '<div class="VP_playBg"></div>' +
            '<div class="VP_fadeVideo"><span>Loading ...</span></div>' +
        '</div>' +
        '<div class="VP_control">' +
            '<div class="VP_progressBar">' +
                '<div class="VP_progressBarIn"></div>' +
                '<div class="VP_progressBarLoad"></div>' +
                '<div class="VP_progressBarBase"></div>' +
                '<div class="VP_dot"></div>' +
                '<div class="VP_annots"></div>' +
            '</div>' +
            '<div class="VP_annoutsBoxes"></div>' +
        '</div>';
    return playerTemplate;
};

Player.prototype.annotations = function () {
    var a,              // splited time in format hh:mm:ss to the array
        seconds,        // position of the hotspon in seconds
        totalTime,      // total duration of the video
        position,       // position of the hotspot in % on timeline
        annotElement,   // parent element of all hotspots on timeline
        annotBoxes,     // parent element of all annotations
        cloneVideo;
    
    annotElement = this.playerBox.getElementsByClassName('VP_annots')[0];
    annotBoxes = this.playerBox.getElementsByClassName('VP_annoutsBoxes')[0];

    this.annots.forEach( function (e) {
        // calculate time to seconds        
        a = e.time.split(':');
        seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
        totalTime = this.video.duration;

        position = (seconds / totalTime) * 100;

        annotElement.innerHTML += 
            '<div class="VP_annotsDots" time="' + seconds + '" style="left: ' + position + '%;"></div>';
    
        annotBoxes.innerHTML += 
            '<div class="VP_annotsOneBox" id="VP_' + this.element + '-' + seconds + '" style="left: ' + (position - 1.5) + '%" time="' + seconds + '">' + 
                '<span></span>' +
                '<hr>' +
                e.description + 
            '</div>';
    }, this);
    
    annotElement.addEventListener('click', (function (_this) { return function (e) { _this.playBackPosition(e); }; })(this));
    annotElement.addEventListener('mouseover', (function (_this) { return function (e) { _this.annotOver(e); }; })(this));
    annotElement.addEventListener('mouseout', (function (_this) { return function (e) { _this.annotOut(e); }; })(this));

    // clone video element and generate thumbnails
    cloneVideo = this.createCopyVideo(this.mp4, this.webm, this.ogv);    
    cloneVideo.load();
    cloneVideo.addEventListener('loadeddata', ( function (_this) { return function () { 
            _this.showThumbs(cloneVideo, 0, true);
        }; })(this) 
    );
};

Player.prototype.showThumbs = function (cloneVideo, counter, repeat) {
    var maxCounter,
        annotBoxes,
        that;
    
    maxCounter = this.playerBox.getElementsByClassName('VP_annoutsBoxes')[0].getElementsByTagName('div').length;

    if (counter >= maxCounter) {
        cloneVideo.currentTime = 0;
        return;
    }

    annotBoxes = this.playerBox.getElementsByClassName('VP_annotsOneBox')[counter];
    cloneVideo.currentTime = annotBoxes.getAttribute('time');
    that = this;

    $(cloneVideo).on('seeked', function () {
        $(cloneVideo).off('seeked');
        that.captureImage(cloneVideo, annotBoxes);
        if (!repeat) // safari fix
            counter++;

        that.showThumbs(cloneVideo, counter, false);
    });

};

Player.prototype.createCopyVideo = function (mp4, webm, ogv) {
    var video;

    video = document.createElement('video');
    timeStamp = new Date().getTime();

    video.innerHTML = 
        (mp4  !== undefined ? '<source src="' + mp4  + '?' + timeStamp + '" type="video/mp4">'  : '') +
        (webm !== undefined ? '<source src="' + webm + '?' + timeStamp + '" type="video/webm">' : '') +
        (ogv  !== undefined ? '<source src="' + ogv  + '?' + timeStamp + '" type="video/ogg">'  : '');

    return video;
};

Player.prototype.captureImage = function (video, element) {
    var canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 100;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    var img = document.createElement("img");
    img.src = canvas.toDataURL();
    $(element).children('span').html(img);
};

Player.prototype.changeCurrentTime = function (time, fade) {
    var fadeBox, that, dot, bar;

    dot = this.playerBox.getElementsByClassName('VP_dot')[0];
    bar = this.playerBox.getElementsByClassName('VP_progressBarIn')[0];
    $(dot).addClass('VP_transition');
    $(dot).on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
        $(dot).removeClass('VP_transition');
    });

    $(bar).addClass('VP_transition');
    $(bar).on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
        $(bar).removeClass('VP_transition');
    });

    if (fade == true) {
        fadeBox = this.playerBox.getElementsByClassName('VP_fadeVideo')[0];
        
        that = this;
        $(this.video).animate({volume: 0}, 200);

        $(fadeBox).stop().fadeIn(200, function () { 
            that.video.currentTime = time;
            $(that.video).on('seeked', function () {
                $(fadeBox).stop().fadeOut(500);
                $(that.video).animate({volume: 1}, 1000);
                $(that.video).off('seeked');
            });
        });     
    } else {
        this.video.currentTime = time;
    }
};

Player.prototype.playBackPosition = function (e) {

    var timePlayBack, url, oldUrl, parsed, testLast, bar, actualPos, dot, fadeBox, that, clickPosition, totalWidth, currentPosPerc, videoLength,
        newVideoPos;
    
    if (e.target !== e.currentTarget) {  // clicked on the hotspot dot
        // add transition to time bar

        timePlayBack = e.target.getAttribute('time');

        this.changeCurrentTime(timePlayBack, true);

        // check and change url
        if (this.useHash) { // used hash in url
            url = window.location.pathname + '#vpvideo-' + this.element + '-' + timePlayBack;
        } else { // hash not used in url
            testLast = window.location.pathname.slice(-1);
            if (testLast !== '/') { // last character in url is not slash
                oldUrl = window.location.pathname;
                parsed = oldUrl.split("/");
                parsed = parsed.pop().split("-");
                if (parsed[0] == 'vpvideo') { // there is a video tag in url
                    url = 'vpvideo-' + this.element + '-' + timePlayBack;
                } else {
                    url = oldUrl + '/vpvideo-' + this.element + '-' + timePlayBack;
                }
            } else {
                url = window.location.pathname + 'vpvideo-' + this.element + '-' + timePlayBack;
            }
        }

        window.history.replaceState({p: url}, '', url);
    } else { // click on the progress bar
        clickPosition = e.pageX - $(e.currentTarget).offset().left;
        totalWidth = $(e.currentTarget).width();
        currentPosPerc = (100 / totalWidth) * clickPosition;
        videoLength = this.video.duration
        newVideoPos = (videoLength / 100) * currentPosPerc;
        //this.video.currentTime = newVideoPos;
        console.log('click:' + newVideoPos);
        this.changeCurrentTime(newVideoPos, true);
    } 
};

Player.prototype.checkUrl = function () {
    var url, parsed, time;

    if (this.useHash) { // used hash in url
        url = window.location.hash;
        parsed = url.split('-');
        if (parsed[0] == '#vpvideo') {
            if (parsed[1] == this.element) {
                time = parseInt(parsed[2]);
                this.video.currentTime = time;
            }
        }
    } else { // hash not used in url
        url = window.location.pathname;
        parsed = url.split("/");
        parsed = parsed.pop().split("-");
        if (parsed[0] == 'vpvideo') { // there is a video tag in url
            if (parsed[1] == this.element) {
                time = parseInt(parsed[2]);
                this.video.currentTime = time;
            }
        }
    }
};

Player.prototype.annotOver = function (e) {
    var timePlayBack, boxId, annotsBox;
    if (e.target !== e.currentTarget) {
        timePlayBack = e.target.getAttribute('time');
        
        boxId = 'VP_' + this.element + '-' + timePlayBack;
        
        annotsBox = document.getElementById(boxId);
        $(annotsBox).stop().fadeIn();
    }
};

Player.prototype.annotOut = function (e) {
    var timePlayBack, boxId, annotsBox;
    if (e.target !== e.currentTarget) {
        timePlayBack = e.target.getAttribute('time');
        
        boxId = 'VP_' + this.element + '-' + timePlayBack;
        
        annotsBox = document.getElementById(boxId);
        $(annotsBox).stop().fadeOut();
    }
};

Player.prototype.addEvents = function () {
    this.video.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.videoPlay.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.videoBg.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    this.video.addEventListener('timeupdate', (function (_this) { return function () { _this.progressBar(); }; })(this));
    this.video.addEventListener('progress', (function (_this) { return function () { _this.loadProgress(); }; })(this));

    this.video.addEventListener('loadedmetadata', ( function (_this) { return function () { 
            _this.annotations();
            _this.checkUrl();
        }; })(this) 
    );

    this.video.addEventListener('ended', (function (_this) { return function () { _this.onVideoEnd(); }; })(this));
};

Player.prototype.playPause = function () {
    if(this.video.paused) {
        $(this.videoPlay).stop().fadeOut();
        $(this.videoBg).stop().fadeOut();
        this.video.play();
    }
    else {
        $(this.videoPlay).stop().fadeIn();
        $(this.videoBg).stop().fadeIn();
        this.video.pause();
    }
};

Player.prototype.loadProgress = function () {
    var bar, actualPos;

    bar = this.playerBox.getElementsByClassName('VP_progressBarLoad')[0];

    if(this.video.buffered.length != 0)
        actualPos = (this.video.buffered.end(0) / this.video.duration) * 100;
    else
        actualPos = (0 / this.video.duration) * 100;

    bar.style.width = actualPos + '%';
};

Player.prototype.progressBar = function () {
    var bar, actualPos, dot;
    dot = this.playerBox.getElementsByClassName('VP_dot')[0];
    bar = this.playerBox.getElementsByClassName('VP_progressBarIn')[0];
    actualPos = (this.video.currentTime / this.video.duration) * 100;
    bar.style.width = actualPos + '%';
    dot.style.left = actualPos + '%';

};

Player.prototype.onVideoEnd = function () {
    $(this.videoPlay).stop().fadeIn();
    $(this.videoBg).stop().fadeIn();
    this.changeCurrentTime(0, true);
    this.video.pause();
};
