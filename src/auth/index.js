const auth = require("./auth-routes");


module.exports = (app) => {

    app.register(auth, { prefix: '/v1/auth' });
};