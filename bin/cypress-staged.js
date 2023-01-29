#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commands_1 = require("./Commands");
const config_1 = require("./utils/config");
const config = (0, config_1.getConfig)();
if (config) {
    (0, Commands_1.run)(config);
}
else {
    console.error("Missing cystaged.config.ts");
}
