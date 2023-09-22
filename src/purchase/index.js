const PurchaseRoutes = require("./purchase-routes");


module.exports = (app) => {

    app.register(PurchaseRoutes, { prefix: '/v1/purchases' });
};