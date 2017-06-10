import * as axios from 'axios';

const client_id = '517001085227-90qlaf3fpbktccbg2fgitvi2478i51ok.apps.googleusercontent.com';

interface IUserData {
    id: string,
    name: string,
    given_name: string,
    family_name: string,
    picture: string,
    locale: string
}

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
        // + '?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar'
        // + '?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fblogger+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar'
        // + '&immediate=false'
        // + '&include_granted_scopes=false&hl=en&proxy=oauth2relay633233447'
        + '&state=none'
        + '&redirect_uri=http%3A%2F%2Flocalhost%3A3000'
        + '&response_type=token'
        + '&client_id=' + client_id;
    let windowOptions2 = {
        width: 300,
        height: 500,
        top: (window.outerHeight - 500) / 2,
        left: (window.outerWidth - 200) /2,
        menubar: false
    };
    let windowOptions = `width=323,height=569,top=${(window.outerHeight-569)/2},left=${(window.outerWidth-323)/2}`;
    googleAuthWindow = window.open(googleAuthEndpoint, 'authWindow', windowOptions);
    let successListener = null;

    return new Promise((resolve, reject) => {
        successListener = () => setTimeout(() => {
            try {
                if (!googleAuthWindow) {
                    reject({ error: 'window closed'});
                    return;
                }

                // Attempting to reference this properety will throw an error if the origin is still
                // under google.com -- after authenticating the window will redirect to this site again
                if (googleAuthWindow.location.origin === window.location.origin) {
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
                } else {
                    successListener();
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
            return getUser(d[0]);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
}

export function signOut() {
    return Promise.resolve();
}
