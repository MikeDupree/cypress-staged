import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    specPattern: "**/*.spec.*",
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
