import Vue from "vue";
import Vuex from "vuex"
import App from './App.vue'
import "@/registerServiceWorker";
import router from "@/router";
import store from "@/store";

const isdev = (process.env.NODE_ENV==='development')

import VueFluent from "vfluentdesign";
import "vfluentdesign/lib/index.css";

Vue.use(VueFluent, Vuex);
import PowerEditor from "@creatorsn/powereditor";

import "@creatorsn/powereditor/lib/powereditor.css";

import "@/style/global.scss";

Vue.use(PowerEditor);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    beforeCreate() {
        Vue.prototype.$Go = str => {
            this.$router.push(str);
        };
        Vue.prototype.$Back = () => {
            this.$router.back();
        };
        Vue.prototype.$Jump = str => {
            window.open(str);
        };
        Vue.prototype.$Guid = () => {
            let guid = this.$SUtility.Guid();
            guid = guid.split('-')[0];
            return guid;
        };
        if (isdev){
            Vue.prototype.$server = "http://59.77.134.18:5081";
        }else{
            Vue.prototype.$server = `/api`;
        }
    },
    render: h => h(App)
}).$mount("#app");
