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

            const currentPage = request.query.page ?? 1;
            const currentSize = request.query.size ?? 10;

            // Create the filter
            const filter = {
                isEnabled: true,
            };

            // search products by their name
            if (request.query.search) {
                filter['name']= {
                    $regex: request.query.search,
                    $options: "i"
                }
            }

            // Filter products by category
            if (request.query.category) {
                filter['category']= {
                    $eq: request.query.category,
                }
            }

            // Filter products by price
            if (request.query.minPrice) {
                filter['price']= {
                    $gte: request.query.minPrice,
                }
            }
            if (request.query.maxPrice) {
                filter['price']= {
                    $lte: request.query.maxPrice,
                }
            }


            // get total documents in the collection
            const count = await Product.count(filter);

            // Fetch only enabled products
            const products = await Product.find(
                {
                    ...filter,
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

            if (!products) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "No product was found"));
            }

            return response.send(SuccessResponse({
                totalItems: count,
                currentPage: currentPage,
                totalPages: Math.ceil(count / currentSize),
                data: products,
            }));
        } catch (exception) {
            request.log.error({exception}, 'Error fetching list of products');
            return response.code(500)
                .send({
                    message: 'Error fetching products',
                    code: 'SERVER_ERROR',
                });

        }
    },

    /**
     * Fetch  product details handler
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    fetchProductDetailsHandler: async (request, response) => {
        try {

            // Fetch only enabled products
            const product = await Product.findOne(
                {
                    _id: request.params.productId,
                    isEnabled: true,
                },
                null,
                {
                    populate: [
                        {
                            path: 'category'
                        }
                    ]
                }
            );

            if (!product) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "The specified product was not found"));
            }

            return response.send(SuccessResponse(product));
        } catch (exception) {
            console.log(exception)
            return response.code(500)
                .send({
                    message: 'Error fetching product details',
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

    /**
     * Update product handler
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    updateProductHandler: async (request, response) => {
        try {
            const product = await Product.findOne({
                _id: request.params.productId,
            });

            if (!product) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "The specified product could not be found"));
            }

            if (request.body.name) {
                product.name = request.body.name
            }
            if (request.body.description) {
                product.description = request.body.description
            }
            if (request.body.price) {
                product.price = request.body.price
            }

            if (request.body.categoryId) {
                const category = await Category.findOne({
                    _id: request.body.categoryId,
                });

                if (!category) {
                    return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                        .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "The specified category does not exists"));
                }
                // update product category
                product.category = request.body.category
            }

            await product.save();

            return response.send(SuccessResponse(product));
        } catch (exception) {
            request.log.error({exception}, 'Error updating the product');
            return response.code(500)
                .send({
                    message: 'Error updating product',
                    code: 'SERVER_ERROR',
                });

        }
    },
}