import Vuex from 'vuex';

const cookieparser = process.server ? require('cookieparser') : undefined;

const createStore = () => {
    return new Vuex.Store({
        state: {
            jwt: null
        },
        mutations: {
            setJwt(state, jwt) {
                state.jwt = jwt
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
