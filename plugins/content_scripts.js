window.onload = () => {
    if (window.recorderInjected) return
    Object.defineProperty(window, 'recorderInjected', { value: true, writable: false })

    // Setup message passing
    const port = chrome.runtime.connect(chrome.runtime.id)
    port.onMessage.addListener(msg => window.postMessage(msg, '*'))
        //port.onMessage.addListener(msg => console.log(JSON.stringify(msg)));

    window.addEventListener('message', event => {
        // Relay client messages
        if (event.source === window && event.data.type) {
            port.postMessage(event.data)
        }
        if (event.data.type === 'PLAYBACK_COMPLETE') {
            port.postMessage({ type: 'REC_STOP' }, '*')
        }
        if (event.data.bla) {
            console.log(`{ "chunk" : ${JSON.stringify(event.data.bla)} }`);
        }
    })

    document.title = 'puppetcam'
    window.postMessage({ type: 'REC_CLIENT_PLAY', data: { url: window.location.origin } }, '*')
}