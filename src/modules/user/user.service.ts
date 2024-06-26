import { UserModel } from "./user.model";
import crypto from "crypto";
import argon2 from "argon2";
import { Types } from "mongoose";
import logger from "../../utils/logger";

/**
 * Generates a random salt for password hashing.
 * @returns {string} - Randomly generated salt.
 */
export function generateSalt() {
  return crypto.randomBytes(64).toString("hex");
}

/**
 * Creates a new user with the provided hashed password and email.
 * @param {Object} input - User input containing hashed password and email.
 * @param {string} input.hashedPassword - Hashed password of the user.
 * @param {string} input.email - Email of the user.
 * @returns {Promise<UserModel>} - Promise resolving to the created user.
 */
export async function createUser(input: {
  hashedPassword: string;
  email: string;
}) {
  return UserModel.create({
    email: input.email,
    password: input.hashedPassword,
  });
}

/**
 * Updates the user's settings.
 * @param {string} userId - User ID.
 * @param {Object} settings - New settings for the user.
 * @returns {Promise<void>} - Promise resolving on successful settings update.
 * @throws {Error} - Throws an error if the user is not found or update fails.
 */
export async function uploadUserSettings(
  userId: string,
  settings: Record<string, string>
): Promise<void> {
  // Define allowed settings
  const allowedSettings = ['autoLock', 'raw'];

  // Validate settings here...
  for (const key in settings) {
    if (!allowedSettings.includes(key)) {
      logger.error(`Invalid setting: ${key}`);
      throw new Error(`Invalid setting: ${key}`);
    }

    if (settings[key] !== 'true' && settings[key] !== 'false') {
      logger.error(`Invalid value for ${key}: ${settings[key]}. Only 'true' or 'false' are allowed.`);
      throw new Error(`Invalid value for ${key}: ${settings[key]}. Only 'true' or 'false' are allowed.`);
    }
  }

  logger.info(userId)
  // Save settings to user record in database
  const user = await UserModel.findById(userId);
  logger.info(user)

  if (user) {
    user.settings = settings;
    await user.save();
    logger.info(`User settings updated for user: ${userId}`);
  } else {
    logger.error('User not found.');
    throw new Error('User not found.');
  }
}

/**
 * Generates a hash for the provided password using Argon2.
 * @param {string} password - Password to be hashed.
 * @returns {Promise<string>} - Promise resolving to the hashed password.
 */
async function genHash(password: string) {
  return argon2.hash(password);
}

interface UserCredentials {
  email: string;
  hashedPassword: string;
}

/**
 * Finds a user by email and verifies the provided hashed password.
 * @param {Object} credentials - User credentials.
 * @param {string} credentials.email - Email of the user.
 * @param {string} credentials.hashedPassword - Hashed password to be verified.
 * @returns {Promise<UserModel>} - Promise resolving to the found and verified user.
 * @throws {Error} - Throws an error if the user is not found or credentials are invalid.
 */
export async function findUserByEmailAndPassword({
  email,
  hashedPassword,
}: UserCredentials) {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await argon2.verify(user.password, hashedPassword);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    throw new Error("Internal server error");
  }
}

/**
 * Updates the user's password.
 * @param {string} userId - User ID.
 * @param {string} newPassword - New password for the user.
 * @returns {Promise<void>} - Promise resolving on successful password update.
 */
export async function updatePassword(
  userId: string,
  newPassword: string
): Promise<void> {
  const hashedPassword = await genHash(newPassword);
  await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
}

/**
 * Deletes a user by their ID.
 * @param {string} userId - User ID.
 * @returns {Promise<void>} - Promise resolving on successful user deletion.
 * @throws {Error} - Throws an error if the user is not found or deletion fails.
 */
export async function deleteUserById(userId: string): Promise<void> {
  try {
    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function getUserSettings(userId: string): Promise<Record<string, boolean | undefined>> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found.');
  }
  const userObject = user.toObject();
  return userObject.settings;
}

/**
 * Updates the user's email.
 * @param {string} userId - User ID.
 * @param {string} newEmail - New email for the user.
 * @returns {Promise<void>} - Promise resolving on successful email update.
 * @throws {Error} - Throws an error if the user is not found or update fails.
 */
export async function updateEmail(
  userId: string,
  newEmail: string
): Promise<void> {
  try {
    const user = await UserModel.findByIdAndUpdate(userId, { email: newEmail });

    if (!user) {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error updating email:", error);
    throw new Error("Failed to update email");
  }
}

/**
 * Changes the user's password.
 * @param {string} userId - User ID.
 * @param {string} currentPassword - Current password of the user.
 * @param {string} newPassword - New password for the user.
 * @returns {Promise<void>} - Promise resolving on successful password change.
 * @throws {Error} - Throws an error if the user is not found, current password is invalid, or password change fails.
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isCurrentPasswordValid = await argon2.verify(
      user.password,
      currentPassword
    );

    if (!isCurrentPasswordValid) {
      throw new Error("Invalid current password");
    }

    const hashedNewPassword = await genHash(newPassword);

    await UserModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error("Failed to change password");
  }
}