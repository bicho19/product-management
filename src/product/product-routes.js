const ProductSchema = require("./product-schemas");
const ProductHandlers = require("./product-handlers");


/**
 *
 * @param {FastifyInstance} fastify
 * @param {RouteOptions} options
 * @param {function} done: callback
 */

module.exports = (fastify, options, done) => {

    fastify.get(
        "/",
        {
            schema: ProductSchema.fetchProductsSchema,
        },
        ProductHandlers.fetchProductsHandler,
    );

    fastify.post(
        "/",
        {
            //onRequest: [fastify.authenticateAdmin],
            schema: ProductSchema.createProductSchema,
        },
        ProductHandlers.createProductHandler,
    );

    done();
}