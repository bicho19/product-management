module.exports = {

    loginUserSchema: {
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: {
                    type: 'string',
                    nullable: false,
                    pattern: '[A-Z0-9a-z._+-]+@[A-Za-z0-9-]+\\.[A-Za-z]{2,5}',
                },
                password: {
                    type: 'string',
                    nullable: false,
                    minLength: 6,
                },
            },
        },
    },
    signupUserSchema: {
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: {
                    type: 'string',
                    nullable: false,
                    pattern: '[A-Z0-9a-z._+-]+@[A-Za-z0-9-]+\\.[A-Za-z]{2,5}',
                },
                password: {
                    type: 'string',
                    nullable: false,
                    minLength: 6,
                },
            },
        },
    },

}