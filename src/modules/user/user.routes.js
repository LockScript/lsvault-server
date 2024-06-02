"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./user.controller");
const userService = __importStar(require("./user.service"));
const user_service_1 = require("./user.service");
/**
 * Defines routes related to user functionality.
 * @param {FastifyInstance} app - The Fastify instance to which the routes are added.
 * @param {FastifyPluginOptions} _ - FastifyPluginOptions object (not used in this function).
 * @param {(err?: FastifyError) => void} done - Callback function to signal completion.
 */
function userRoutes(app, _, done) {
    // Define a POST route for user registration.
    app.post("/", user_controller_1.registerUserHandler);
    // Define a POST route for user login.
    app.post("/login", user_controller_1.loginHandler);
    app.post('/validate', user_controller_1.verifyPassword);
    app.post('/settings', (request) => __awaiter(this, void 0, void 0, function* () {
        const { userId, settings } = request.body;
        yield (0, user_service_1.uploadUserSettings)(userId, settings);
    }));
    app.get('/settings/:userId', (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = request.params.userId;
            const user = yield userService.getUserSettings(userId);
            reply.send(user);
        }
        catch (error) {
            reply.status(500).send({ error: error.message });
        }
    }));
    // Signal that route registration is complete.
    done();
}
// Export the userRoutes function as the default export for this module.
exports.default = userRoutes;
