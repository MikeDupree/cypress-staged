"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const execa_1 = require("@esm2cjs/execa");
const fast_glob_1 = __importDefault(require("fast-glob"));
async function run(config) {
    var _a, _b, _c, _d;
    const { include, projectsPath, types } = config;
    const projectDirs = fast_glob_1.default.sync(`${projectsPath}/`, { onlyDirectories: true });
    const { stdout } = await (0, execa_1.execa)('git', ['diff', '--name-only', '--cached']);
    const files = stdout.split(/\r\n|\n|\r/);
    const pathsToTest = [];
    for (const file of files) {
        let projectPath;
        for (const projectDir of projectDirs) {
            if (file.includes(`${projectDir}/${include}`)) {
                projectPath = projectDir;
            }
        }
        if (projectPath) {
            let filePath = file.replace(`${projectPath}/`, '');
            const pathArr = filePath.split('/');
            pathArr.pop();
            const testPath = pathArr.join('/');
            let existingProject = false;
            for (const i in pathsToTest) {
                if (pathsToTest[i].project === projectPath) {
                    existingProject = true;
                    const directoryName = testPath.replace(`${projectPath}/`, '');
                    if (pathsToTest[i].testPaths.includes(directoryName))
                        continue;
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
    for (const testPath of pathsToTest) {
        const project = testPath.project;
        const specArgs = testPath.testPaths.join(',');
        console.log('\x1b[33mproject: \n %s\x1b[0m', project);
        console.log('\x1b[36mfiles: \n %s\x1b[0m', specArgs);
        if (types.includes('e2e')) {
            (_b = (_a = (0, execa_1.execa)('cypress', [
                'run', '--spec', specArgs
            ], { cwd: `${project}` })) === null || _a === void 0 ? void 0 : _a.stdout) === null || _b === void 0 ? void 0 : _b.pipe(process.stdout);
        }
        if (types.includes('component')) {
            (_d = (_c = (0, execa_1.execa)('cypress', [
                'run', '--component', '--spec', specArgs
            ], { cwd: `${project}` })) === null || _c === void 0 ? void 0 : _c.stdout) === null || _d === void 0 ? void 0 : _d.pipe(process.stdout);
        }
    }
}
exports.run = run;
