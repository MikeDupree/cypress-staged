"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const CONFIG_NAME = 'cystaged.config.js';
function getConfig(rootDir = '') {
    if (!rootDir) {
        rootDir = process.cwd();
    }
    const configPath = path_1.default.join(rootDir, CONFIG_NAME);
    if (fs_1.default.existsSync(configPath)) {
        try {
            const config = require(configPath);
            return config;
        }
        catch (err) {
            console.error(err);
        }
    }
    return undefined;
}
exports.getConfig = getConfig;
