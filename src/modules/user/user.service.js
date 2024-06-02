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
exports.changePassword = exports.updateEmail = exports.getUserSettings = exports.deleteUserById = exports.updatePassword = exports.findUserByEmailAndPassword = exports.uploadUserSettings = exports.createUser = exports.generateSalt = void 0;
const user_model_1 = require("./user.model");
const crypto_1 = __importDefault(require("crypto"));
const argon2_1 = __importDefault(require("argon2"));
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Generates a random salt for password hashing.
 * @returns {string} - Randomly generated salt.
 */
function generateSalt() {
    return crypto_1.default.randomBytes(64).toString("hex");
}
exports.generateSalt = generateSalt;
/**
 * Creates a new user with the provided hashed password and email.
 * @param {Object} input - User input containing hashed password and email.
 * @param {string} input.hashedPassword - Hashed password of the user.
 * @param {string} input.email - Email of the user.
 * @returns {Promise<UserModel>} - Promise resolving to the created user.
 */
function createUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.UserModel.create({
            email: input.email,
            password: input.hashedPassword,
        });
    });
}
exports.createUser = createUser;
/**
 * Updates the user's settings.
 * @param {string} userId - User ID.
 * @param {Object} settings - New settings for the user.
 * @returns {Promise<void>} - Promise resolving on successful settings update.
 * @throws {Error} - Throws an error if the user is not found or update fails.
 */
function uploadUserSettings(userId, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        // Define allowed settings
        const allowedSettings = ['autoLock', 'raw'];
        // Validate settings here...
        for (const key in settings) {
            if (!allowedSettings.includes(key)) {
                logger_1.default.error(`Invalid setting: ${key}`);
                throw new Error(`Invalid setting: ${key}`);
            }
            if (settings[key] !== 'true' && settings[key] !== 'false') {
                logger_1.default.error(`Invalid value for ${key}: ${settings[key]}. Only 'true' or 'false' are allowed.`);
                throw new Error(`Invalid value for ${key}: ${settings[key]}. Only 'true' or 'false' are allowed.`);
            }
        }
        logger_1.default.info(userId);
        // Save settings to user record in database
        const user = yield user_model_1.UserModel.findById(userId);
        logger_1.default.info(user);
        if (user) {
            user.settings = settings;
            yield user.save();
            logger_1.default.info(`User settings updated for user: ${userId}`);
        }
        else {
            logger_1.default.error('User not found.');
            throw new Error('User not found.');
        }
    });
}
exports.uploadUserSettings = uploadUserSettings;
/**
 * Generates a hash for the provided password using Argon2.
 * @param {string} password - Password to be hashed.
 * @returns {Promise<string>} - Promise resolving to the hashed password.
 */
function genHash(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return argon2_1.default.hash(password);
    });
}
/**
 * Finds a user by email and verifies the provided hashed password.
 * @param {Object} credentials - User credentials.
 * @param {string} credentials.email - Email of the user.
 * @param {string} credentials.hashedPassword - Hashed password to be verified.
 * @returns {Promise<UserModel>} - Promise resolving to the found and verified user.
 * @throws {Error} - Throws an error if the user is not found or credentials are invalid.
 */
function findUserByEmailAndPassword(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, hashedPassword, }) {
        try {
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            const isPasswordValid = yield argon2_1.default.verify(user.password, hashedPassword);
            if (!isPasswordValid) {
                throw new Error("Invalid credentials.");
            }
            return user;
        }
        catch (error) {
            console.error("Error finding user:", error);
            throw new Error("Internal server error");
        }
    });
}
exports.findUserByEmailAndPassword = findUserByEmailAndPassword;
/**
 * Updates the user's password.
 * @param {string} userId - User ID.
 * @param {string} newPassword - New password for the user.
 * @returns {Promise<void>} - Promise resolving on successful password update.
 */
function updatePassword(userId, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield genHash(newPassword);
        yield user_model_1.UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
    });
}
exports.updatePassword = updatePassword;
/**
 * Deletes a user by their ID.
 * @param {string} userId - User ID.
 * @returns {Promise<void>} - Promise resolving on successful user deletion.
 * @throws {Error} - Throws an error if the user is not found or deletion fails.
 */
function deleteUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.UserModel.findByIdAndDelete(userId);
            if (!user) {
                throw new Error("User not found");
            }
        }
        catch (error) {
            console.error("Error deleting user:", error);
            throw new Error("Failed to delete user");
        }
    });
}
exports.deleteUserById = deleteUserById;
function getUserSettings(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        const userObject = user.toObject();
        return userObject.settings;
    });
}
exports.getUserSettings = getUserSettings;
/**
 * Updates the user's email.
 * @param {string} userId - User ID.
 * @param {string} newEmail - New email for the user.
 * @returns {Promise<void>} - Promise resolving on successful email update.
 * @throws {Error} - Throws an error if the user is not found or update fails.
 */
function updateEmail(userId, newEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.UserModel.findByIdAndUpdate(userId, { email: newEmail });
            if (!user) {
                throw new Error("User not found");
            }
        }
        catch (error) {
            console.error("Error updating email:", error);
            throw new Error("Failed to update email");
        }
    });
}
exports.updateEmail = updateEmail;
/**
 * Changes the user's password.
 * @param {string} userId - User ID.
 * @param {string} currentPassword - Current password of the user.
 * @param {string} newPassword - New password for the user.
 * @returns {Promise<void>} - Promise resolving on successful password change.
 * @throws {Error} - Throws an error if the user is not found, current password is invalid, or password change fails.
 */
function changePassword(userId, currentPassword, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.UserModel.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const isCurrentPasswordValid = yield argon2_1.default.verify(user.password, currentPassword);
            if (!isCurrentPasswordValid) {
                throw new Error("Invalid current password");
            }
            const hashedNewPassword = yield genHash(newPassword);
            yield user_model_1.UserModel.findByIdAndUpdate(userId, {
                password: hashedNewPassword,
            });
        }
        catch (error) {
            console.error("Error changing password:", error);
            throw new Error("Failed to change password");
        }
    });
}
exports.changePassword = changePassword;
