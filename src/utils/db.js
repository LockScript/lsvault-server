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
exports.disconnectFromDB = exports.connectToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const constants_1 = require("../constants");
/**
 * Connects to the MongoDB database using the specified connection string.
 * Logs an error and exits the process with an error status code if the connection fails.
 */
function connectToDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Attempt to connect to the MongoDB database using the provided connection string.
            yield mongoose_1.default.connect(constants_1.DB_CONNECTION_STRING);
        }
        catch (e) {
            // Log an error and exit the process with an error status code if the connection attempt fails.
            logger_1.default.error(e, "Error connecting to the database");
            process.exit(1);
        }
    });
}
exports.connectToDb = connectToDb;
/**
 * Disconnects from the MongoDB database.
 * Logs an info message indicating successful disconnection.
 */
function disconnectFromDB() {
    return __awaiter(this, void 0, void 0, function* () {
        // Close the connection to the MongoDB database.
        yield mongoose_1.default.connection.close();
        // Log an info message indicating successful disconnection.
        logger_1.default.info("Disconnected from the database");
        // Return from the function.
        return;
    });
}
exports.disconnectFromDB = disconnectFromDB;
