"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vault_controller_1 = require("./vault.controller");
/**
 * Defines the routes related to the vault functionality.
 * @param {FastifyInstance} app - The Fastify instance to which the routes are added.
 * @param {FastifyPluginOptions} _ - FastifyPluginOptions object (not used in this function).
 * @param {(err?: FastifyError) => void} done - Callback function to signal completion.
 */
function vaultRoutes(app, _, done) {
    // Define a PUT route for updating the vault.
    app.put("/", {
        // Use the app.authenticate onRequest hook to enforce authentication before processing the request.
        onRequest: [app.authenticate],
    }, 
    // Use the updateVaultHandler function as the route handler.
    vault_controller_1.updateVaultHandler);
    // Signal that route registration is complete.
    done();
}
// Export the vaultRoutes function as the default export for this module.
exports.default = vaultRoutes;
