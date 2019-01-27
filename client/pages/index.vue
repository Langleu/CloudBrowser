<template>
    <div>
        <h1>Welcome!</h1>
        <nuxt-link to="/cloud-browser">Cloud Browser</nuxt-link>
        <nuxt-link to="/about">About page</nuxt-link>
    </div>
</template>

<script>
    export default {
        sockets: {
            connect() {
                console.log('socket connected');
            },
            hallo(val) {
                console.log(val);
            }
        },
        beforeMount() {
            this.$socket.emit('hallo', 'hallo');
        }

    };

</script>
