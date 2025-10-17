"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadModel = void 0;
const mongoose_1 = require("mongoose");
const LoadSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    power: { type: Number, required: true },
}, { timestamps: true });
exports.LoadModel = (0, mongoose_1.model)("Load", LoadSchema);
