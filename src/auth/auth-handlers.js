const Admin = require('../../database/models/admin');
const User = require('../../database/models/user');
const {ErrorResponse, HTTP_STATUS_CODE, SuccessResponse} = require("../../utils/response-util");
const bcrypt = require("bcrypt");

module.exports = {

    /**
     * Login user handler
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    loginUserHandler: async (request, response) => {
        try {

        } catch (exception) {
            return response.code(500)
                .send({
                    message: 'Error logging the user',
                    code: 'SERVER_ERROR',
                });

        }
    },

    /**
     * Signup user handler
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    signupUserHandler: async (request, response) => {
        try {

        } catch (exception) {
            return response.code(500)
                .send({
                    message: 'Error signup the user',
                    code: 'SERVER_ERROR',
                });

        }
    },

    /**
     * Login admin handler
     * @param {FastifyRequest} request
     * @param {FastifyReply} response
     */
    loginAdminHandler: async (request, response) => {
        try {

            const admin = await Admin.findOne({
                email: request.body.email,
            });

            if (!admin) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Wrong credentials"));
            }

            // Check admin password
            const isMatch = await bcrypt.compare(request.body.password, admin.password);
            if (!isMatch) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Wrong credentials"));
            }

            // else, send success request with token
            return response.send(SuccessResponse({
                admin: admin,
                token: 'to be generated'
            }));

        } catch (exception) {
            return response.code(500)
                .send({
                    message: 'Error login admin',
                    code: 'SERVER_ERROR',
                });

        }
    },
}