import Vue from 'vue';
import VueNotifications from 'vue-notifications';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';

function toast ({title, message, type, timeout, cb}) {
    if (type === VueNotifications.types.warn) type = 'warning';
    return new Noty({text: message, timeout, type}).show();
}

const options = {
    success: toast,
    error: toast,
    info: toast,
    warn: toast
};

Vue.use(VueNotifications, options);
