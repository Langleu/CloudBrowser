$(document).ready(function() {
    const socket = io.connect('http://localhost:8000');

    socket.on('requestScreen', function(data) {
        console.log(data);
        console.log(window.innerHeight);
        console.log(window.innerWidth);
        socket.emit('windowSize', {
            h: window.innerHeight,
            w: window.innerWidth
        });
    });

    socket.emit('hello', 'world');

    let blobs = [];

    socket.on('news', function(data) {
        /**
        console.log(data.data);

        $("#video").remove();

        var video = $('<video />', {
            id: 'video',
            src: data.data,
            type: 'video/webm',
            controls: true
        });
        video.appendTo($('#videoContainer'));

        */

        blobs.push(new Uint8Array(str2ab(data.data)));

        //let blob = new Blob([new Uint8Array(str2ab(data.data))], { type: 'video/webm' });
        let blob = new Blob(blobs, { type: 'video/webm' });
        var urlCreator = window.URL || window.webkitURL;
        var url = urlCreator.createObjectURL(blob);

        $("#video").remove();

        var video = $('<video />', {
            id: 'video',
            src: url,
            type: 'video/webm',
            controls: true
        });
        video.appendTo($('#videoContainer'));

        /**
        var superBuffer = new Blob([data.data], { type: 'video/webm' })

        var urlCreator = window.URL || window.webkitURL;
        var url = urlCreator.createObjectURL(superBuffer);
 */
        //let video = document.querySelector('#video');
        //let videoSrc = document.querySelector('#videoSrc');
        //let video = videojs('video');

        //video.src({ type: "video/webm", src: data.data });
        //video.load();
        //video.pause();
        //console.log(url);
        //videoSrc.src = data.data;
        //video.load();
        //video.play();

        //console.log(data.data);

        /**
        var arrayBufferView = new Uint8Array(data.data);
        var blob = new Blob([arrayBufferView], {
            type: "image/jpeg"
        });
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);
        console.log(imageUrl);
        var img = document.querySelector("#photo");
        img.src = imageUrl;
         */


        //var img = document.querySelector("#photo");
        //img.src = `data:image/png;base64,${data.data}`;

    });

    function printMousePos(event) {
        if (!uiElementFocused)
            socket.emit('click', {
                x: event.clientX,
                y: event.clientY - 60
            });
    }

    document.addEventListener("click", printMousePos);

    $(document).keyup(function(e) {
        if (!uiElementFocused)
            socket.emit('keypress', e.key);
    });


    $(window).bind('mousewheel', function(event) {
        if (event.originalEvent.wheelDelta >= 0) {
            console.log('Scroll up');
            if (!uiElementFocused)
                socket.emit('scroll', "up");
        } else {
            if (!uiElementFocused)
                socket.emit('scroll', "down");
            console.log('Scroll down');
        }
    });

    let uiElementFocused = false;

    $('#uri-text').focus((e) => {
        console.log('focus');
        uiElementFocused = true;
    });

    $('#uri-text').focusout((e) => {
        console.log('no focus');
        uiElementFocused = false;
    });

    $("#uri").submit(function(event) {
        socket.emit('uri', $('#uri-text').val());
        event.preventDefault();
    });
});

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}