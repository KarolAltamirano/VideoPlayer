Annotated Interactive HTML5 Video Player
========================================

Getting Started
---------------

Requirements:
    1. jQuery JavaScript library


Configuration
-------------
document.addEventListener('DOMContentLoaded', function () { 

});

Options
-------

element

Type: String
Required





Example config
--------------

document.addEventListener('DOMContentLoaded', function () {
    var player = new Player({
        element: 'video_1', 
        width: 700,
        height: 500,
        src: {
            mp4:  '/videos/video.mp4',
            webm: '/videos/video.webm',
            ogv:  '/videos/video.ogv'
        },
        annotations: [
            {
                time: '00:00:05',
                description: 'Description text'
            },
            {
                .
                .
                .
            },
            .
            .
            .
        ],
        useHash: true,
        onlyHotspots: false
    });
});


Release History
---------------

2014-08-27  v0.1   Initial release
