import { fileURLToPath } from 'node:url';

export const WEB_DIST_DIR = fileURLToPath(new URL('../../web/dist/', import.meta.url));
