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

    socket.on('news', function(data) {
        //console.log(data.data);

        var arrayBufferView = new Uint8Array(data.data);
        var blob = new Blob([arrayBufferView], {
            type: "image/jpeg"
        });
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);
        var img = document.querySelector("#photo");
        img.src = imageUrl;


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