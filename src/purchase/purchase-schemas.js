module.exports = {

    userPurchaseProductsSchema: {
        body: {
            type: 'object',
            required: ['products'],
            properties: {
                products: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 10,
                    uniqueItems: true,
                    items: {
                        type: 'object',
                        nullable: false,
                        required: ['quantity', 'id'],
                        properties: {
                            quantity: {
                                type: 'number',
                                nullable: false,
                                minimum: 1,
                            },
                            id: {
                                type: 'string',
                                nullable: false,
                                pattern: '^[0-9a-fA-F]{24}$'
                            },
                        },
                    }
                },
            }
        }
    },

    fetchUserPurchasesSchema: {
        query: {
            type: 'object',
            required: [],
            properties: {
                page: {
                    type: "number",
                    nullable: false,
                    minimum: 1,
                },
                size: {
                    type: "number",
                    nullable: false,
                    minimum: 5,
                },
            }
        }
    },

    fetchUserPurchaseDetailsSchema: {
        params: {
            type: 'object',
            required: ['purchaseId'],
            properties: {
                purchaseId: {
                    type: 'string',
                    nullable: false,
                    pattern: '^[0-9a-fA-F]{24}$'
                },
            }
        }
    },
}