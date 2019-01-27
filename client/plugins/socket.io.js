/**import io from 'socket.io-client';
const socket = io(process.env.WS_URL);

export default socket;**/
import Vue from 'vue';
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io-extended';

export default ( { store }) => {
    Vue.use(VueSocketIO, io(process.env.WS_URL), { store });
}
