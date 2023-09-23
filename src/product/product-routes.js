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

    fastify.get(
        "/:productId",
        {
            schema: ProductSchema.fetchProductDetailsSchema,
        },
        ProductHandlers.fetchProductDetailsHandler,
    );

    fastify.post(
        "/",
        {
            onRequest: [fastify.authenticateAdmin],
            schema: ProductSchema.createProductSchema,
        },
        ProductHandlers.createProductHandler,
    );

    fastify.patch(
        "/:productId",
        {
            onRequest: [fastify.authenticateAdmin],
            schema: ProductSchema.updateProductSchema,
        },
        ProductHandlers.updateProductHandler,
    );

    fastify.delete(
        "/:productId",
        {
            onRequest: [fastify.authenticateAdmin],
            schema: ProductSchema.deleteProductSchema,
        },
        ProductHandlers.deleteProductHandler,
    );

    done();
}