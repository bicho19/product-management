const CategorySchema = require("./category-schemas");
const CategoryHandlers = require("./category-handlers");


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
            schema: CategorySchema.fetchCategoriesSchema,
        },
        CategoryHandlers.fetchCategoriesHandler,
    );

    fastify.post(
        "/",
        {
            onRequest: [fastify.authenticateAdmin],
            schema: CategorySchema.createCategorySchema,
        },
        CategoryHandlers.createCategoryHandler,
    );

    fastify.patch(
        "/:categoryId",
        {
            onRequest: [fastify.authenticateAdmin],
            schema: CategorySchema.updateCategorySchema,
        },
        CategoryHandlers.updateCategoryHandler,
    );

    fastify.delete(
        "/:categoryId",
        {
            onRequest: [fastify.authenticateAdmin],
            schema: CategorySchema.deleteCategorySchema,
        },
        CategoryHandlers.deleteCategoryHandler,
    );

    done();
}