document.addEventListener('DOMContentLoaded', function () {
    var player = new Player({
        element: 'video_1', 
        width: 700,
        // height: 500,
        src: {
            mp4:  '/videos/trailer.mp4',
            webm: '/videos/trailer.webm',
            ogv:  '/videos/trailer.ogv'
        },
        annotations: [
            {
                time: '00:00:05',
                description: 'Ceteros omittantur has cu. An reque ceteros conclusionemque eam.'
            },
            {
                time: '00:00:25',
                description: 'Ceteros omittantur has cu. An reque ceteros conclusionemque eam.'
            },
            {
                time: '00:00:35',
                description: 'Debet ocurreret id pri, brute solet nullam cu mea. Inani aperiam duo cu, cum pertinax atomorum in.'
            },
            {
                time: '00:00:45',
                description: 'Mel ad eius tritani, ius ut rebum mollis debitis, ea nec homero vocibus referrentur.'
            }
        ],
        useHash: true,
        onlyHotspots: false
    });
});
