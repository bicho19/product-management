const fp = require('fastify-plugin');
const mongoose = require('mongoose');
const Admin = require('./models/admin');
const User = require('./models/user');
const Product = require('./models/product');
const Category = require('./models/category');
const models = { User, Product, Category, Admin };

const ConnectDB = async (fastify, options) => {
    try {
        mongoose.connection.on('connected', () => {
            fastify.log.info({ actor: 'MongoDB' }, 'Database connected');
        });
        mongoose.connection.on('disconnected', () => {
            fastify.log.error({ actor: 'MongoDB' }, 'Database disconnected');
        });
        const db = await mongoose.connect(options.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Check default admin
        const defaultAdmin = await Admin.findOne({
            email: 'admin@legal-doctrine.com',
        });

        if (!defaultAdmin){
            fastify.log.info('creating default app admin');
            const defaultAdmin = await Admin.create({
                email: 'admin@legal-doctrine.com',
                password: "legal123456!"
            });
        }

        // decorates fastify with our model
        fastify.decorate('db', { models });
    } catch (error) {
        console.error(error);
    }
};
module.exports = fp(ConnectDB);