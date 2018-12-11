<template>
    <div>
        <sui-menu borderless>
            <sui-menu-menu position="left">
                <sui-button-group icons size="small">
                    <sui-button id="bwhite" icon="arrow left" @click="(event) => { navigate(event, 'back') }"/>
                    <sui-button id="bwhite" icon="arrow right" @click="(event) => { navigate(event, 'forward') }" />
                    <sui-button id="bwhite" icon="redo alternate" @click="(event) => { navigate(event, 'refresh') }" />
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
                        <sui-dropdown-item>FPS</sui-dropdown-item>
                    </sui-dropdown-menu>
                </sui-dropdown>
            </sui-menu-menu>
        </sui-menu>

        <sui-segment color="teal" inverted>
            <img id="photo"/>
        </sui-segment>

        <!--<h1>Welcome!</h1>
        <nuxt-link to="/about">About page</nuxt-link> -->
    </div>
</template>

<script>
  import socket from '~/plugins/socket.io.js';

  export default {
    data() {
      return {
        uri: 'https://google.de',
        focused: true,
        fps: 0,
        tempFps: 0,
      };
    },
    beforeMount() {
      let OSName = 'Unknown OS';
      if (navigator.appVersion.indexOf('Win') != -1) OSName = 'Windows';
      if (navigator.appVersion.indexOf('Mac') != -1) OSName = 'MacOS';
      if (navigator.appVersion.indexOf('X11') != -1) OSName = 'UNIX';
      if (navigator.appVersion.indexOf('Linux') != -1) OSName = 'Linux';

      socket.on('requestScreen', (data) => {
        console.log(data);
        console.log(window.innerHeight);
        console.log(window.innerWidth);
        console.log(OSName);
        socket.emit('windowSize', {
          h: window.innerHeight,
          w: window.innerWidth,
          os: OSName,
        });
      });
    },
    mounted() {

      socket.on('data', (data) => {
        this.tempFps++;
        let arrayBufferView = new Uint8Array(data.data);
        let blob = new Blob([arrayBufferView], {
          type: 'image/jpeg',
        });
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(blob);
        let img = document.querySelector('#photo');
        img.src = imageUrl;
      });


      setInterval(() => {
        this.fps = this.tempFps;
        console.log(this.fps);
        this.tempFps = 0;
      }, 1000);

      socket.on('urlChange', (data) => {
        this.uri = data.url;
      });

      let img = document.querySelector('#photo');

      img.addEventListener('click', (e) => {
        socket.emit('click', {
          x: event.clientX,
          y: event.clientY - 60,
        });
      });


      window.addEventListener('keyup', (e) => {
        if (!this.focused) {
          socket.emit('keypress', e.key);
        }
      });


      $(window).bind('mousewheel', (event) => {
        if (event.originalEvent.wheelDelta >= 0) {
          console.log('Scroll up');
          if (!this.focused) {
            socket.emit('scroll', 'up');
          }
        } else {
          if (!this.focused) {
            socket.emit('scroll', 'down');
          }
          console.log('Scroll down');
        }
      });

      let doit;
      const emitWindowSize = () => {
        socket.emit('changeWindowSize', {
          h: window.innerHeight,
          w: window.innerWidth,
        });
      };

      window.onresize = () => {
        clearTimeout(doit);
        doit = setTimeout(function() {
          emitWindowSize();
        }, 100);
      };


      $('#uri').submit((event) => {
        socket.emit('uri', $('#uri-text').val());
        event.preventDefault();
      });
    },
    methods: {
      submitUrl(evt) {
        socket.emit('uri', evt.target.value);
      },
      navigate(evt, argument) {
        socket.emit('navigation', argument);
      },
    },
  };

</script>
