import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const BUILD_PATH = path.join(__dirname, "..", "dist");
export const SOURCE_PATH = path.join(__dirname, "..", "src");
