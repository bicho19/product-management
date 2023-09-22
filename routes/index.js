const authRoutes = require('../src/auth');
const categoryRoutes = require('../src/category');
const productRoutes = require('../src/product');
const purchaseRoutes = require('../src/purchase');

module.exports = (app) => {

    authRoutes(app);
    categoryRoutes(app);
    productRoutes(app);
    purchaseRoutes(app);
}