import Vuex from 'vuex';
import atob from 'atob';

const cookieparser = process.server ? require('cookieparser') : undefined;

const parseJwt = (token) => {
    if (token === null)
        return;
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
};

const createStore = () => {
    return new Vuex.Store({
        state: {
            jwt: null,
            userId: null,
            email: null
        },
        mutations: {
            setJwt(state, jwt) {
                state.jwt = jwt;
                let parsedJwt = parseJwt(jwt);
                state.userId = (parsedJwt || {})._id;
                state.email = (parsedJwt || {}).email;
            }
        },
        actions: {
            nuxtServerInit({ commit }, { req }) {
                let jwt = null;
                if (req) {
                    if (req.headers.cookie) {
                        const parsed = cookieparser.parse(req.headers.cookie);
                        try {
                            jwt = JSON.parse(parsed.jwt);
                        } catch (err) {
                            // No valid cookie found
                        }
                    }
                    commit('setJwt', jwt);
                }
            }
        }
    })
};

export default createStore;
