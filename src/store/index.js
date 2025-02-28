import Vue from "vue";
import Vuex from "vuex";

// entry
import User from "./User";
import Model from "./Model";
import Theme from "./Theme";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        config: {
            language: 'cn'
        },
        i18n: {}
    },
    mutations: {
        reviseI18N(state, i18n) {
            state.i18n = i18n
        }
    },
    actions: {},
    getters: {
        local: state => text => {
            let result = state.i18n[text];
            if (!result)
                return text;
            return result[state.config.language];
        }
    },
    modules: {
        User,
        Model,
        Theme
    }
});
