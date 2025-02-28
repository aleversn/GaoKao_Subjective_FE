import axios from 'axios'

const isdev = (process.env.NODE_ENV === "development")

let ax = axios.create();

if (isdev) {
    ax.defaults.baseURL = "http://100.64.0.18:8000";
} else {
    ax.defaults.baseURL = "/api"
}

export default ax;

