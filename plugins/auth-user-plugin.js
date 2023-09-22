const fp = require("fastify-plugin")

const authPlugin = async function(fastify, _, next) {
    fastify.decorate("authenticate", async function(request, reply) {
        try {
            const data = await request.jwtVerify();
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