<template>
  <div>
    <sui-menu pointing>
      <a
        is="sui-menu-item"
        v-for="item in items"
        :active="isActive(item)"
        :key="item"
        :content="item"
        @click="select(item)"
      />
      <sui-menu-menu position="right">
        <sui-menu-item>
          <sui-input transparent icon="search" placeholder="Search..." />
        </sui-menu-item>
      </sui-menu-menu>
    </sui-menu>

    <sui-segment>
      <docs-wireframe name="paragraph" />
    </sui-segment>
    <h1>Welcome!</h1>
    <nuxt-link to="/about">About page</nuxt-link>
    <img id="photo" style="position: fixed;left:0px;top:60px" />
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';

export default {
  beforeMount() {
    socket.on('data', (data) => {
      let arrayBufferView = new Uint8Array(data.data);
        let blob = new Blob([arrayBufferView], {
            type: "image/jpeg"
        });
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(blob);
        let img = document.querySelector("#photo");
        img.src = imageUrl;
    });
    socket.on('requestScreen', function(data) {
        console.log(data);
        console.log(window.innerHeight);
        console.log(window.innerWidth);
        socket.emit('windowSize', {
            h: window.innerHeight,
            w: window.innerWidth
        });
    });
  },
  mounted() {
    
    function printMousePos(event) {
        if (!uiElementFocused)
            socket.emit('click', {
                x: event.clientX,
                y: event.clientY - 60
            });
    }
    
    let img = document.querySelector("#photo");

    img.addEventListener("click", printMousePos);

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
  },
}

</script>
