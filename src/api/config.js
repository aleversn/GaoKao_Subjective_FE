import axios from 'axios'

const isdev = (process.env.NODE_ENV === "development")

let ax = axios.create();

// config here
if (isdev) {
    ax.defaults.baseURL = "http://59.77.134.18:5081";
} else {
    ax.defaults.baseURL = "/api"
}


ax.interceptors.request.use(config => {
    let token = localStorage.getItem("ApiToken");
    let expired = localStorage.getItem("ApiTokenExpiredAt");
    if (!expired || new Date(expired) < new Date()) {
        token = null;
        localStorage.removeItem("ApiToken");
        localStorage.removeItem("ApiTokenExpiredAt");
    }
    if (token != null) {
        config.headers["Authorization"] = token;
    }
    return config;
});

export default ax;