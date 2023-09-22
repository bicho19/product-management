module.exports = {

    fetchCategoriesSchema: {
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
    createCategorySchema: {
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
                }
            }
        }
    },
}