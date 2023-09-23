const fp = require("fastify-plugin");
const Admin = require('../database/models/admin');
const {HTTP_STATUS_CODE, ErrorResponse} = require("../utils/response-util");

const authAdminPlugin = async function(fastify, _, next) {
    fastify.decorate("authenticateAdmin", async function(request, reply) {
        try {
            const data = await request.jwtVerify();
            // Check if user exists and not blocked
            const admin = await Admin.find({
                _id: data.id,
            });

            if (!admin) {
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
module.exports = fp(authAdminPlugin);