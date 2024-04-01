import axios, {AxiosRequestConfig} from "axios";
import router from "@/router";

const BASE_URL = process.env.NODE_HOST;

axios.defaults.timeout = 5000; // Timeout setting
axios.defaults.withCredentials = true; // true allows cross-domain
axios.defaults.baseURL = BASE_URL;
// Content Type Response Header
//axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";

axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // Usually, a token is added to the interception request for backend verification
        const token = localStorage.getItem("access_token") as string
        if(token) {
            config.headers.Authorization = token;
        }
        return config
    },
    (err: any) => {
        //Request error, global prompt box can be used to prompt here
        return Promise.reject(err)
    },
)

// Response interceptor
axios.interceptors.response.use(
    (response) => {
        // If the returned status code is 200, it indicates that the interface request is successful and the data can be obtained normally
        // Otherwise, an error will be thrown
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // When the server status code does not start with 2
    (error) => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: Not logged in
                case 401:
                    router.replace({
                        path: "/",
                        query: {
                            // redirect: router.currentRoute.fullPath
                        },
                    });
                    break;
                case 403:
                    // Console. log ('Administrator privileges have been modified, please log in again ')
                    // Jump to the login page and pass the fullPath of the page you want to browse. After successful login, jump to the page you need to access
                    setTimeout(() => {
                        router.replace({
                            path: "/",
                            query: {
                                // redirect: router.currentRoute.fullPath
                            },
                        });
                    }, 1000);
                    break;

                // 404 request does not exist
                case 404:
                    // console.log('404')
                    break;
            }
            return Promise.reject(error.response);
        }
    }
);


export function getBaseURL() {
    return BASE_URL;
}



/**
 * Encapsulation get method
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params?: object) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, params).then(
            (response) => resolve(response.data),
            (error) => reject(error)
        );
    });
}

/**
 * Encapsulation post method
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(
            (response) => resolve(response.data),
            (error) => reject(error)
        );
    });
}

/**
 * Encapsulation delete method
 * @param url
 * @param data
 * @returns {Promise}
 */
export function deletes(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, data).then(
            (response) => resolve(response.data),
            (error) => reject(error)
        );
    });
}

/**
 * Encapsulation put method
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data).then(
            (response) => resolve(response.data),
            (error) => reject(error)
        );
    });
}
