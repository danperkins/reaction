import * as axios from 'axios';

const client_id = '517001085227-90qlaf3fpbktccbg2fgitvi2478i51ok.apps.googleusercontent.com';

let userData = null;
let tokenInfo = null;
let googleAuthWindow = null;
export function getUserData() {
    return userData;
}

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

function authenticate() {
    let googleAuthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
        + '?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile'
        + '&state=none'
        + '&redirect_uri=http%3A%2F%2Flocalhost%3A3000'
        + '&response_type=token'
        + '&client_id=' + client_id;
    googleAuthWindow = window.open(googleAuthEndpoint);
    let successListener = null;

    return new Promise((resolve, reject) => {
        successListener = () => setTimeout(() => {
            console.log('waiting');
            try {
                if (!googleAuthWindow) {
                    reject({ error: 'window closed'});
                    return;
                }

                // Attempting to reference this properety will throw an error if the origin is still
                // under google.com -- after authenticating the window will redirect to this site again
                if (googleAuthWindow.location.origin === window.location.origin) {
                    console.log('got it');
                    let location = googleAuthWindow.location;
                    // code taken from Google OAuth documentation for parsing OAuth response parameters
                    let params: any = {}, queryString = location.hash.substring(1),
                        regex = /([^&=]+)=([^&]*)/g, m = null;
                    while (m = regex.exec(queryString)) {
                        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                    }
                    googleAuthWindow.close();
                    if (params.error) {
                        reject(params.error);
                        return;
                    }

                    resolve(params);
                }
            } catch(err) {
                successListener();
            }
        }, 200);

        successListener();
    })
}


export function signIn() {
    return Promise.resolve()
        .then(authenticate)
        .then((d: any) => {
            let token = d.access_token
            return Promise.all([token, validateToken(token)]);
        })
        .then((d: any) => {
            getUser(d[0]);
        })
        .catch((err) => {
            console.log('failed to get user data');
            console.log(err);
        });
}
