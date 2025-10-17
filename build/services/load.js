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
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_load = exports.update_load = exports.get_loads = exports.add_load = exports.load_exitss = void 0;
const loads_1 = require("../schema/loads");
const load_exitss = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield loads_1.LoadModel.exists({ name });
});
exports.load_exitss = load_exitss;
const add_load = (name, power) => __awaiter(void 0, void 0, void 0, function* () {
    return yield loads_1.LoadModel.create({ name, power });
});
exports.add_load = add_load;
const get_loads = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield loads_1.LoadModel.find();
});
exports.get_loads = get_loads;
const update_load = (name, new_power) => __awaiter(void 0, void 0, void 0, function* () {
    const load = yield loads_1.LoadModel.findOne({ name });
    if (!load)
        return;
    yield load.updateOne({ new_power });
});
exports.update_load = update_load;
const delete_load = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const load = yield loads_1.LoadModel.findOne({ name });
    if (!load)
        return;
    yield load.deleteOne({ name });
});
exports.delete_load = delete_load;
