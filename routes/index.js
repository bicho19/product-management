const authRoutes = require('../src/auth');
const categoryRoutes = require('../src/category');
const productRoutes = require('../src/product');

module.exports = (app) => {

    authRoutes(app);
    categoryRoutes(app);
    productRoutes(app);
}