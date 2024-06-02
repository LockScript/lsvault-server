"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultModel = exports.Vault = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const user_model_1 = require("../user/user.model");
const constants_1 = require("../../constants");
// Define the Vault class, representing the structure of a vault document in the database.
class Vault {
}
exports.Vault = Vault;
__decorate([
    (0, typegoose_1.prop)({ required: true, ref: () => user_model_1.User }),
    __metadata("design:type", Object)
], Vault.prototype, "user", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: "" }),
    __metadata("design:type", String)
], Vault.prototype, "data", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Vault.prototype, "salt", void 0);
// Create the VaultModel using the Vault class and additional schema options.
exports.VaultModel = (0, typegoose_1.getModelForClass)(Vault, {
    schemaOptions: {
        timestamps: constants_1.VAULT_TIMESTAMPS,
    },
});
