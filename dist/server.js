"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("salom dunyo");
const moment_1 = __importDefault(require("moment"));
const currentTime = (0, moment_1.default)().format();
console.log(currentTime);
const person = "Jack";
const count = 100;
