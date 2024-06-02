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
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const vault_route_1 = __importDefault(require("../modules/vault/vault.route"));
const user_routes_1 = __importDefault(require("../modules/user/user.routes"));
const constants_1 = require("../constants");
/**
 * Creates a Fastify server instance with necessary plugins and route registrations.
 * @returns {FastifyInstance} - The configured Fastify server instance.
 */
function createServer() {
    // Create a new Fastify server instance.
    const app = (0, fastify_1.default)();
    // Register CORS plugin to enable Cross-Origin Resource Sharing.
    app.register(cors_1.default, {
        origin: constants_1.CORS_ORIGIN,
        credentials: true,
    });
    // Register JWT authentication plugin for handling JSON Web Tokens.
    app.register(jwt_1.default, {
        secret: {
            private: fs_1.default.readFileSync(path_1.default.join(process.cwd(), "certs", "private.key")),
            public: fs_1.default.readFileSync(path_1.default.join(process.cwd(), "certs", "public.key")),
        },
        sign: {
            algorithm: "RS256",
        },
        cookie: {
            cookieName: constants_1.COOKIE_NAME,
            signed: constants_1.SIGNED,
        },
    });
    // Register the Fastify cookie plugin for handling cookies.
    app.register(cookie_1.default, {
        parseOptions: {},
    });
    // Decorate the Fastify instance with a custom 'authenticate' method.
    app.decorate("authenticate", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Verify the JWT and attach user information to the request.
            const user = yield request.jwtVerify();
            request.user = user;
        }
        catch (e) {
            // Handle authentication errors and send the error response.
            return reply.send(e);
        }
    }));
    // Register userRoutes with a prefix of 'api/users'.
    app.register(user_routes_1.default, { prefix: "api/users" });
    // Register vaultRoutes with a prefix of 'api/vault'.
    app.register(vault_route_1.default, { prefix: "api/vault" });
    // Return the configured Fastify server instance.
    return app;
}
// Export the createServer function as the default export for this module.
exports.default = createServer;
