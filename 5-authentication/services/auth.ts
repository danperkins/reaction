import axios from 'axios';

interface IUserData {
    token: string,
    name: string,
    image: string,
}

let userData = null;
let tokenInfo = null;
let authToken = null;
let googleAuthWindow = null;

export function getUserData() {
    return userData;
}

export function getAuthToken() {
    return authToken;
}

function authenticate() {
    let windowOptions2 = {
        width: 300,
        height: 500,
        top: (window.outerHeight - 500) / 2,
        left: (window.outerWidth - 200) /2,
        menubar: false
    };
    let windowOptions = `width=323,height=569,top=${(window.outerHeight-569)/2},left=${(window.outerWidth-323)/2}`;
    googleAuthWindow = window.open("http://localhost:3000/auth/login", 'authWindow', windowOptions);
    let closeListener = null;
    let closeTimeoutId = null;

    return new Promise((resolve, reject) => {
        (window as any).authenticateCallback = (data) => {
            clearTimeout(closeTimeoutId);
            if (data && data.token) {
                resolve(data);
            } else {
                reject({ error: 'No token received'});
            }
        };

        closeListener = () => {
            closeTimeoutId = setTimeout(() => {
                if (!googleAuthWindow || googleAuthWindow.closed) {
                    (window as any).authenticateCallback = null;
                    reject({ error: 'Window closed'});
                    return;
                }
                closeListener();
            }, 700); 
        }

        closeListener();
    });
}

export function signIn() {
    return Promise.resolve()
        .then(authenticate)
        .then((d: any) => {
            authToken = d.token;
            userData = d;
            axios.defaults.headers.Authorization = `Bearer ${authToken}`;
            return authToken;
        })
        .catch((e) => {
            console.log(e.error);
            return Promise.reject(e);
        });
}

// The token and user info is currently stored in memory not in a cookie
// So it will be reset by just refreshing the page
export function signOut() {
    return window.location.href = window.location.href;
}

// Old code from client-only authentication without JWT, just google
/*
let googleAuthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
    + '?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile'
    + '&state=none'
    + '&redirect_uri=http%3A%2F%2Flocalhost%3A3000'
    + '&response_type=token'
    + '&client_id=' + client_id;

function validateToken(accessToken: string) {
    return axios
        .get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + accessToken)
        .then((v) => {
            tokenInfo = v.data
            if (tokenInfo.aud !== client_id) {
                return Promise.reject('token audience does not match expected value');
            }
        })
}

function getUser(accessToken: string) {
    return axios
        .get('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + accessToken)
        .then((v) => {
            userData = v.data;
        })
}
*/