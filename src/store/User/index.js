import { api } from "../../api"

const User = {
    namespaced: true,
    state: {
        info: {
            id: null,
            avatar: null,
            roles: []
        }
    },
    mutations: {
        setInfo(state, info) {
            Object.assign(state.info, info);
        },
        clearInfo(state) {
            state.info = {
                id: null
            };
        }
    },
    actions: {

    },
    getters: {}
};

export default User;
