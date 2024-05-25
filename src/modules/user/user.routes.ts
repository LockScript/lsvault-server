import { FastifyError, FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { loginHandler, registerUserHandler } from "./user.controller";
import * as userService from './user.service';
import { uploadUserSettings } from "./user.service";


/**
 * Defines routes related to user functionality.
 * @param {FastifyInstance} app - The Fastify instance to which the routes are added.
 * @param {FastifyPluginOptions} _ - FastifyPluginOptions object (not used in this function).
 * @param {(err?: FastifyError) => void} done - Callback function to signal completion.
 */
function userRoutes(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: FastifyError) => void
) {
  // Define a POST route for user registration.
  app.post("/", registerUserHandler);

  // Define a POST route for user login.
  app.post("/login", loginHandler);

  app.post('/settings', async (request) => {
    const { userId, settings } = request.body as { userId: string, settings: any };
    await uploadUserSettings(userId, settings);
  });

  app.get('/settings/:userId', async (request: FastifyRequest<{ Params: { userId: string } }>, reply) => {
    try {
      const userId = request.params.userId;
      const user = await userService.getUserSettings(userId);

      reply.send(user);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  });

  // Signal that route registration is complete.
  done();
}

// Export the userRoutes function as the default export for this module.
export default userRoutes;
