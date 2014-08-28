#Annotated Interactive HTML5 Video Player

##Live demo
[Visit web site with a live demo of the video player](http://video.karolaltamirano.com/)

##Dependencies:
    jQuery JavaScript library

##How to install

###1. Download jQuery library and load it to your html file
```
<script src="/script/jquery-2.1.1.min.js"></script>
```

###2. Download Video Player

####Download js and css files and folder with images:
> 1. css/videoPlayer.css
> 2. script/videoPlayer.js
> 3. img folder

###3. Upload files to your project
> 1. Upload `img` folder to your root directory
> 2. Upload `videoPlayer.css` to `css` folder in your root directory
> 3. Upload `videoPlayer.js` to `script` folder in your root directory

###4. Load css and js file to your html file

```
<link rel="stylesheet" href="/css/videoPlayer.css">
```

    Place `videoPlayer.js` under `jquery.js`
```
<script src="/script/jquery-2.1.1.min.js"></script>
<script src="/script/videoPlayer.js"></script>
```

###5. Create container element for video player in body of your html file

```
<div id="video_1"></div>
```

###6. Create empty js file for Video Player initialization and load it to your html file

```
<script src="/script/app.js"></script>
```

###7. Upload video to your project
    Create folder where you want to storage your videos and upload it there.


###8. Video Initialization 
1. Open empty js file created in 6th step

2. Create event `DOMContentLoaded`, player initialization write into created block
    ```javascript
        document.addEventListener('DOMContentLoaded', function () { 
            /* Video Player initialization */
        });
    ```

3. Create player object

    ```javascript
        var player = new Player({
            element: 'video_1',     /* set id of video container */
            width: 700,             /* set width of the player */
            src: {                  /* set urls to video files */
                mp4:  '/videos/video.mp4',
                webm: '/videos/video.webm',
                ogv:  '/videos/video.ogv'
            },
            annotations: [  /* set time and description of all annotations */
                {
                    time: '00:00:05',
                    description: '...'
                },
                ...
            ],
            useHash: true, /* use hash in url or not */
            onlyHotspots: false /* allow rewinding video only on hotspots */
        });
    ```

4. Done

##Options


####element
Type: `String`

Required

ID of video container in html file


####width
Type: `Number`

Required

Width of the video player in px


####height

Type: `Number`

Default: `auto`

Optional

Height of the video player in px


####src

Type: `Object`

Format:

    ```javascript
    src: {
      mp4: 'url to video in mp4',
      webm: 'url to video in webm',
      ogv:  'url to video in ogv'
    }
    ```

Required

URLs to video


####annotations

Type: `Array of objects`

Format:

    ```javascript
        annotations: [
           {
              time: 'HH:MM:SS',
              description: '...'
           },
           ...
        ]
    ```

Optional


Array of hotspots. Position of the hotspot in `time` and `description` of the hotspot


####useHash

Type: `Boolean`

Default: `false`

If `false` URL will be updated without `#` tag. In this case it is necessary to configure also `.htaccess` file on the server. Example: `/vpvideo-video_1-45`

If `true` hash `#` will be added before video mark in URL. Example: `/#vpvideo-video_1-45`


#####Example of .htaccess
```
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ /index.html [QSA,L,B]
    </IfModule>
```


####onlyHotspots

Type: `Boolean`

Default: `false`

If set to `false` it is possible to go forward and back in video by clicking on hotspots or on any position in the progress bar.

if set to `true` only by clicking on hotspot it is possible to go forward and back in video


##Code example

###HTML
```
    <!DOCTYPE html>
    <html>
    <head>
        <title>Video Player</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="/css/videoPlayer.css">
        <link rel="stylesheet" href="/css/app.css">
        <script src="/script/jquery-2.1.1.min.js"></script>
        <script src="/script/videoPlayer.js"></script>
        <script src="/script/app.js"></script>
    </head>
    <body>
    <div id="content">
        <div id="video_1"></div>
    </div>
    </body>
    </html>
```

###JavaScript
```javascript
    document.addEventListener('DOMContentLoaded', function () {
        var player = new Player({
            element: 'video_1', 
            width: 700,
            src: {
                mp4:  '/videos/trailer.mp4',
                webm: '/videos/trailer.webm',
                ogv:  '/videos/trailer.ogv'
            },
            annotations: [
                {
                    time: '00:00:05',
                    description: 'An reque ceteros conclusionemque eam.'
                },
                {
                    time: '00:00:25',
                    description: 'Ceteros omittantur has cu.'
                },
                {
                    time: '00:00:35',
                    description: 'Debet ocurreret id pri.'
                },
                {
                    time: '00:00:45',
                    description: 'Mel ad eius tritani.'
                }
            ],
            useHash: true,
            onlyHotspots: false
        });
    });
```

##Release History
* 2014-08-28 v0.1 Initial release
