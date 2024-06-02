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
exports.findVaultByUser = exports.updateVault = exports.createVault = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const vault_model_1 = require("./vault.model");
/**
 * Creates a new vault entry in the database.
 * @param {Object} params - Parameters for creating a vault.
 * @param {string} params.user - The user associated with the vault.
 * @param {string} params.salt - The salt for the vault.
 * @returns {Promise<VaultModel>} - Promise resolving to the created vault document.
 * @throws {Error} - Throws an error if creating the vault fails.
 */
function createVault(_a) {
    return __awaiter(this, arguments, void 0, function* ({ user, salt }) {
        try {
            // Attempt to create a new vault entry in the database.
            const vault = yield vault_model_1.VaultModel.create({ user, salt });
            logger_1.default.info(`Vault created successfully for user: ${user}`);
            return vault;
        }
        catch (error) {
            // Log an error if creating the vault fails and throw an error.
            logger_1.default.error(`Error creating vault for user ${user}:`, error);
            throw new Error("Failed to create vault");
        }
    });
}
exports.createVault = createVault;
/**
 * Updates the data property of a vault entry in the database.
 * @param {Object} params - Parameters for updating a vault.
 * @param {string} params.userId - The user associated with the vault.
 * @param {string} params.data - The new data to be stored in the vault.
 * @returns {Promise<boolean>} - Promise resolving to a boolean indicating whether the update was successful.
 * @throws {Error} - Throws an error if updating the vault fails.
 */
function updateVault(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, data }) {
        try {
            // Attempt to update the data property of the vault associated with the user.
            const result = yield vault_model_1.VaultModel.updateOne({ user: userId }, { data });
            return result.modifiedCount > 0;
        }
        catch (error) {
            // Log an error if updating the vault fails and throw an error.
            logger_1.default.error(`Error updating vault for user ${userId}:`, error);
            throw new Error("Failed to update vault");
        }
    });
}
exports.updateVault = updateVault;
/**
 * Finds a vault entry in the database based on the associated user.
 * @param {string} userId - The user associated with the vault.
 * @returns {Promise<VaultModel | null>} - Promise resolving to the found vault document or null if not found.
 * @throws {Error} - Throws an error if finding the vault fails.
 */
function findVaultByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Attempt to find a vault entry in the database based on the associated user.
            const vault = yield vault_model_1.VaultModel.findOne({ user: userId });
            return vault;
        }
        catch (error) {
            // Log an error if finding the vault fails and throw an error.
            logger_1.default.error(`Error finding vault for user ${userId}:`, error);
            throw new Error("Failed to find vault");
        }
    });
}
exports.findVaultByUser = findVaultByUser;
