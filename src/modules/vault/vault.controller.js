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
exports.updateVaultHandler = void 0;
const lodash_1 = require("lodash");
const vault_service_1 = require("./vault.service");
const logger_1 = __importDefault(require("../../utils/logger"));
function updateVaultHandler(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = (0, lodash_1.get)(request, "user._id");
        try {
            if (userId) {
                yield (0, vault_service_1.updateVault)({
                    data: request.body.encryptedVault,
                    userId: userId,
                });
                return reply.code(200).send("Vault updated");
            }
            else {
                return reply.code(401).send("User not authenticated");
            }
        }
        catch (e) {
            logger_1.default.error(e, "error updating vault");
            return reply.code(500).send(e);
        }
    });
}
exports.updateVaultHandler = updateVaultHandler;
