const products = require("./product-routes");


module.exports = (app) => {

    app.register(products, { prefix: '/v1/products' });
};