const Product = require('../../database/models/product');
const Purchase = require('../../database/models/purchase');
const {HTTP_STATUS_CODE, ErrorResponse, SuccessResponse} = require("../../utils/response-util");
const dayjs = require('dayjs');

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
                    isDeleted: false,
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

            const currentPage = request.query.page ?? 1;
            const currentSize = request.query.size ?? 10;

            // Create the filter
            const filter = {
                user: request.user.id,
            };

            // get total documents in the collection
            const count = await Purchase.count(filter);


            const purchaseOrders = await Purchase.find(
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
                });

            if (!purchaseOrders) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Could not fetch your purchases"));
            }

            return response.send(SuccessResponse({
                totalItems: count,
                currentPage: currentPage,
                totalPages: Math.ceil(count / currentSize),
                data: purchaseOrders,
            }));


        } catch (exception) {
            request.log.error({exception}, 'Error fetching user purchases')
            return response.code(500)
                .send({
                    message: 'Error fetching your purchases',
                    code: 'SERVER_ERROR',
                });

        }
    },

    /**
     * Endpoint to fetch user's purchase details
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    fetchUserPurchaseDetailsHandler: async (request, response) => {
        try {

            const purchaseOrder = await Purchase.find(
                {
                    _id: request.params.purchaseId,
                    user: request.user.id,
                },
                null,
                {
                    populate: [
                        {
                            path: 'products.product'
                        }
                    ],
                });

            if (!purchaseOrder) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Could not fetch the specified purchase"));
            }

            return response.send(SuccessResponse(purchaseOrder));


        } catch (exception) {
            request.log.error({exception}, 'Error fetching purchase details')
            return response.code(500)
                .send({
                    message: 'Error fetching your purchase details',
                    code: 'SERVER_ERROR',
                });

        }
    },

    /**
     * FEtch admin purchases stats
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    adminPurchaseStatsHandler: async (request, response) => {
        try {

            let startOfDate = dayjs()
                .startOf('month')
                .toDate();
            let endOfDate = dayjs()
                .endOf('month')
                .toDate();

            if (request.query.startDate && request.query.endDate) {
                startOfDate = dayjs(request.query.startDate).toDate();
                endOfDate = dayjs(request.query.endDate).toDate();
            }

            console.log(startOfDate);
            console.log(endOfDate)
            /**
             * The aggregation pipelines declaration
             * @type {PipelineStage[]}
             */
            const pipeline = [
                {
                    $match: {
                        $and: [
                            {
                                createdAt: {
                                    $gte: startOfDate,
                                }
                            },
                            {
                                createdAt: {
                                    $lte: endOfDate,
                                }
                            }
                        ]
                    }
                },
                // Count total purchases
                {
                    $count: 'totalPurchases'
                }
            ]
            const totalPurchasesData = await Purchase.aggregate(pipeline);

            if (!totalPurchasesData) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Could not fetch total purchases"));
            }


            /**
             * The aggregation pipelines declaration
             * @type {PipelineStage[]}
             */
            const topSellingPipeline = [
                // match current selected period
                {
                    $match: {
                        $and: [
                            {
                                createdAt: {
                                    $gte: startOfDate,
                                }
                            },
                            {
                                createdAt: {
                                    $lte: endOfDate,
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: {
                        path: '$products'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products.product',
                        foreignField: '_id',
                        as: 'products.product'
                    }
                },
                {
                    $unwind: {
                        path: '$products.product'
                    }
                },
                {
                    $group: {
                        _id: '$products.product._id',
                        totalSoldAmount: {
                            $sum: {
                                $multiply: [
                                    "$products.product.price",
                                    "$products.quantity"
                                ]
                            }
                        },
                        totalSoldQuantity: {
                            $sum: "$products.quantity",
                        }
                    }
                },
                {
                    $sort: {
                        totalSold: -1
                    }
                },
                {
                    $limit: 5
                },
                // Fetch product details
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'product',
                    }
                },
                {
                    $unwind: {
                        path: '$product'
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: '$product._id',
                        totalSoldAmount: 1,
                        totalSoldQuantity: 1,
                        name: '$product.name',
                        description: '$product.description',
                        price: '$product.price',
                    }
                }
            ];
            const topSellingProductData = await Purchase.aggregate(topSellingPipeline);

            if (!topSellingProductData) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Could not fetch total purchases"));
            }



            return response.send(SuccessResponse({
                totalPurchases: totalPurchasesData[0]?.totalPurchases ?? 0,
                topSellingProducts: topSellingProductData,
            }));


        } catch (exception) {
            console.log(exception)
            request.log.error({exception}, 'Error fetching purchase stats')
            return response.code(500)
                .send({
                    message: 'Error fetching purchase stats',
                    code: 'SERVER_ERROR',
                });

        }
    },



}