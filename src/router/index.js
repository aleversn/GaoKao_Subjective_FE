import Vue from "vue";
import VueRouter from "vue-router";
import tool from "./tools";
import http from "../api";

// router entry
import Board from "./Board";
import Login from "./Login";
import Manage from "./Manage";

const routePush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return routePush.call(this, location).catch(error => error);
};

Vue.use(VueRouter);

const AsyncLoad = tool.AsyncLoad;

const routes = [
    {
        path: "/",
        name: "score",
        component: () => AsyncLoad(import("@/views/score/")),
        children: [
            {
                path: "",
                name: "score",
                component: () => AsyncLoad(import("@/views/score/preview.vue"))
            }
        ]
    },
    Board,
    Login,
    Manage,
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

let isLogin = async () => {
    return true;
};

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title || 'SAS';
    let result = await isLogin();
    if (!result) {
        if (from.path.startsWith("/login") || to.path.startsWith("/login") || to.path === '/') next();
        else
            next("/login");
    }
    else
        next();
});

export default router;
