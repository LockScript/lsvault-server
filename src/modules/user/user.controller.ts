import { FastifyReply, FastifyRequest } from "fastify";
import {
  createUser,
  findUserByEmailAndPassword,
  generateSalt,
} from "./user.service";
import { createVault, findVaultByUser } from "../vault/vault.service";
import { COOKIE_DOMAIN, HTTPONLY, SAMESITE, SECURE } from "../../constants";
import logger from "../../utils/logger";
import { UserModel } from "./user.model";
import argon2 from "argon2";

/**
 * Handles the registration of a new user.
 * @param {FastifyRequest} request - The Fastify request object.
 * @param {FastifyReply} reply - The Fastify reply object.
 * @returns {FastifyReply} - The Fastify reply with appropriate status code and response body.
 */
export async function registerUserHandler(
  request: FastifyRequest<{
    Body: Parameters<typeof createUser>[number];
  }>,
  reply: FastifyReply
) {
  // Extract the request body.
  const body = request.body;

  try {
    // Create a new user.
    const user = await createUser(body);

    // Generate a salt for the user's vault.
    const salt = generateSalt();

    // Create a vault for the user.
    const vault = await createVault({ user: user._id.toString(), salt });

    // Generate an access token for the user.
    const accessToken = await reply.jwtSign({
      _id: user._id!,
      email: user.email,
    });

    // Set the access token as a cookie in the response.
    reply.setCookie("token", accessToken, {
      domain: COOKIE_DOMAIN,
      path: "/",
      secure: SECURE,
      httpOnly: HTTPONLY,
      sameSite: SAMESITE,
    });

    // Respond with a 201 status code and the access token, vault data, and salt.
    return reply.code(201).send({ accessToken, vault: vault.data, salt });
  } catch (e) {
    // Log an error and respond with a 500 status code if an error occurs during user creation.
    logger.error(e, "Error creating user.");
    return reply.code(500).send(e);
  }
}

/**
 * Handles user login.
 * @param {FastifyRequest} request - The Fastify request object.
 * @param {FastifyReply} reply - The Fastify reply object.
 * @returns {FastifyReply} - The Fastify reply with appropriate status code and response body.
 */
export async function loginHandler(
  request: FastifyRequest<{
    Body: Parameters<typeof createUser>[number];
  }>,
  reply: FastifyReply
) {
  // Find the user based on email and password.
  const user = await findUserByEmailAndPassword(request.body);

  // If the user is not found, respond with a 401 status code.
  if (!user) {
    return reply.status(401).send({
      message: "Invalid email or password",
    });
  }

  // Find the user's vault.
  const vault = await findVaultByUser(user._id.toString());

  // Generate an access token for the user.
  const accessToken = await reply.jwtSign({
    _id: user._id!,
    email: user.email,
  });

  // Set the access token as a cookie in the response.
  reply.setCookie("token", accessToken, {
    domain: COOKIE_DOMAIN,
    path: "/",
    secure: SECURE,
    httpOnly: HTTPONLY,
    sameSite: SAMESITE,
  });

  // Respond with a 200 status code and the access token, vault data, and salt.
  return reply
    .code(200)
    .send({ accessToken, vault: vault?.data, salt: vault?.salt })
    .redirect('/')
}

/**
 * Verifies a user's hashed password.
 * @param {string} userId - User ID.
 * @param {string} hashedPassword - Hashed password to be verified.
 * @returns {Promise<boolean>} - Promise resolving to whether the password is valid.
 * @throws {Error} - Throws an error if the user is not found.
 */
export async function verifyHashedPassword(
  request: FastifyRequest<{
    Body: {
      userId: string;
      hashedPassword: string;
    };
  }>,
  reply: FastifyReply
): Promise<void> {
  const { userId, hashedPassword } = request.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    const isPasswordValid = await argon2.verify(user.password, hashedPassword);

    if (!isPasswordValid) {
      return reply.status(401).send({ message: 'Invalid password' });
    }

    return reply
      .code(200)
  } catch (error: any) {
    reply.status(500).send({ error: error.toString() });
  }
}

export async function verifyPassword(
  request: FastifyRequest<{
    Body: {
      userId: string;
      password: string;
    };
  }>,
  reply: FastifyReply
): Promise<void> {
  const { userId, password } = request.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return reply.status(401).send({ message: 'Invalid password' });
    }

    return reply.code(200).send({ message: 'Password is valid' });
  } catch (error: any) {
    reply.status(500).send({ error: error.toString() });
  }
}