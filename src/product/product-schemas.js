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
            required: ['name', 'description'],
            properties: {
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