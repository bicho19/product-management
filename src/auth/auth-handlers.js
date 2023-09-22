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

            const user = await User.findOne({
                email: request.body.email,
            });

            if (!user) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Wrong credentials"));
            }

            // Check admin password
            const isMatch = await bcrypt.compare(request.body.password, user.password);
            if (!isMatch) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST, "Wrong credentials"));
            }

            // else, send success request with token
            return response.send(SuccessResponse({
                user: user,
                token: request.server.jwt.sign({
                    id: user._id,
                    email: user.email
                }),
            }));
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

            const emailExists = await User.findOne({
                email: request.body.email,
            });

            if (emailExists) {
                return response.code(HTTP_STATUS_CODE.BAD_REQUEST)
                    .send(ErrorResponse(
                        HTTP_STATUS_CODE.BAD_REQUEST,
                        'Email already exists'
                        ));
            }

            // Create the user
            const user = await User.create({
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                email: request.body.email,
                password: request.body.password,
            });

            if (!user) {
                return response.code(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
                    .send(ErrorResponse(
                        HTTP_STATUS_CODE.BAD_REQUEST,
                        'Email already exists'
                    ));
            }


            return response.send(SuccessResponse(user));

        } catch (exception) {
            request.log.error({exception}, "Error signup user");
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
                token: request.server.jwt.sign({
                    id: admin._id,
                    email: admin.email
                }),
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