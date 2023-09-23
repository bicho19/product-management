module.exports = {

    fetchProductsSchema: {
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
                search: {
                    type: "string",
                    nullable: false,
                    minLength: 2,
                },
                category: {
                    type: "string",
                    nullable: false,
                    pattern: '^[0-9a-fA-F]{24}$'
                },
                minPrice: {
                    type: "number",
                    nullable: false,
                    minimum: 0,
                },
                maxPrice: {
                    type: "number",
                    nullable: false,
                    minimum: 0,
                },
            }
        }
    },
    fetchProductDetailsSchema: {
        params: {
            type: 'object',
            required: ["productId"],
            properties: {
                productId: {
                    type: 'string',
                    nullable: false,
                    pattern: '^[0-9a-fA-F]{24}$'
                },
            }
        }
    },
    createProductSchema: {
        body: {
            type: 'object',
            required: ['categoryId', 'name', 'description', 'price'],
            properties: {
                categoryId: {
                    type: 'string',
                    nullable: false,
                    pattern: '^[0-9a-fA-F]{24}$'
                },
                name: {
                    type: "string",
                    nullable: false,
                },
                description: {
                    type: "string",
                    nullable: false,
                },
                price: {
                    type: "number",
                    nullable: false,
                }
            }
        }
    },
}