import{defineConfig}from'vitest/config';export default defineConfig({test:{include:['test/**/*.test.ts'],sequence:{concurrent:false},testTimeout:15000,hookTimeout:15000}})
