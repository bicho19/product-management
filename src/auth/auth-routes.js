const AuthSchema = require("./auth-schemas");
const AuthHandlers = require("./auth-handlers");


/**
 *
 * @param {FastifyInstance} fastify
 * @param {RouteOptions} options
 * @param {function} done: callback
 */

module.exports = (fastify, options, done) => {

    fastify.post(
        "/login",
        {
            schema: AuthSchema.loginUserSchema,
        },
        AuthHandlers.loginUserHandler,
    );

    fastify.post(
        "/signup",
        {
            schema: AuthSchema.signupUserSchema,
        },
        AuthHandlers.signupUserHandler,
    );


    fastify.post(
        "/admin/login",
        {
            schema: AuthSchema.loginUserSchema,
        },
        AuthHandlers.loginAdminHandler,
    );

    done();
}