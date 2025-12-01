import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import z from 'zod';

/** Get ENV VARS that are used inside dev/build server */
const getEnvVars = async (mode: string) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const envVarsRaw = loadEnv(mode, process.cwd(), '');

  const envVars = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    BUILD_ONLY__VITE_ALLOWED_HOSTS: z
      .string().min(1)
      .transform(v => JSON.parse(v ?? '[]'))
      .pipe(z.array(z.string().min(1))),
  }).parse(envVarsRaw);

  // console.log({ envVarsRaw, envVars });

  return envVars;
};


// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const envVars = await getEnvVars(mode);

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      tailwindcss(),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    server: {
      allowedHosts: envVars.BUILD_ONLY__VITE_ALLOWED_HOSTS,
    }
  };
});
