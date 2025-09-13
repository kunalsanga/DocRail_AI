import fs from "fs";
import path from "path";

function getDataPath(relativeFile: string): string {
  const root = process.cwd();
  return path.join(root, "src", "data", relativeFile);
}

export async function ensureFile(file: string, initial: unknown): Promise<void> {
  const full = getDataPath(file);
  await fs.promises.mkdir(path.dirname(full), { recursive: true });
  try {
    await fs.promises.access(full, fs.constants.F_OK);
  } catch {
    await fs.promises.writeFile(full, JSON.stringify(initial, null, 2), "utf-8");
  }
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  const full = getDataPath(file);
  try {
    const raw = await fs.promises.readFile(full, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    await ensureFile(file, fallback);
    return fallback;
  }
}

export async function writeJson<T>(file: string, data: T): Promise<void> {
  const full = getDataPath(file);
  await fs.promises.mkdir(path.dirname(full), { recursive: true });
  await fs.promises.writeFile(full, JSON.stringify(data, null, 2), "utf-8");
}


