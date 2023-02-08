import path from 'path';
import fs from 'fs';

const CONFIG_NAME = 'cystaged.config.js';

export interface Config {
  projectsPath: string,
  include: string,
  types: string[],
  cypressPath?: string
}

export function getConfig(rootDir: string = ''): Config | undefined {
  if (!rootDir) {
    rootDir = process.cwd();
  }

  const configPath = path.join(rootDir, CONFIG_NAME);

  if (fs.existsSync(configPath)) {
    try {
      const config = require(configPath);
      return config;
    } catch (err) {
      console.error(err)
    }
  }

  return undefined;
}

