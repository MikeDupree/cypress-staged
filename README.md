# Cypress Staged

## A cypress test runner that runs against staged files.

### Installation

Npm

`npm install --save-dev cypress-staged`

Yarn

`yarn add -D cypress-staged`

Pnpm

`pnpm install --save-dev cypress-staged`

### Configuration

create a `cystaged.config.js`

```

module.exports = {
  "projectsPath": "ExampleProjects/*",
  "include": "src",
  "types": [
    "component"
  ]
}
```

Config options:

- `projectsPath`: used for monorepo setup where projects have their own cypess config.

- `include`: include dir which to check for changed files, staged files found under this dir will be tested.

- `types`: array of cypress tests types, `component`, `e2e`, `unit`

