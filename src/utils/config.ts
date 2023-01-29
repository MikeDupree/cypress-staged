import path from 'path';
import fs from 'fs';

const CONFIG_NAME = 'cystaged.config.ts';

function init(rootDir: string = '') {
  console.log(`test-package: process.cwd(): ${process.cwd()}`);
  console.log(`test-package: path.resolve('./'): ${path.resolve('./')}`);

  if (!rootDir) {
    //rootDir = path.resolve('./');
    // OR
    rootDir = process.cwd();
  }

  //const configPath = path.resolve('./', CONFIG_NAME);
  // OR
  const configPath = path.join(rootDir, CONFIG_NAME);


  if (fs.existsSync(configPath)) {
    console.log(`test-package: Reading config from: ${configPath}`);
    try {
      //const data = fs.readFileSync(configPath, 'utf8');
      //const config = JSON.parse(data);
      // OR
      const config = require(configPath);
      console.log(config);
    } catch (err) {
      console.error(err)
    }
  } else {

    console.log(`test-package: Couldn't find config file ${configPath}. Using default.`)
  }

  console.log('\n')
}

export { init };
