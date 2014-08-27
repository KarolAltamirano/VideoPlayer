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
 *          element:     string, // main element where the player will be placed       *
 *          width:       number, // widt of the player                                 *
 *          src:         { mp4: string, webm: string, ogv: string}, // src to videos   *
 *          annotations: [ { time: string, description: string }, { ... }, ... ],      *
 *          useHash:     boolean // use hash in url or no, true / false                *
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
        console.log('Error: set video src variables');
        return false;
    }

    // set variables after the test was passed
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

/***********************************************************************
 * addEvents - event to video, play button, background of play button  *
 ***********************************************************************/

Player.prototype.addEvents = function () {
    // play video by clicking on the video
    this.video.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    // play video by clicking on play button 
    this.videoPlay.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    // play video by clicking on play button faded background
    this.videoBg.onclick = (function (_this) { return function () { _this.playPause(); }; })(this);
    // move progressbar on video time update
    this.video.addEventListener('timeupdate', (function (_this) { return function () { _this.progressBar(); }; })(this));
    // move progress loading bar on video load
    this.video.addEventListener('progress', (function (_this) { return function () { _this.loadProgress(); }; })(this));
    // render annotations hotspots and video thumbnails when video is ready, rewind video according to url
    this.video.addEventListener('loadedmetadata', ( function (_this) { return function () { 
        _this.annotations();
        _this.checkUrl();
    }; })(this) );
    // rewind video on beginning when video ends
    this.video.addEventListener('ended', (function (_this) { return function () { _this.onVideoEnd(); }; })(this));
};

/***********************************************************************
 * cssStyle - set width of the video and video container element       *
 ***********************************************************************/

Player.prototype.cssStyle = function () {
    this.playerBox.style.position = 'relative';
    this.playerBox.style.width = this.width + 'px';
    this.video.style.width = this.width + 'px';
};

/***********************************************************************
 * template - template of video player                                 *
 ***********************************************************************/

Player.prototype.template = function (mp4, webm, ogv) {
    var playerTemplate,  // 
        timeStamp;       // time stamp to disable cache 

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

/***********************************************************************
 * annotations - create highspots on progressbar and create annotation *
 *               boxes with description and thumbnails                 *
 ***********************************************************************/

Player.prototype.annotations = function () {
    var a,              // splited time in format hh:mm:ss to the array
        seconds,        // position of the hotspon in seconds
        totalTime,      // total duration of the video
        position,       // position of the hotspot in % on timeline
        annotElement,   // parent element of all hotspots on timeline
        annotBoxes,     // parent element of all annotations
        cloneVideo;     // cloned video for thumbnails generation 
    
    annotElement = this.playerBox.getElementsByClassName('VP_annots')[0];
    annotBoxes = this.playerBox.getElementsByClassName('VP_annoutsBoxes')[0];

    if (this.annots !== undefined && Array.isArray(this.annots)) {
        this.annots.forEach( function (e) {
            // calculate time to seconds        
            a = e.time.split(':');
            seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
            totalTime = this.video.duration;

            position = (seconds / totalTime) * 100;

            if (position >= 0 && position <= 100) { // do not show hotspot whose tiem is bigger than video duration
                // render hotspot on progress bar
                annotElement.innerHTML += 
                    '<div class="VP_annotsDots" time="' + seconds + '" style="left: ' + position + '%;"></div>';
            
                // render info box for hotspot with description and thumbnail
                annotBoxes.innerHTML += 
                    '<div class="VP_annotsOneBox" id="VP_' + this.element + '-' + seconds + '" style="left: ' + (position - 1.5) + '%" ' +
                        'time="' + seconds + '">' + 
                        '<span></span>' +
                        '<hr>' +
                        e.description + 
                    '</div>';
            } else {
                console.log('Error: Hotspot set on wrong time, time:' + e.time);
            }
        }, this);
    }
    // events for rewinding video to hotspot, events to show / hide hotspot
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

/***********************************************************************
 * showThumbs - generate thumbnails                                    *
 ***********************************************************************/

Player.prototype.showThumbs = function (cloneVideo, counter, repeat) {
    var maxCounter, // number of hotspots
        annotBoxes, // element of one annotation
        that;       // use to address "this" in callback function
    
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
        if (!repeat) // safari fix, skip first generated thumbnail
            counter++;

        that.showThumbs(cloneVideo, counter, false); // call until counter >= maxCounter
    });

};

/***********************************************************************
 * createCopyVideo - clone video element to use for generating thumbs  *
 ***********************************************************************/

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

/***********************************************************************
 * captureImage - capture one frame from the video                     *
 ***********************************************************************/

Player.prototype.captureImage = function (video, element) {
    var canvas; // create canvas for capturing one frame from the video

    canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 100;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    var img = document.createElement("img");
    img.src = canvas.toDataURL();
    $(element).children('span').html(img);
};

/***********************************************************************
 * changeCurrentTime - rewind to the new position with animations      *
 ***********************************************************************/

Player.prototype.changeCurrentTime = function (time, fade) {
    var fadeBox, // element used to dispaly "loading..." message and fade in and out the video
        that,    // variable used to address "this" in callback function
        dot,     // main dot on progressbar
        bar;     // progressbar

    // animate progressbar and main dot on video rewinding
    dot = this.playerBox.getElementsByClassName('VP_dot')[0];
    bar = this.playerBox.getElementsByClassName('VP_progressBarIn')[0];
    $(dot).addClass('VP_transition');
    $(dot).on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
        $(dot).removeClass('VP_transition');
        $(dot).off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
    });

    $(bar).addClass('VP_transition');
    $(bar).on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
        $(bar).removeClass('VP_transition');
        $(bar).off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
    });

    // if fade is enabled fade out and in video during rewinding 
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

/***********************************************************************
 * playBackPosition - rewind on progress bar click                     *
 ***********************************************************************/

Player.prototype.playBackPosition = function (e) {

    var timePlayBack,   // timestamp of the hotspot in seconds
        url,            // new url to push
        oldUrl,         // current url before change
        parsed,         // parsed url
        testLast,       // test if there is slash "/" in the end of the url
        clickPosition,  // position of the click to detect where to rewind video
        totalWidth,     // width od the progress bar
        currentPosPerc, // click position in % in the progress bar
        videoLength,    // total video duration
        newVideoPos;    // new position in seconds where to rewind the video
    
    if (e.target !== e.currentTarget) {  // clicked on the hotspot dot
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
        // calculate where to move according to click position
        clickPosition = e.pageX - $(e.currentTarget).offset().left;
        totalWidth = $(e.currentTarget).width();
        currentPosPerc = (100 / totalWidth) * clickPosition;
        videoLength = this.video.duration
        newVideoPos = (videoLength / 100) * currentPosPerc;
        
        // rewind to new position
        this.changeCurrentTime(newVideoPos, true);
    } 
};

/***********************************************************************
 * checkUrl - on page load check video time stamp in url               *
 ***********************************************************************/

Player.prototype.checkUrl = function () {
    var url,     // actual url
        parsed,  // parsed url
        time;    // timestamp of actual video position in url

    if (this.useHash) { // used hash in url
        url = window.location.hash;
        parsed = url.split('-');
        if (parsed[0] == '#vpvideo') {
            if (parsed[1] == this.element) {
                time = parseInt(parsed[2]);
                if (time > 0 && time <= this.video.duration) {
                    this.video.currentTime = time;
                }
            }
        }
    } else { // hash not used in url
        url = window.location.pathname;
        parsed = url.split("/");
        parsed = parsed.pop().split("-");
        if (parsed[0] == 'vpvideo') { // there is a video tag in url
            if (parsed[1] == this.element) {
                time = parseInt(parsed[2]);
                if (time > 0 && time <= this.video.duration) {
                    this.video.currentTime = time;
                }
            }
        }
    }
};

/***********************************************************************
 * annotOver - show hotspot details on mouse over                      *
 ***********************************************************************/

Player.prototype.annotOver = function (e) {
    var timePlayBack, 
        boxId, 
        annotsBox;

    if (e.target !== e.currentTarget) {
        timePlayBack = e.target.getAttribute('time');
        
        boxId = 'VP_' + this.element + '-' + timePlayBack;
        
        annotsBox = document.getElementById(boxId);
        $(annotsBox).stop().fadeIn();
    }
};

/***********************************************************************
 * annotOut - hide hotspot details on mouse out                        *
 ***********************************************************************/

Player.prototype.annotOut = function (e) {
    var timePlayBack, 
        boxId, 
        annotsBox;

    if (e.target !== e.currentTarget) {
        timePlayBack = e.target.getAttribute('time');
        
        boxId = 'VP_' + this.element + '-' + timePlayBack;
        
        annotsBox = document.getElementById(boxId);
        $(annotsBox).stop().fadeOut();
    }
};

/***********************************************************************
 * PlayPause                                                           *
 ***********************************************************************/

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

/***********************************************************************
 * loadProgress - render loading progress bar                          *
 ***********************************************************************/

Player.prototype.loadProgress = function () {
    var bar, actualPos;

    bar = this.playerBox.getElementsByClassName('VP_progressBarLoad')[0];

    if(this.video.buffered.length != 0)
        actualPos = (this.video.buffered.end(0) / this.video.duration) * 100;
    else
        actualPos = (0 / this.video.duration) * 100;

    bar.style.width = actualPos + '%';
};

/***********************************************************************
 * progressBar                                                         *
 ***********************************************************************/

Player.prototype.progressBar = function () {
    var bar, actualPos, dot;
    dot = this.playerBox.getElementsByClassName('VP_dot')[0];
    bar = this.playerBox.getElementsByClassName('VP_progressBarIn')[0];
    actualPos = (this.video.currentTime / this.video.duration) * 100;
    bar.style.width = actualPos + '%';
    dot.style.left = actualPos + '%';
};

/***********************************************************************
 * onVideoEnd                                                          *
 ***********************************************************************/

Player.prototype.onVideoEnd = function () {
    $(this.videoPlay).stop().fadeIn();
    $(this.videoBg).stop().fadeIn();
    this.changeCurrentTime(0, true);
    this.video.pause();
};
