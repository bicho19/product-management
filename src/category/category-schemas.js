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
    updateCategorySchema: {
        params: {
            type: 'object',
            required: ["categoryId"],
            properties: {
                categoryId: {
                    type: 'string',
                    nullable: false,
                    pattern: '^[0-9a-fA-F]{24}$'
                },
            }
        },
        body: {
            type: 'object',
            required: [],
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

    deleteCategorySchema: {
        params: {
            type: 'object',
            required: ["categoryId"],
            properties: {
                categoryId: {
                    type: 'string',
                    nullable: false,
                    pattern: '^[0-9a-fA-F]{24}$'
                },
            }
        },
    },
}