// global declaration
import Vue from "vue";
import store from "./src/store/";
import router from "./src/router/";
import { api } from "./src/api"

declare module "vue/types/vue" {
    interface Vue {
        /**
         * @description global session storage
         */
        $store: typeof store;
        /**
         * @description global router
         */
        $router: typeof router;
        $api: typeof api
    }
}
