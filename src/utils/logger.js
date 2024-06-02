"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
// Create a Pino logger instance with a pretty-printing transport.
const logger = (0, pino_1.default)({
    transport: {
        // Use the 'pino-pretty' transport for human-readable console output.
        target: "pino-pretty",
        options: {
            // Ignore the 'hostname' field when pretty-printing logs.
            ignore: "hostname",
        },
    },
});
// Export the logger instance as the default export for this module.
exports.default = logger;
