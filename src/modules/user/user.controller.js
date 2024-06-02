"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.verifyHashedPassword = exports.loginHandler = exports.registerUserHandler = void 0;
const user_service_1 = require("./user.service");
const vault_service_1 = require("../vault/vault.service");
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../utils/logger"));
const user_model_1 = require("./user.model");
const argon2_1 = __importDefault(require("argon2"));
/**
 * Handles the registration of a new user.
 * @param {FastifyRequest} request - The Fastify request object.
 * @param {FastifyReply} reply - The Fastify reply object.
 * @returns {FastifyReply} - The Fastify reply with appropriate status code and response body.
 */
function registerUserHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extract the request body.
        const body = request.body;
        try {
            // Create a new user.
            const user = yield (0, user_service_1.createUser)(body);
            // Generate a salt for the user's vault.
            const salt = (0, user_service_1.generateSalt)();
            // Create a vault for the user.
            const vault = yield (0, vault_service_1.createVault)({ user: user._id.toString(), salt });
            // Generate an access token for the user.
            const accessToken = yield reply.jwtSign({
                _id: user._id,
                email: user.email,
            });
            // Set the access token as a cookie in the response.
            reply.setCookie("token", accessToken, {
                domain: constants_1.COOKIE_DOMAIN,
                path: "/",
                secure: constants_1.SECURE,
                httpOnly: constants_1.HTTPONLY,
                sameSite: constants_1.SAMESITE,
            });
            // Respond with a 201 status code and the access token, vault data, and salt.
            return reply.code(201).send({ accessToken, vault: vault.data, salt });
        }
        catch (e) {
            // Log an error and respond with a 500 status code if an error occurs during user creation.
            logger_1.default.error(e, "Error creating user.");
            return reply.code(500).send(e);
        }
    });
}
exports.registerUserHandler = registerUserHandler;
/**
 * Handles user login.
 * @param {FastifyRequest} request - The Fastify request object.
 * @param {FastifyReply} reply - The Fastify reply object.
 * @returns {FastifyReply} - The Fastify reply with appropriate status code and response body.
 */
function loginHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        // Find the user based on email and password.
        const user = yield (0, user_service_1.findUserByEmailAndPassword)(request.body);
        // If the user is not found, respond with a 401 status code.
        if (!user) {
            return reply.status(401).send({
                message: "Invalid email or password",
            });
        }
        // Find the user's vault.
        const vault = yield (0, vault_service_1.findVaultByUser)(user._id.toString());
        // Generate an access token for the user.
        const accessToken = yield reply.jwtSign({
            _id: user._id,
            email: user.email,
        });
        // Set the access token as a cookie in the response.
        reply.setCookie("token", accessToken, {
            domain: constants_1.COOKIE_DOMAIN,
            path: "/",
            secure: constants_1.SECURE,
            httpOnly: constants_1.HTTPONLY,
            sameSite: constants_1.SAMESITE,
        });
        // Respond with a 200 status code and the access token, vault data, and salt.
        return reply
            .code(200)
            .send({ accessToken, vault: vault === null || vault === void 0 ? void 0 : vault.data, salt: vault === null || vault === void 0 ? void 0 : vault.salt })
            .redirect('/');
    });
}
exports.loginHandler = loginHandler;
/**
 * Verifies a user's hashed password.
 * @param {string} userId - User ID.
 * @param {string} hashedPassword - Hashed password to be verified.
 * @returns {Promise<boolean>} - Promise resolving to whether the password is valid.
 * @throws {Error} - Throws an error if the user is not found.
 */
function verifyHashedPassword(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, hashedPassword } = request.body;
        try {
            const user = yield user_model_1.UserModel.findById(userId);
            if (!user) {
                return reply.status(404).send({ message: 'User not found' });
            }
            const isPasswordValid = yield argon2_1.default.verify(user.password, hashedPassword);
            if (!isPasswordValid) {
                return reply.status(401).send({ message: 'Invalid password' });
            }
            return reply
                .code(200);
        }
        catch (error) {
            reply.status(500).send({ error: error.toString() });
        }
    });
}
exports.verifyHashedPassword = verifyHashedPassword;
function verifyPassword(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, password } = request.body;
        try {
            const user = yield user_model_1.UserModel.findById(userId);
            if (!user) {
                return reply.status(404).send({ message: 'User not found' });
            }
            const isPasswordValid = yield argon2_1.default.verify(user.password, password);
            if (!isPasswordValid) {
                return reply.status(401).send({ message: 'Invalid password' });
            }
            return reply.code(200).send({ message: 'Password is valid' });
        }
        catch (error) {
            reply.status(500).send({ error: error.toString() });
        }
    });
}
exports.verifyPassword = verifyPassword;
