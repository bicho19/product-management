const PurchaseSchema = require("./purchase-schemas");
const PurchaseHandlers = require("./purchase-handlers");


/**
 *
 * @param {FastifyInstance} fastify
 * @param {RouteOptions} options
 * @param {function} done: callback
 */

module.exports = (fastify, options, done) => {

    fastify.post(
        "/",
        {
            onRequest: [fastify.authenticate],
            schema: PurchaseSchema.userPurchaseProductsSchema,
        },
        PurchaseHandlers.userPurchaseProductsHandler,
    );
    fastify.get(
        "/",
        {
            onRequest: [fastify.authenticate],
            schema: PurchaseSchema.fetchUserPurchasesSchema,
        },
        PurchaseHandlers.userFetchPurchasesHandler,
    );

    fastify.get(
        "/:purchaseId",
        {
            onRequest: [fastify.authenticate],
            schema: PurchaseSchema.fetchUserPurchaseDetailsSchema,
        },
        PurchaseHandlers.fetchUserPurchaseDetailsHandler,
    );

    done();
}