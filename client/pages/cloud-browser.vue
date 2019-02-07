<template>
    <div>
        <sui-menu borderless>
            <sui-menu-menu position="left">
                <sui-button-group icons size="small">
                    <sui-button id="bwhite" icon="arrow left" @click="(event) => { navigate(event, 'back') }"/>
                    <sui-button id="bwhite" icon="arrow right" @click="(event) => { navigate(event, 'forward') }"/>
                    <sui-button id="bwhite" icon="redo alternate" @click="(event) => { navigate(event, 'refresh') }"/>
                    <sui-button id="bwhite" icon="home"/>
                </sui-button-group>
            </sui-menu-menu>
            <sui-menu-menu position="left">
                <sui-menu-item style="width: 500px">
                    <sui-input
                            transparent
                            icon="search"
                            :value="uri"
                            @focus="focused = true"
                            @blur="focused = false"
                            @click="focused = true"
                            @keyup.enter.native="submitUrl"/>
                </sui-menu-item>
            </sui-menu-menu>

            <sui-menu-menu position="right">
                <sui-dropdown
                        id="bwhite"
                        class="icon"
                        icon="ellipsis vertical"
                        button
                >
                    <sui-dropdown-menu>
                        <sui-dropdown-item>
                            <sui-button id="bwhite" @click.native="requestHistory()">History</sui-button>
                        </sui-dropdown-item>
                        <sui-dropdown-item>
                            <sui-button id="bwhite" animated @click="logout">
                            <sui-button-content visible>Logout</sui-button-content>
                            <sui-button-content hidden>
                                <sui-icon name="right arrow" />
                            </sui-button-content>
                        </sui-button>
                        </sui-dropdown-item>
                    </sui-dropdown-menu>
                </sui-dropdown>
            </sui-menu-menu>
        </sui-menu>

        <sui-segment color="teal" inverted>
            <img id="photo"/>
        </sui-segment>

        <history :items="items" ref="modal" />
    </div>
</template>

<script>
    import History from "../components/history";
    const Cookie = process.client ? require('js-cookie') : undefined;

    export default {
        components: {History},
        middleware: 'authenticated',
        sockets: {
            requestScreen(data) {
                let OSName = 'Unknown OS';
                if (navigator.appVersion.indexOf('Win') != -1) OSName = 'Windows';
                if (navigator.appVersion.indexOf('Mac') != -1) OSName = 'MacOS';
                if (navigator.appVersion.indexOf('X11') != -1) OSName = 'UNIX';
                if (navigator.appVersion.indexOf('Linux') != -1) OSName = 'Linux';

                console.log(data);
                console.log(window.innerHeight);
                console.log(window.innerWidth);
                console.log(OSName);
                this.$socket.emit('windowSize', {
                    h: window.innerHeight,
                    w: window.innerWidth,
                    os: OSName,
                });
            },
            data(data) {
                this.tempFps++;
                let arrayBufferView = new Uint8Array(data.data);
                let blob = new Blob([arrayBufferView], {
                    type: 'image/jpeg',
                });
                let urlCreator = window.URL || window.webkitURL;
                let imageUrl = urlCreator.createObjectURL(blob);
                let img = document.querySelector('#photo');
                img.src = imageUrl;
            },
            urlChange(data) {
              this.uri = data.url;
            },
            receiveHistory(data) {
                this.items = data;
                this.$refs.modal.toggle();
            }
        },
        data() {
            return {
                uri: 'https://google.de',
                focused: false,
                fps: 0,
                tempFps: 0,
                items: null
            };
        },
        beforeMount() {},
        mounted() {
            this.$socket.emit('initBrowser', 'connected');

            setInterval(() => {
                this.fps = this.tempFps;
                console.log(this.fps);
                this.tempFps = 0;
            }, 1000);

            let img = document.querySelector('#photo');

            img.addEventListener('click', (e) => {
                this.$socket.emit('click', {
                    x: event.clientX,
                    y: event.clientY - 60,
                });
            });


            window.addEventListener('keyup', (e) => {
                if (!this.focused) {
                    this.$socket.emit('keypress', e.key);
                }
            });


            $(window).bind('mousewheel', (event) => {
                if (event.originalEvent.wheelDelta >= 0) {
                    console.log('Scroll up');
                    if (!this.focused) {
                        this.$socket.emit('scroll', 'up');
                    }
                } else {
                    if (!this.focused) {
                        this.$socket.emit('scroll', 'down');
                    }
                    console.log('Scroll down');
                }
            });

            let doit;
            const emitWindowSize = () => {
                this.$socket.emit('changeWindowSize', {
                    h: window.innerHeight,
                    w: window.innerWidth,
                });
            };

            window.onresize = () => {
                clearTimeout(doit);
                doit = setTimeout(function () {
                    emitWindowSize();
                }, 100);
            };


            $('#uri').submit((event) => {
                this.$socket.emit('uri', $('#uri-text').val());
                event.preventDefault();
            });
        },
        methods: {
            submitUrl(evt) {
                this.$socket.emit('uri', evt.target.value);
            },
            navigate(evt, argument) {
                this.$socket.emit('navigation', argument);
            },
            logout() {
                this.$socket.emit('disconnectBrowser', 'disconnected');
                Cookie.remove('jwt');
                this.$store.commit('setJwt', null);
                this.$router.push('/');
            },
            requestHistory() {
                this.$socket.emit('requestHistory', true);
            }
        },
    };

</script>
