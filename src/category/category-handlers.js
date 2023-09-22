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

            const categories = await Category.find({

            });

            if (!categories) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "No category was found"));
            }

            return response.send(SuccessResponse(categories));
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
    }
}