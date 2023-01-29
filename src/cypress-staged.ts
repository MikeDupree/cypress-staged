#!/usr/bin/env node

import { run } from './Commands';
import { getConfig } from './utils/config';

const config = getConfig();

if (config) {
  run(config);
}
else {
  console.error("Missing cystaged.config.ts");
}

