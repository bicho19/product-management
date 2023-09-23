const Category = require('../../database/models/category');
const {HTTP_STATUS_CODE, ErrorResponse, SuccessResponse} = require("../../utils/response-util");


module.exports = {

    /**
     * Fetch list of categories with pagination
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    fetchCategoriesHandler: async (request, response) => {
        try {

            const currentPage = request.query.page ?? 1;
            const currentSize = request.query.size ?? 10;

            // Create the filter
            const filter = {
                isEnabled: true,
            };

            // get total documents in the collection
            const count = await Category.count(filter);

            const categories = await Category.find(
                {
                    ...filter
                },
                null,
                {
                    sort: {
                        createdAt: -1,
                    },
                    limit: currentSize,
                    skip: (currentPage - 1) * currentSize
                }
            );

            if (!categories) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "No category was found"));
            }

            return response.send(SuccessResponse({
                totalItems: count,
                currentPage: currentPage,
                totalPages: Math.ceil(count / currentSize),
                data: categories,
            }));
        } catch (exception) {
            return response.code(500)
                .send({
                    message: 'Error fetching categories',
                    code: 'SERVER_ERROR',
                });

        }
    },

    /**
     * Create a new category
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    createCategoryHandler: async (request, response) => {
        try {

            const category = await Category.create({
                name: request.body.name,
                description: request.body.description,
            });

            if (!category) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Error creating the category"));
            }

            return response.send(SuccessResponse(category));
        } catch (exception) {
            return response.code(500)
                .send({
                    message: 'Error creating category',
                    code: 'SERVER_ERROR',
                });

        }
    },

    /**
     * Update a category
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    updateCategoryHandler: async (request, response) => {
        try {

            const category = await Category.findOne({
                _id: request.params.categoryId,
            });

            if (!category) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "The specified category could not be found"));
            }

            if (request.body.name) {
                category.name = request.body.name
            }
            if (request.body.description) {
                category.description = request.body.description
            }

            await category.save();

            return response.send(SuccessResponse(category));
        } catch (exception) {
            request.log.error({exception}, 'Error updating the category');
            return response.code(500)
                .send({
                    message: 'Error updating category',
                    code: 'SERVER_ERROR',
                });

        }
    }
}