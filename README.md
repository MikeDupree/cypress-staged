# Cypress Staged
## A Staged File Testing Solution for Cypress

### Installation
The following installation methods are supported:

- Npm: `npm install --save-dev @mdupree/cypress-staged`
- Yarn: `yarn add -D @mdupree/cypress-staged`
- Pnpm: `pnpm install --save-dev @mdupree/cypress-staged`

### Configuration
To configure Cypress Staged, create a cystaged.config.js file with the following content:

``` javascript
module.exports = {
  projectsPath: "ExampleProjects/*",
  include: "src",
  types: [ "component" ]
};
```

The following configuration options are available:

- `projectsPath`: The path to the projects, in case of a monorepo setup, where each project has its own Cypress configuration.
- `include`: The directory to check for changes, and all staged files found within this directory will be tested.
- `types`: An array of Cypress test types, including component, e2e, and unit.

### How to use

Commit some changes and run `cypress-staged`
