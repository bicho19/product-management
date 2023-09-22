const Product = require('../../database/models/product');
const Category = require('../../database/models/category');
const {HTTP_STATUS_CODE, ErrorResponse, SuccessResponse} = require("../../utils/response-util");

module.exports = {

    /**
     * Fetch all products with pagination handler
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    fetchProductsHandler: async (request, response) => {
        try {

            // Fetch only enabled products
            const products = await Product.find({
                isEnabled: true,
            });

            if (!products) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "No product was found"));
            }

            return response.send(SuccessResponse(products));
        } catch (exception) {
            return response.code(500)
                .send({
                    message: 'Error fetching products',
                    code: 'SERVER_ERROR',
                });

        }
    },

    /**
     * Create product handler
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    createProductHandler: async (request, response) => {
        try {

            // check the category
            const category = await Category.findOne({
                _id: request.body.categoryId,
            });

            if (!category) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "The specified category does not exists"));
            }

            const product = await Product.create({
                name: request.body.name,
                description: request.body.description,
                price: request.body.price,
                category: category._id,
            });

            if (!product) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Error creating the product"));
            }

            return response.send(SuccessResponse(product));
        } catch (exception) {
            request.log.error({exception}, 'Error creating the category');
            return response.code(500)
                .send({
                    message: 'Error creating a new products',
                    code: 'SERVER_ERROR',
                });

        }
    },
}