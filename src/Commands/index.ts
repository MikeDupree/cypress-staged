import { execa } from '@esm2cjs/execa';
import fg from 'fast-glob';
import { Config } from '../utils/config';

interface TestPath {
  project: string;
  testPaths: string[];
}

async function run(config: Config) {
  const { include, projectsPath, types, cypressPath = './node_modules/.bin/cypress' } = config;

  // Config useful for monorepos with multiple projects,
  // each with their own config
  const projectDirs = fg.sync(`${projectsPath}/`, { onlyDirectories: true });
  const { stdout } = await execa('git', ['diff', '--name-only', '--cached']);

  // strip return characters
  const files = stdout.split(/\r\n|\n|\r/);

  // Get staged files to test.
  const pathsToTest: TestPath[] = [];
  for (const file of files) {
    let projectPath;

    // Check if this staged entry should be tested.
    for (const projectDir of projectDirs) {
      if (file.includes(`${projectDir}/${include}`)) {
        projectPath = projectDir;
      }
    }

    if (projectPath) {
      // Strip project path from test path
      let filePath = file.replace(`${projectPath}/`, '');
      const pathArr = filePath.split('/');

      // Remove the filename from the array
      // TODO find a better way to remove filename.
      pathArr.pop();

      // create base path to project or module.
      const testPath = pathArr.join('/');
      // Build array of test paths for cypress
      let existingProject = false;
      for (const i in pathsToTest) {
        if (pathsToTest[i].project === projectPath) {
          existingProject = true;
          const directoryName = testPath.replace(`${projectPath}/`, '');
          if (pathsToTest[i].testPaths.includes(directoryName)) continue;
          pathsToTest[i].testPaths.push(directoryName);
        }
      }

      if (!existingProject) {
        pathsToTest.push({
          project: projectPath,
          testPaths: [testPath.replace(`${projectPath}/`, ''),
          ]
        });
      }

    }
  }

  // Run the tests for the staged files.
  for (const testPath of pathsToTest) {
    const project = testPath.project;
    const specArgs = testPath.testPaths.join(',')
    console.log('\x1b[33mproject: \n %s\x1b[0m', project);
    console.log('\x1b[36mfiles: \n %s\x1b[0m', specArgs);

    if (types.includes('e2e')) {
      execa(cypressPath, [
        'run', '--spec', specArgs
      ], { cwd: `${project}` })?.stdout?.pipe(process.stdout);
    }

    if (types.includes('component')) {
      execa(cypressPath, [
        'run', '--component', '--spec', specArgs
      ], { cwd: `${project}` })?.stdout?.pipe(process.stdout);
    }
  }

}

export { run };
