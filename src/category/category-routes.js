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
            schema: CategorySchema.createCategorySchema,
        },
        CategoryHandlers.createCategoryHandler,
    );

    done();
}