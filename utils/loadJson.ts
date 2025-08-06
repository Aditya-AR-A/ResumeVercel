import fs from 'fs';
import path from 'path';

/**
 * Loads a JSON file from the /data directory.
 * @param fileName Name of the JSON file (e.g., 'jobs.json')
 */
export function loadJson(fileName: string) {
  const filePath = path.join(process.cwd(), 'data', fileName);
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContents);
}
