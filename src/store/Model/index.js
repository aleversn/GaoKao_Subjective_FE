const Model = {
    namespaced: true,
    state: {
        nickname: '',
        avatar: '',
        background: '',
    },
    mutations: {
        reviseInfo(state, info) {
            for (let key in info) {
                state[key] = info[key];
            }
        }
    },
    actions: {

    },
    getters: {

    }
};

export default Model;
