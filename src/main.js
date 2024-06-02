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
const createServer_1 = __importDefault(require("./utils/createServer"));
const logger_1 = __importDefault(require("./utils/logger"));
const db_1 = require("./utils/db");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
/**
 * Handles the graceful shutdown of the Fastify server.
 * @param {string} signal - The signal received for the shutdown.
 * @param {FastifyInstance} app - The Fastify server instance.
 */
function gracefulShutdown(signal, app) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info("Shutting down server gracefully.");
            logger_1.default.info(`Received signal ${signal}`);
            // Close the Fastify server and disconnect from the database.
            yield app.close();
            yield (0, db_1.disconnectFromDB)();
            logger_1.default.info("Shutdown.");
            // Exit the process with a successful status code.
            process.exit(0);
        }
        catch (error) {
            // Log an error if the graceful shutdown encounters an error and exit the process with an error status code.
            logger_1.default.error("Error during graceful shutdown:", error);
            process.exit(1);
        }
    });
}
function fetchKeyFromUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            logger_1.default.error(`Error fetching key from URL ${url}:`, error);
            process.exit(1);
        }
    });
}
function fetchKeyFromFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keyContent = yield fs_1.default.readFileSync(filePath, "utf-8");
            return keyContent;
        }
        catch (error) {
            logger_1.default.error(`Error reading key from file ${filePath}:`, error);
            process.exit(1);
        }
    });
}
/**
 * Starts the Fastify server, listens on a specified port, and connects to the database.
 * @returns {FastifyInstance} - The Fastify server instance.
 */
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const privateFilePath = path_1.default.join(process.cwd(), "certs", "private.key");
            const publicFilePath = path_1.default.join(process.cwd(), "certs", "public.key");
            const privateKeyContent = yield fetchKeyFromFile(privateFilePath);
            const publicKeyContent = yield fetchKeyFromFile(publicFilePath);
            if (privateKeyContent === publicKeyContent) {
                logger_1.default.error('The private and public RSA keys are the same. Please check your keys.');
                process.exit(1);
            }
            const app = (0, createServer_1.default)();
            const url = yield app.listen(constants_1.PORT, constants_1.HOST);
            logger_1.default.info(`Server is ready at ${url}`);
            yield (0, db_1.connectToDb)();
            return app;
        }
        catch (error) {
            logger_1.default.error("Error starting the server:", error);
            process.exit(1);
        }
    });
}
/**
 * The main function that orchestrates the startup and shutdown of the Fastify server.
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Start the Fastify server.
            const app = yield startServer();
            // Define the signals to handle for graceful shutdown.
            const signals = ["SIGTERM", "SIGINT"];
            // Attach signal handlers for graceful shutdown.
            for (const signal of signals) {
                process.on(signal, () => __awaiter(this, void 0, void 0, function* () {
                    yield gracefulShutdown(signal, app);
                }));
            }
        }
        catch (error) {
            // Log an error if the main function encounters an error and exit the process with an error status code.
            logger_1.default.error("Error in main function:", error);
            process.exit(1);
        }
    });
}
// Invoke the main function to start the application.
main();
