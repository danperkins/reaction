
// There are better options for storing your secrets
// This is just the easiest option for now - we'll fix it later!
const config = {
    auth: {
        google: {
            clientId: '517001085227-90qlaf3fpbktccbg2fgitvi2478i51ok.apps.googleusercontent.com',
            clientSecret: 'vPLMoFYRt-e0RSecQBbiaFF8'
        },
        token: {
            secret: 'reaction_dummy_placeholder_secret',
            issuer: 'reaction_test_app',
            audience: 'reaction_test_app'
        }
    }
}

module.exports = config;