<template>
    <div>
    <div class="background centerX">
        <sui-grid centered vertical-align="middle">
            <sui-grid-column>

                <h2 is="sui-header" color="teal">
                    <sui-header-content>CloudBrowser</sui-header-content>
                </h2>

                <sui-segment stacked>
                    <sui-input
                            v-model="email"
                            type="username"
                            placeholder="Username"
                            icon="user"
                            icon-position="left"/>
                    <br>
                    <sui-input
                            v-model="password"
                            type="password"
                            placeholder="Password"
                            icon="lock"
                            icon-position="left"/>
                    <br>
                    <sui-checkbox v-model="register" label="register?"/>
                    <sui-divider />

                    <sui-button color="teal" fluid animated @click="handleSubmit">
                        <sui-button-content visible>Login</sui-button-content>
                        <sui-button-content hidden>
                            <sui-icon name="right arrow"/>
                        </sui-button-content>
                    </sui-button>
                </sui-segment>
            </sui-grid-column>
        </sui-grid>
    </div>
        <sui-menu fixed="bottom">
            <sui-menu-item position="right" item icon="github" simple @click="github" />
        </sui-menu>
    </div>
</template>

<script>
    import SuiGridColumn from "semantic-ui-vue/dist/commonjs/collections/Grid/GridColumn";

    const Cookie = process.client ? require('js-cookie') : undefined;


    export default {
        components: {SuiGridColumn},
        middleware: 'notAuthenticated',
        data() {
            return {
                email: undefined,
                password: undefined,
                register: false,
                items: [{
                    url: "test",
                    date: "yesterday"
                },{
                    url: "test2",
                    date: "today"
                }]
            };
        },
        sockets: {
            connect() {
                console.log('socket connected');
            },
            authUser(data) {
                data.type === 'success' ? this.showCreationSuccess({message: data.msg}) : this.showCreationError({message: data.msg});
            },
            jwt(token) {
                this.$store.commit('setJwt', token);
                Cookie.set('jwt', token);
                this.$router.push('/cloud-browser');
            }
        },
        beforeMount() {
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
                    this.$socket.emit('authenticateUser', {
                        email: this.email,
                        password: this.password,
                        register: this.register
                    });
            },
            github() { window.open('https://github.com/Langleu/CloudBrowser', '_blank') }
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
