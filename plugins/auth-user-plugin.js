const fp = require("fastify-plugin");
const User = require('../database/models/user');
const {HTTP_STATUS_CODE, ErrorResponse} = require("../utils/response-util");

const authPlugin = async function(fastify, _, next) {
    fastify.decorate("authenticate", async function(request, reply) {
        try {
            const data = await request.jwtVerify();
            // Check if user exists and not blocked
            const user = await User.find({
                _id: data.id,
            });

            if (!user || user.isBlocked) {
                return reply.code(HTTP_STATUS_CODE.UNAUTHORIZED)
                    .send(ErrorResponse(HTTP_STATUS_CODE.UNAUTHORIZED, "You cannot access this page"));
            }

            // Assign the user to the request object
            request.user = {
                id: data.id,
                email: data.email,
            };
        } catch (err) {
            reply.send(err)
        }
    })
    next()
}
module.exports = fp(authPlugin);