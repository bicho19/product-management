const Product = require('../../database/models/product');
const Purchase = require('../../database/models/purchase');
const {HTTP_STATUS_CODE, ErrorResponse, SuccessResponse} = require("../../utils/response-util");


module.exports = {

    /**
     * Endpoint to allow the user to make a purchase for different products
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    userPurchaseProductsHandler: async (request, response) => {
        try {

            // Check the products
            let totalPrice = 0;
            const products = [];
            for (const item of request.body.products) {
                const product = await Product.findOne({
                    _id: item.id,
                });

                if (!product || !product.isAvailable) {
                    return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                        .send(ErrorResponse(
                            HTTP_STATUS_CODE.BAD_REQUEST,
                            `Product with id ${item.id} does not exists`,
                        ));
                }

                products.push({
                    quantity: item.quantity,
                    product: item.id,
                });
                // calculate the total price
                totalPrice += product.price * item.quantity;
            }

            if (products.length === 0) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Products must be al least have one item"));
            }

            // Create a new purchase with the data
            const purchaseOrder = await Purchase.create({
                user: request.user.id,
                products: products,
                amount: totalPrice,
                status: 'unpaid',
            });

            if (!purchaseOrder) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Could not create the purchase order"));
            }

            return response.send(SuccessResponse(purchaseOrder, 'Order has been saved'));


        } catch (exception) {
            request.log.error({exception}, 'Error creating a purchase order')
            return response.code(500)
                .send({
                    message: 'Error saving the purchase order',
                    code: 'SERVER_ERROR',
                });

        }
    },

    /**
     * Endpoint to fetch user's purchases
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    userFetchPurchasesHandler: async (request, response) => {
        try {

            const purchaseOrders = await Purchase.find(
                {
                    user: request.user.id,
                },
                null,
                {
                    sort: {
                        createdAt: -1,
                    },
                });

            if (!purchaseOrders) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Could not fetch your purchases"));
            }

            return response.send(SuccessResponse(purchaseOrders));


        } catch (exception) {
            request.log.error({exception}, 'Error fetching user purchases')
            return response.code(500)
                .send({
                    message: 'Error fetching your purchases',
                    code: 'SERVER_ERROR',
                });

        }
    },
}