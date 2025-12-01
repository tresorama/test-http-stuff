import { createServer } from "@/server/create-server";
import { CONSTANTS } from '@/constants';
import { createLogger } from "@/utils/logger";

const mainLogger = createLogger('main');

(async function main() {
  try {
    mainLogger.info('Starting!');
    await run();
  } catch (error) {
    mainLogger.error('Error! Main App Crashed', error);
    mainLogger.info('Restarting ...!\n\n\n\n');
    setTimeout(main, 1000);
  }
})();


async function run() {
  await createServer({
    name: 'api',
    baseUrl: `http://localhost:${CONSTANTS.PORT}`,
    port: CONSTANTS.PORT,
  });
}