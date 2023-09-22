const category = require("./category-routes");


module.exports = (app) => {

    app.register(category, { prefix: '/v1/categories' });
};