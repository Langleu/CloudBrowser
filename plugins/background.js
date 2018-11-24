/* global chrome, MediaRecorder, FileReader */

let recorder = null;
let filename = null;

chrome.runtime.onConnect.addListener(port => {

    port.onMessage.addListener(msg => {
        console.log(msg);

        const tab = port.sender.tab
        tab.url = msg.data.url
        chrome.desktopCapture.chooseDesktopMedia(['tab', 'audio'], streamId => {
                console.log('starting');
                // Get the stream
                navigator.webkitGetUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: streamId,
                            minWidth: 1280,
                            maxWidth: 1280,
                            minHeight: 720,
                            maxHeight: 720,
                            minFrameRate: 60,
                        }
                    }
                }, stream => {
                    var chunks = [];
                    console.log('continue');
                    recorder = new MediaRecorder(stream, {
                        audioBitsPerSecond: 128000,
                        videoBitsPerSecond: 2500000,
                        ignoreMutedMedia: false,
                        mimeType: 'video/webm'
                    });
                    recorder.ondataavailable = function(event) {
                        if (event.data.size > 0) {
                            var reader = new FileReader();

                            reader.onloadend = function(e) {
                                port.postMessage({ bla: ab2str(reader.result) });
                            };

                            reader.readAsArrayBuffer(event.data);
                            try {
                                //port.postMessage({ bla: blobToUint8Array(new Blob([event.data], { type: 'video/webm' })) });
                            } catch (e) {}
                            chunks.push(event.data);
                        }
                    };

                    recorder.start(1000);
                }, error => console.log('Unable to get user media', error))
            })
            /**
        switch (msg.type) {
            case 'SET_EXPORT_PATH':
                filename = msg.filename
                break
            case 'REC_STOP':
                recorder.stop()
                break
            case 'REC_CLIENT_PLAY':
                if (recorder) {
                    return
                }
                
                break
            default:
                console.log('Unrecognized message', msg)
        } */
    })

})

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}