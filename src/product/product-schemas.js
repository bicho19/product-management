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
                    minimum: 20,
                }
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