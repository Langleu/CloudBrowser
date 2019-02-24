const express = require('express');
const mongoose = require('mongoose');
const {Nuxt, Builder} = require('nuxt-edge');
const app = express();
const port = process.env.PORT || 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const logger = require('./server/Logger');
const CommunicationLayer = require('./server/CommunicationLayer');
const UserService = require('./server/services/UserService');

/** requires the nuxt config */
let nuxtConfig = require('./nuxt.config');
nuxtConfig.dev = !(process.env.NODE_ENV === 'production');
const nuxt = new Nuxt(nuxtConfig);

if (nuxtConfig.dev) {
    const builder = new Builder(nuxt);
    builder.build();
}

mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/cloud_browser');

app.use(nuxt.render);

server.listen(port, {perMessageDeflate: false});
logger.info(`Listening on port ${port}`);

/** Socket Connection */
io.on('connection', (socket) => {

    socket.id = Math.random().toString().substr(2, 16);
    logger.info(`${socket.id} connected`);

    // checks whether the JWT is still valid
    socket.on('checkJwt', (token) => {
        if (UserService.verifyJwt(token)) {
            let user = UserService.decodeJwt(token);
            socket.userId = user._id;
            socket.emit('jwt', token);
        }
    });

    // authenticates the user and creates a JWT
    socket.on('authenticateUser', (data) => {
        // if the user registers otherwise the login case is used.
        if (data.register) {
            UserService.create(data)
                .then(user => {
                    socket.emit('authUser', {msg: `${data.email} was successfully created!`, type: 'success'});
                })
                .catch(err => {
                    socket.emit('authUser', {msg: `${data.email} could not be created!`, type: 'error'});
                });
        } else {
            UserService.authenticate(data.email, data.password)
                .then(data => {
                    if (data.isMatch) {
                        let token = UserService.createJwt(data.user);
                        socket.userId = data.user._id;
                        socket.emit('jwt', token);
                        socket.emit('authUser', {msg: 'Successfully logged in!', type: 'success'});
                    } else
                        socket.emit('authUser', {msg: 'Could not login!', type: 'error'});
                });
        }
    });

    const communication = new CommunicationLayer(socket);

    communication.startListener();
});
