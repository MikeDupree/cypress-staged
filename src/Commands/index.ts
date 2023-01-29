import { execa } from '@esm2cjs/execa';
import fg from 'fast-glob';
import {Config} from '../utils/config';

interface TestPath {
  project: string;
  testPaths: string[];
}

async function run(config: Config) {
  const { include, projectPath } = config;

  // Config useful for monorepos with multiple projects,
  // each with their own config
  const projectDirs = fg.sync(`${projectPath}/`, { onlyDirectories: true });
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
  console.log('\x1b[32m%s\x1b[0m', pathsToTest);
  for (const testPath of pathsToTest) {
    execa('cypress', [
      'run', '--spec', testPath.testPaths.join(',')
    ], { cwd: `${testPath.project}` })?.stdout?.pipe(process.stdout);

    execa('cypress', [
      'run', '--component', '--spec', testPath.testPaths.join(',')
    ], { cwd: `${testPath.project}` })?.stdout?.pipe(process.stdout);
  }

}

export { run };
