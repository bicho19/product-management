const fp = require("fastify-plugin")

module.exports = fp(async function(fastify, opts) {
    fastify.decorate("authenticateAdmin", async function(request, reply) {
        try {
            const data = await request.jwtVerify();
            console.log('Success verify admin jwt');
            console.log(data);
            return data;
        } catch (err) {
            console.log('Error verifying the admin token');
            reply.send(err)
        }
    })
})