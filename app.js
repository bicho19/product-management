require('dotenv').config();
const db =  require('./database');
const routes = require('./routes');

// Initialize the server
const fastify = require('fastify')({
    logger: true,
});

//
fastify.register(db, { uri: process.env.DB_URI });

// JWT authentication plugin
fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET,
    sign: {
        algorithm: 'HS256',
        iss: 'legal-doctrine.com',
        expiresIn: "30d"
    },
});

fastify.register(require('./plugins/auth-user-plugin'), {});
fastify.register(require('./plugins/auth-admin-plugin'), {});


// declare the routes
routes(fastify);

// Set default page
fastify.get('/', (request, reply) => {
    return reply.send({
        statusCode: 200,
        message: 'API is up and running'
    });
})
// Run the server!
fastify.listen(
    {
        port: process.env.PORT || 5000,
        host: process.env.HOST || '0.0.0.0'
    }, function (err, address) {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        // Server is now listening on ${address}
    });