/* eslint-disable no-console */

import { register } from "register-service-worker";

// if (process.env.NODE_ENV === "production") {
register(`${process.env.BASE_URL}sw.js`, {
    ready() {
            
    },
    registered() {
    },
    cached() {
    },
    updatefound() {
    },
    updated() {
    },
    offline() {
    },
    error() {
    }
});
// }
