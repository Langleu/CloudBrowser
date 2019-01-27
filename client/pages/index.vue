<template>
    <div>
        <h1>Welcome!</h1>
        <nuxt-link to="/cloud-browser">Cloud Browser</nuxt-link>
        <nuxt-link to="/about">About page</nuxt-link>

        <sui-input v-model="email" />
        <sui-input v-model="password" />
        <sui-checkbox v-model="register" label="register?"/>
        <sui-button animated @click="handleSubmit">
            <sui-button-content visible>Login</sui-button-content>
            <sui-button-content hidden>
                <sui-icon name="right arrow" />
            </sui-button-content>
        </sui-button>
    </div>
</template>

<script>
    const Cookie = process.client ? require('js-cookie') : undefined;

    export default {
        middleware: 'notAuthenticated',
        data() {
            return {
                email: undefined,
                password: undefined,
                register: false
            };
        },
        sockets: {
            connect() {
                console.log('socket connected');
            },
            hallo(val) {
                console.log(val);
            },
            userCreated(data) {
                data.type === 'success' ? this.showCreationSuccess({message: data.msg}) : this.showCreationError({message: data.msg});
            },
            jwt(token) {
                this.$store.commit('setJwt', token);
                Cookie.set('jwt', token);
                this.$router.push('/cloud-browser');
            }
        },
        beforeMount() {
            this.$socket.emit('hallo', 'hallo');
            let token = Cookie.get('jwt');
            if (token)
                this.$socket.emit('checkJwt', token);
        },
        methods: {
            handleSubmit(evt) {
                if (!this.email)
                    this.showCreationError({title: '', message: 'E-Mail is missing!'});
                if (!this.password)
                    this.showCreationError({title: '', message: 'Password is missing'});

                if (this.email && this.password)
                    this.$socket.emit('createUser', {email: this.email, password: this.password, register: this.register });
            }
        },
        notifications: {
            showCreationSuccess: {
                title: 'User created',
                message: 'Successfully created user.',
                type: 'success'
            },
            showCreationError: {
                title: 'User creation error',
                message: 'Could not create user.',
                type: 'error'
            }
        }
    };

</script>
